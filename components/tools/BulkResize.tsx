"use client";
import { useEffect, useRef, useState } from "react";
import { fmt, type Lang } from "@/i18n/config";
import type { bulkEn } from "@/i18n/parts/bulk";
import { createCanvas, cropResize, loadImageFile } from "@/lib/image/canvas";
import { fitToByteRange } from "@/lib/image/targetSize";
import { kbToByteBounds } from "@/lib/image/units";
import {
  acceptFiles, EXT, MAX_BULK_FILES, MIME, outputFormat, planResize, shrinkFactor, totals, uniqueName, validateMode,
  type BulkMode, type FormatChoice, type OutFormat,
} from "@/lib/image/bulk";
import { makeZip } from "@/lib/zip";
import { kb } from "./shared";

type Props = { lang: Lang; t: typeof bulkEn };

type Result = { blob: Blob; url: string; name: string; width: number; height: number; tooLarge: boolean };
type Item = {
  id: number;
  file: File;
  thumb: string;
  dims?: { w: number; h: number };
  status: "waiting" | "working" | "done" | "error";
  result?: Result;
};
type ModeKind = BulkMode["kind"];

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/bmp,.jpg,.jpeg,.png,.webp,.gif,.bmp";

/** Header-only size read (no full decode needed), used to plan in the original's pixel space. */
function naturalSize(file: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve({ width: img.naturalWidth, height: img.naturalHeight }); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("decode")); };
    img.src = url;
  });
}

/** Like encodeCanvas but also does WebP and reports what the browser actually produced. */
async function encode(c: HTMLCanvasElement, f: OutFormat, quality: number): Promise<{ bytes: Uint8Array; type: string }> {
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, MIME[f], f === "png" ? undefined : quality));
  if (!blob) throw new Error("encode");
  return { bytes: new Uint8Array(await blob.arrayBuffer()), type: blob.type };
}

function render(src: HTMLCanvasElement, plan: ReturnType<typeof planResize>): HTMLCanvasElement {
  const { width, height, crop, dest } = plan;
  const drawn = cropResize(src, crop, dest.width, dest.height);
  if (dest.width === width && dest.height === height) return drawn;
  const out = createCanvas(width, height);
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(drawn, dest.x, dest.y);
  drawn.width = 0;
  return out;
}

async function processFile(file: File, mode: BulkMode, f: OutFormat, quality: number) {
  // loadImageFile caps very large photos; plan in the original's pixels, then map the crop.
  const natural = await naturalSize(file).catch(() => null);
  // PNG/WebP keep transparency; JPG has none, so it gets a white background.
  const src = await loadImageFile(file, undefined, { background: f === "jpeg" ? "white" : "transparent" });
  try {
    const base = natural && mode.kind !== "kb" ? natural : src;
    const r = src.width / base.width;
    let plan = planResize(base, mode);
    plan = { ...plan, crop: { x: plan.crop.x * r, y: plan.crop.y * r, width: plan.crop.width * r, height: plan.crop.height * r } };

    if (mode.kind !== "kb") {
      const c = render(src.canvas, plan);
      const out = await encode(c, f, quality);
      c.width = 0;
      return { ...out, width: plan.width, height: plan.height, tooLarge: false };
    }

    const bounds = kbToByteBounds(undefined, mode.maxKB);
    for (let round = 0; ; round++) {
      const c = render(src.canvas, plan);
      const fit = await fitToByteRange((q) => encode(c, f, q).then((o) => o.bytes), bounds, { allowPadding: false });
      if (fit.ok || round >= 8 || plan.width <= 16 || plan.height <= 16) {
        const out = fit.ok ? { bytes: fit.bytes, type: MIME[f] } : await encode(c, f, 0.05);
        c.width = 0;
        return { ...out, width: plan.width, height: plan.height, tooLarge: !fit.ok };
      }
      c.width = 0;
      const k = shrinkFactor(bounds.maxBytes, fit.smallest);
      const w = Math.max(16, Math.round(plan.width * k));
      const h = Math.max(16, Math.round(plan.height * k));
      plan = { ...plan, width: w, height: h, dest: { x: 0, y: 0, width: w, height: h } };
    }
  } finally {
    src.canvas.width = 0; // release the big bitmap now, not at GC time
  }
}

export default function BulkResize({ t }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [notice, setNotice] = useState<string[]>([]);
  const [drag, setDrag] = useState(false);
  const [modeKind, setModeKind] = useState<ModeKind>("percent");
  const [percent, setPercent] = useState("50");
  const [w, setW] = useState("1200");
  const [h, setH] = useState("1200");
  const [fill, setFill] = useState<"crop" | "pad">("crop");
  const [maxKB, setMaxKB] = useState("100");
  const [format, setFormat] = useState<FormatChoice>("keep");
  const [quality, setQuality] = useState(85);
  const [webpOk, setWebpOk] = useState(true);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [cancelled, setCancelled] = useState(false);
  const [zipping, setZipping] = useState(false);
  const cancelRef = useRef(false);
  const nextId = useRef(1);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    // Safari before 17 silently returns PNG for WebP; detect once so we can say so.
    const c = createCanvas(1, 1);
    c.toBlob((b) => setWebpOk(!!b && b.type === "image/webp"), "image/webp");
    return () => itemsRef.current.forEach((i) => { URL.revokeObjectURL(i.thumb); if (i.result) URL.revokeObjectURL(i.result.url); });
  }, []);

  const mode: BulkMode =
    modeKind === "percent" ? { kind: "percent", percent: Number(percent) }
    : modeKind === "fit" ? { kind: "fit", width: Number(w), height: Number(h) }
    : modeKind === "exact" ? { kind: "exact", width: Number(w), height: Number(h), fill }
    : { kind: "kb", maxKB: Number(maxKB) };
  const modeError = validateMode(mode);

  /** Any settings change makes earlier results stale. */
  const resetResults = () =>
    setItems((prev) => prev.map((i) => {
      if (i.result) URL.revokeObjectURL(i.result.url);
      return { ...i, status: "waiting", result: undefined };
    }));
  const change = <T,>(set: (v: T) => void) => (v: T) => { set(v); resetResults(); setCancelled(false); };

  function addFiles(files: File[]) {
    const { accepted, unsupported, overLimit } = acceptFiles(items.length, files);
    const msgs: string[] = [];
    if (unsupported) msgs.push(fmt(t.skippedUnsupported, { n: unsupported }));
    if (overLimit) msgs.push(fmt(t.skippedLimit, { n: overLimit, max: MAX_BULK_FILES }));
    setNotice(msgs);
    if (!accepted.length) return;
    setItems((prev) => [
      ...prev,
      ...accepted.map((file) => ({ id: nextId.current++, file, thumb: URL.createObjectURL(file), status: "waiting" as const })),
    ]);
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => {
      if (i.id !== id) return true;
      URL.revokeObjectURL(i.thumb);
      if (i.result) URL.revokeObjectURL(i.result.url);
      return false;
    }));
  }

  function clearAll() {
    items.forEach((i) => { URL.revokeObjectURL(i.thumb); if (i.result) URL.revokeObjectURL(i.result.url); });
    setItems([]);
    setNotice([]);
    setCancelled(false);
  }

  const patch = (id: number, p: Partial<Item>) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)));

  async function run() {
    if (modeError) return;
    const todo = items.filter((i) => i.status !== "done");
    const used = new Set(items.flatMap((i) => (i.result ? [i.result.name.toLowerCase()] : [])));
    cancelRef.current = false;
    setCancelled(false);
    setRunning(true);
    setProgress({ done: 0, total: todo.length });
    // One at a time: a few full-size canvases at once is enough to crash a 2–3 GB phone.
    for (let n = 0; n < todo.length; n++) {
      if (cancelRef.current) break;
      const item = todo[n];
      patch(item.id, { status: "working" });
      try {
        const f = outputFormat(item.file, format, mode, webpOk);
        const out = await processFile(item.file, mode, f, quality / 100);
        // Trust what the encoder produced (e.g. PNG when WebP isn't supported) for the extension.
        const actual = (Object.keys(MIME) as OutFormat[]).find((k) => MIME[k] === out.type) ?? f;
        const blob = new Blob([out.bytes as BlobPart], { type: MIME[actual] });
        const name = uniqueName(item.file.name, EXT[actual], used);
        patch(item.id, { status: "done", result: { blob, url: URL.createObjectURL(blob), name, width: out.width, height: out.height, tooLarge: out.tooLarge } });
      } catch {
        patch(item.id, { status: "error" });
      }
      setProgress({ done: n + 1, total: todo.length });
      await new Promise((r) => setTimeout(r, 0)); // let the progress bar paint
    }
    if (cancelRef.current) setCancelled(true);
    setRunning(false);
  }

  async function downloadZip() {
    setZipping(true);
    try {
      const done = items.filter((i) => i.result);
      const entries = await Promise.all(done.map(async (i) => ({ name: i.result!.name, data: new Uint8Array(await i.result!.blob.arrayBuffer()) })));
      const url = URL.createObjectURL(new Blob([makeZip(entries) as BlobPart], { type: "application/zip" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "resized-images.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } finally {
      setZipping(false);
    }
  }

  const sum = totals(items.map((i) => ({ before: i.file.size, after: i.result?.blob.size })));
  const remaining = items.filter((i) => i.status !== "done").length;
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const showQuality = modeKind !== "kb" && format !== "png";
  const pill = (on: boolean) => `min-h-11 rounded-full border px-4 text-sm ${on ? "border-brand bg-brand text-brand-ink" : "border-line"}`;

  return (
    <div className="space-y-4">
      <div
        className={`card space-y-2 border-2 border-dashed text-center ${drag ? "border-brand" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (!running) addFiles([...e.dataTransfer.files]); }}
      >
        <label className={`${items.length ? "btn-secondary" : "btn-primary"} w-full cursor-pointer ${running ? "pointer-events-none opacity-50" : ""}`}>
          📁 {items.length ? t.addMore : t.choose}
          <input
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            disabled={running}
            onChange={(e) => {
              const files = [...(e.target.files ?? [])];
              e.target.value = "";
              if (files.length) addFiles(files);
            }}
          />
        </label>
        <p className="text-sm text-muted">{fmt(t.dropHint, { max: MAX_BULK_FILES })}</p>
        {notice.map((m) => <p key={m} className="rounded-lg bg-warn-bg p-2 text-sm text-warn" role="status">{m}</p>)}
      </div>

      {items.length > 0 && (
        <>
          <section className="card space-y-3" aria-labelledby="bulk-settings">
            <h2 id="bulk-settings" className="font-semibold">{t.settings}</h2>
            <fieldset disabled={running} className="space-y-3">
              <legend className="mb-1 text-sm">{t.mode}</legend>
              <div className="flex flex-wrap gap-2">
                {(["percent", "fit", "exact", "kb"] as const).map((k) => (
                  <button key={k} type="button" aria-pressed={modeKind === k} className={pill(modeKind === k)} onClick={() => change(setModeKind)(k)}>
                    {t.modes[k]}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted">{t.modeHelp[modeKind]}</p>

              {modeKind === "percent" && (
                <label className="block">
                  <span className="text-sm">{t.percent}</span>
                  <div className="mt-1 flex items-center gap-3">
                    <input type="range" min={5} max={100} step={5} value={Math.min(100, Number(percent) || 0)} onChange={(e) => change(setPercent)(e.target.value)} className="min-h-11 flex-1" aria-label={t.percent} />
                    <input type="number" inputMode="decimal" min={1} max={1000} className="field w-24" value={percent} onChange={(e) => change(setPercent)(e.target.value)} />
                  </div>
                </label>
              )}
              {(modeKind === "fit" || modeKind === "exact") && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm">{t.width}</span>
                    <input type="number" inputMode="numeric" min={1} max={8000} className="field mt-1" value={w} onChange={(e) => change(setW)(e.target.value)} />
                  </label>
                  <label className="block">
                    <span className="text-sm">{t.height}</span>
                    <input type="number" inputMode="numeric" min={1} max={8000} className="field mt-1" value={h} onChange={(e) => change(setH)(e.target.value)} />
                  </label>
                </div>
              )}
              {modeKind === "exact" && (
                <div>
                  <span className="text-sm">{t.fill}</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {(["crop", "pad"] as const).map((k) => (
                      <button key={k} type="button" aria-pressed={fill === k} className={pill(fill === k)} onClick={() => change(setFill)(k)}>{t.fills[k]}</button>
                    ))}
                  </div>
                </div>
              )}
              {modeKind === "kb" && (
                <label className="block">
                  <span className="text-sm">{t.maxKB}</span>
                  <input type="number" inputMode="numeric" min={2} className="field mt-1" value={maxKB} onChange={(e) => change(setMaxKB)(e.target.value)} />
                </label>
              )}
              {modeError && <p className="text-sm text-bad" role="alert">{t.errors[modeError]}</p>}

              <label className="block">
                <span className="text-sm">{t.format}</span>
                <select className="field mt-1" value={format} onChange={(e) => change(setFormat)(e.target.value as FormatChoice)}>
                  {(["keep", "jpeg", "png", "webp"] as const).map((k) => <option key={k} value={k}>{t.formats[k]}</option>)}
                </select>
              </label>
              <p className="text-xs text-muted">{t.formatNote}</p>
              {!webpOk && (format === "webp" || items.some((i) => /webp$/i.test(i.file.type))) && <p className="text-xs text-warn">{t.webpUnsupported}</p>}
              {showQuality && (
                <label className="block">
                  <span className="text-sm">{fmt(t.quality, { q: quality })}</span>
                  <input type="range" min={10} max={100} step={5} value={quality} onChange={(e) => change(setQuality)(Number(e.target.value))} className="mt-1 min-h-11 w-full" />
                </label>
              )}
            </fieldset>

            {!running ? (remaining > 0 || !sum.done) && (
              <button type="button" className="btn-primary w-full text-lg" disabled={!!modeError || remaining === 0} onClick={run}>
                {fmt(t.start, { n: remaining })}
              </button>
            ) : (
              <div className="space-y-2" aria-live="polite">
                <div className="flex items-center justify-between text-sm">
                  <span>{fmt(t.progress, { done: progress.done, total: progress.total })}</span>
                  <span className="text-muted">{pct}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.done}>
                  <div className="h-full bg-brand transition-[width]" style={{ width: `${pct}%` }} />
                </div>
                <button type="button" className="btn-secondary w-full" onClick={() => { cancelRef.current = true; }}>{t.cancel}</button>
              </div>
            )}
            {cancelled && !running && <p className="text-sm text-warn" role="status">{t.cancelled}</p>}
          </section>

          {sum.done > 0 && (
            <section className="card space-y-2" aria-live="polite">
              <p className="font-semibold">{fmt(t.summary, { before: kb(sum.before), after: kb(sum.after) })}</p>
              <p className={`text-sm ${sum.savedPercent >= 0 ? "text-ok" : "text-warn"}`}>
                {sum.savedPercent >= 0 ? fmt(t.saved, { p: sum.savedPercent }) : fmt(t.bigger, { p: -sum.savedPercent })}
              </p>
              <button type="button" className="btn-primary w-full" disabled={running || zipping} onClick={downloadZip}>
                ⬇️ {zipping ? t.zipping : t.downloadAll}
              </button>
            </section>
          )}

          <section className="card space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{fmt(t.count, { n: items.length })}</h2>
              <button type="button" className="min-h-11 px-2 text-sm text-bad" disabled={running} onClick={clearAll}>{t.clear}</button>
            </div>
            <ul className="divide-y divide-line">
              {items.map((i) => (
                <li key={i.id} className="flex items-center gap-3 py-2 text-sm">
                  <img
                    src={i.thumb}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-12 shrink-0 rounded-lg border border-line object-cover"
                    onLoad={(e) => { const im = e.currentTarget; if (!i.dims) patch(i.id, { dims: { w: im.naturalWidth, h: im.naturalHeight } }); }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{i.result?.name ?? i.file.name}</p>
                    <p className="text-muted">{kb(i.file.size)} KB{i.dims && ` · ${i.dims.w}×${i.dims.h}`}</p>
                    {i.result && <p className="text-ok">→ {kb(i.result.blob.size)} KB · {i.result.width}×{i.result.height}</p>}
                    {i.status === "working" && <p className="text-brand">{t.working}</p>}
                    {i.status === "error" && <p className="text-bad">{t.failed}</p>}
                    {i.result?.tooLarge && <p className="text-warn">{t.tooLarge}</p>}
                  </div>
                  {i.result && (
                    <a className="btn-primary min-h-11 shrink-0 px-3 text-sm" href={i.result.url} download={i.result.name} aria-label={`${t.download} ${i.result.name}`}>⬇️</a>
                  )}
                  <button type="button" aria-label={`${t.remove} ${i.file.name}`} disabled={running} onClick={() => removeItem(i.id)} className="h-11 w-11 shrink-0 rounded-lg border border-line disabled:opacity-30">✕</button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
      <p className="text-center text-xs text-muted">🔒 {t.privacy}</p>
    </div>
  );
}
