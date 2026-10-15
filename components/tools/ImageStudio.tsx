"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { fmt, type Lang } from "@/i18n/config";
import type { studioEn } from "@/i18n/parts/studio";
import { canEncodeWebp, cropResize, flip, loadImageFile, rotateBy, type Source } from "@/lib/image/canvas";
import type { Rect } from "@/lib/image/crop";
import { FORMAT_LABEL, formatForInput, historyOverflow, looksLikeHeic, outputName, type Dims, type OpTag, type OutFormat } from "@/lib/image/edit";
import { kb, useObjectUrl } from "./shared";
import CropPanel from "./studio/CropPanel";
import { CompressPanel, ConvertPanel, RotatePanel, type RotateAction } from "./studio/OutputPanels";
import { renderStep, type OutSettings, type Rendered, type Step } from "./studio/render";
import ResizePanel from "./studio/ResizePanel";

export type StudioTab = "resize" | "crop" | "compress" | "convert" | "rotate";
export type StudioPreset = { widthPx?: number; heightPx?: number; maxKB?: number; to?: "jpeg" | "png" | "webp" };

type Props = { lang: Lang; t: typeof studioEn; initialTab?: StudioTab; preset?: StudioPreset };

type Loaded = { file: File; natural: Dims; first: Step };

const TABS: { id: StudioTab; icon: string }[] = [
  { id: "resize", icon: "↔️" },
  { id: "crop", icon: "✂️" },
  { id: "compress", icon: "🗜️" },
  { id: "convert", icon: "🔄" },
  { id: "rotate", icon: "⟳" },
];
const ACCEPT = "image/*,.heic,.heif";
const HISTORY_MAX = 10;
// Lets React paint the busy state before a synchronous canvas operation blocks the thread.
const nextFrame = () => new Promise((r) => setTimeout(r, 30));

export default function ImageStudio({ lang, t, initialTab = "resize", preset }: Props) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [step, setStep] = useState<Step | null>(null);
  const [history, setHistory] = useState<Step[]>([]);
  const [tab, setTab] = useState<StudioTab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rendered, setRendered] = useState<Rendered | null>(null);
  const [rendering, setRendering] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [webpOk, setWebpOk] = useState(true);
  const renderSeq = useRef(0);
  const url = useObjectUrl(rendered?.blob ?? null);

  useEffect(() => setWebpOk(canEncodeWebp()), []);

  const openFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setError("");
      const heic = looksLikeHeic(file.type, file.name);
      if (file.type && !file.type.startsWith("image/") && !heic) return setError(t.notImage);
      setBusy(true);
      await nextFrame();
      try {
        const s = await loadImageFile(file, undefined, { background: "transparent" });
        const webp = canEncodeWebp();
        let format = formatForInput(file.type, file.name);
        if (format === "webp" && !webp) format = "png";
        const out: OutSettings = { format, mode: "auto", quality: 0.8, targetKB: 100 };
        const ops: OpTag[] = [];
        // Keyword pages ("convert to JPG", "compress to 50 KB") start with that output already set.
        if (preset?.to && (preset.to !== "webp" || webp) && preset.to !== format) {
          out.format = preset.to;
          ops.push("converted");
        }
        if (preset?.maxKB) {
          out.mode = "target";
          out.targetKB = preset.maxKB;
          ops.push("compressed");
        }
        const first: Step = { src: { canvas: s.canvas, width: s.width, height: s.height }, ops, out };
        setLoaded({ file, natural: { width: s.originalWidth, height: s.originalHeight }, first });
        setStep(first);
        setHistory([]);
      } catch {
        setError(heic ? t.heicError : t.readError);
      } finally {
        setBusy(false);
      }
    },
    [t, preset],
  );

  // Paste an image from the clipboard (Ctrl+V / long-press paste) anywhere on the page.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = [...(e.clipboardData?.items ?? [])].find((i) => i.kind === "file" && i.type.startsWith("image/"));
      const f = item?.getAsFile();
      if (!f) return;
      e.preventDefault();
      const ext = f.type.split("/")[1] || "png";
      openFile(f.name && f.name !== "image.png" ? f : new File([f], `pasted.${ext}`, { type: f.type }));
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [openFile]);

  // Re-encode whenever the working image or output settings change; stale runs are dropped.
  useEffect(() => {
    if (!step || !loaded) return;
    const seq = ++renderSeq.current;
    setRendering(true);
    const id = setTimeout(async () => {
      try {
        const r = await renderStep(step, loaded.file, loaded.natural);
        if (seq === renderSeq.current) setRendered(r);
      } catch {
        if (seq === renderSeq.current) setError(t.readError);
      } finally {
        if (seq === renderSeq.current) setRendering(false);
      }
    }, 60);
    return () => clearTimeout(id);
  }, [step, loaded, t]);

  function commit(next: Step) {
    if (!step) return;
    const stack = [...history, step];
    const drop = historyOverflow(stack.map((s) => s.src.width * s.src.height), HISTORY_MAX);
    setHistory(stack.slice(drop));
    setStep(next);
  }

  async function applyCanvas(fn: (s: Source) => Source, op: OpTag) {
    if (!step) return;
    setBusy(true);
    await nextFrame();
    try {
      commit({ ...step, src: fn(step.src), ops: [...step.ops, op] });
    } finally {
      setBusy(false);
    }
  }

  const resize = (d: Dims) =>
    applyCanvas((s) => ({ canvas: cropResize(s.canvas, { x: 0, y: 0, width: s.width, height: s.height }, d.width, d.height), ...d }), "resized");

  const crop = (r: Rect) =>
    applyCanvas((s) => {
      const rect = { x: Math.round(r.x), y: Math.round(r.y), width: Math.max(1, Math.round(r.width)), height: Math.max(1, Math.round(r.height)) };
      return { canvas: cropResize(s.canvas, rect, rect.width, rect.height), width: rect.width, height: rect.height };
    }, "cropped");

  const rotate = (a: RotateAction) =>
    applyCanvas((s) => (a === "h" || a === "v" ? flip(s, a) : rotateBy(s, a === "left" ? 270 : a === "right" ? 90 : 180)), a === "h" || a === "v" ? "flipped" : "rotated");

  const setOut = (out: OutSettings) => {
    if (!step) return;
    const op: OpTag = out.format !== step.out.format ? "converted" : "compressed";
    // A KB target doesn't carry over to lossless PNG (it would just shrink the pixels), so drop its tag too.
    const ops = out.mode === "auto" ? step.ops.filter((o) => o !== "compressed") : step.ops;
    commit({ ...step, out, ops: out.mode === "auto" && op === "compressed" ? ops : [...ops, op] });
  };

  const undo = () => {
    if (!history.length) return;
    setStep(history[history.length - 1]);
    setHistory(history.slice(0, -1));
  };

  const startOver = () => {
    if (!loaded) return;
    setStep(loaded.first);
    setHistory([]);
  };

  const pickInputs = <input type="file" accept={ACCEPT} className="sr-only" onChange={(e) => { openFile(e.target.files?.[0]); e.target.value = ""; }} />;

  // Empty state: big drop zone + camera on touch devices.
  if (!loaded || !step) {
    return (
      <div className="card space-y-3" lang={lang}>
        <label
          className={`flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition ${dragOver ? "border-brand bg-brand/10" : "border-line"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); openFile(e.dataTransfer.files?.[0]); }}
        >
          <span aria-hidden className="text-5xl">🖼️</span>
          <span className="text-lg font-semibold">{busy ? t.working : t.drop}</span>
          <span className="text-sm text-muted">{t.dropSub}</span>
          <span className="btn-primary mt-1 px-8">📁 {t.choose}</span>
          {pickInputs}
        </label>
        <label className="btn-secondary w-full cursor-pointer pointer-fine:hidden">
          📷 {t.camera}
          <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => { openFile(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
        {error && <p role="alert" className="text-sm text-bad">{error}</p>}
        <p className="text-center text-xs text-muted">🔒 {t.privacy}</p>
      </div>
    );
  }

  const fmtOut = rendered ? FORMAT_LABEL[rendered.format] : FORMAT_LABEL[step.out.format];
  const name = outputName(loaded.file.name, step.ops, step.out.format);
  const working = busy || rendering;
  const currentDims = { width: step.src.width, height: step.src.height };
  const firstDims = { width: loaded.first.src.width, height: loaded.first.src.height };

  return (
    <div
      className="card relative space-y-4 px-3 sm:px-4"
      lang={lang}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); openFile(e.dataTransfer.files?.[0]); }}
    >
      <div className="grid grid-cols-3 gap-2">
        <button type="button" className="btn-secondary min-h-11 px-2 text-sm" disabled={!history.length || busy} onClick={undo}>↶ {t.undo}</button>
        <button type="button" className="btn-secondary min-h-11 px-2 text-sm" disabled={(!history.length && step === loaded.first) || busy} onClick={startOver}>⟲ {t.startOver}</button>
        <label className="btn-secondary min-h-11 cursor-pointer px-2 text-sm">
          {t.newImage}
          {pickInputs}
        </label>
      </div>

      <div role="tablist" className="grid grid-cols-5 gap-1 rounded-xl border border-line p-1">
        {TABS.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={tab === x.id}
            onClick={() => setTab(x.id)}
            className={`flex min-h-14 min-w-0 flex-col items-center justify-center rounded-lg px-0.5 text-[11px] leading-tight sm:text-sm ${tab === x.id ? "bg-brand text-brand-ink" : ""}`}
          >
            <span aria-hidden className="text-lg">{x.icon}</span>
            <span className="max-w-full truncate">{t.tabs[x.id]}</span>
          </button>
        ))}
      </div>

      {tab === "crop" && url ? (
        <CropPanel t={t} src={url} current={currentDims} onApply={crop} />
      ) : (
        <>
          <div
            className="relative flex min-h-40 items-center justify-center overflow-hidden rounded-xl border border-line"
            style={{ background: "repeating-conic-gradient(#8882 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}
          >
            {url && <img src={url} alt="" className="block max-h-[55vh] w-auto max-w-full object-contain" />}
            {working && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-sm font-semibold text-white" aria-live="polite">
                ⏳ {t.working}
              </div>
            )}
          </div>
          <p className="text-center text-sm text-muted">
            {fmt(t.current, { w: currentDims.width, h: currentDims.height, size: kb(rendered?.blob.size ?? loaded.file.size) })}
          </p>
          <div role="tabpanel">
            {tab === "resize" && <ResizePanel t={t} current={currentDims} original={firstDims} preset={preset} onApply={resize} />}
            {tab === "compress" && <CompressPanel t={t} out={step.out} originalBytes={loaded.file.size} rendered={rendered} onApply={setOut} />}
            {tab === "convert" && <ConvertPanel t={t} format={step.out.format} webpOk={webpOk} onPick={(f: OutFormat) => setOut({ ...step.out, format: f, mode: f === "png" ? "auto" : step.out.mode })} />}
            {tab === "rotate" && <RotatePanel t={t} onAction={rotate} />}
          </div>
        </>
      )}

      {error && <p role="alert" className="text-sm text-bad">{error}</p>}

      <div className="sticky bottom-2 z-10 rounded-xl border border-line bg-surface p-2 shadow-lg">
        <a
          className={`btn-primary w-full ${!rendered || working ? "pointer-events-none opacity-60" : ""}`}
          href={url || undefined}
          download={rendered?.untouched ? loaded.file.name : name}
          aria-disabled={!rendered || working}
        >
          {working ? `⏳ ${t.working}` : `⬇️ ${t.download}`}
        </a>
        {rendered && (
          <p className="mt-1 text-center text-xs text-muted" aria-live="polite">
            {fmt(t.outMeta, { w: rendered.width, h: rendered.height, format: fmtOut, size: kb(rendered.blob.size) })}
            {rendered.untouched && ` · ${t.untouched}`}
          </p>
        )}
      </div>
    </div>
  );
}

