"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { fmt, type Lang } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import type { DocKind, DocSpec } from "@/lib/exams/schema";
import { formatLabel, kbRangeLabel, pxLabel } from "@/lib/exams/describe";
import { cropResize, getPixels, loadImageFile, rotate90, type Source } from "@/lib/image/canvas";
import { expandToAspect, initialCrop, scaleCrop, type Rect } from "@/lib/image/crop";
import { cropAspect, processDocument, type ProcessResult } from "@/lib/image/pipeline";
import { cleanInk, inkBounds, type InkColor } from "@/lib/image/pixels";
import { DEFAULT_ASPECT, DEFAULT_DPI, dimsWithinSpec, formatKB, kbToByteBounds, resolveTargetDims } from "@/lib/image/units";
import { formatDDMMYYYY, todayYMD } from "@/lib/date";
import { setLastExam } from "@/lib/prefs";
import Cropper from "./Cropper";

export type DocResizerProps = {
  lang: Lang;
  kind: DocKind;
  t: Dict["tool"];
  docName: string;
  /** Exam mode: the exam's rules for this document. */
  exam?: { slug: string; name: string; spec: DocSpec; nameDate?: boolean };
  /** Generic mode presets (keyword pages). */
  preset?: { maxKB?: number; minKB?: number };
};

type Settings = { w: string; h: string; minKB: string; maxKB: string; dpi: string; format: "jpeg" | "png"; aspect: string };

const ASPECTS: Record<string, number | null> = { free: null, passport: 3.5 / 4.5, square: 1, signature: 3 };

const num = (s: string) => {
  const n = Number(s);
  return s.trim() !== "" && Number.isFinite(n) && n > 0 ? n : undefined;
};

export default function DocResizer({ lang, kind, t, docName, exam, preset }: DocResizerProps) {
  const isInk = kind !== "photo";
  const [source, setSource] = useState<Source | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [crop, setCrop] = useState<Rect | null>(null);
  const [custom, setCustom] = useState(!exam);
  const [settings, setSettings] = useState<Settings>(() => ({
    w: "",
    h: "",
    minKB: preset?.minKB ? String(preset.minKB) : "",
    maxKB: String(preset?.maxKB ?? (kind === "photo" ? 50 : 20)),
    dpi: String(DEFAULT_DPI),
    format: "jpeg",
    aspect: kind === "signature" ? "signature" : "free",
  }));
  const [clean, setClean] = useState(isInk);
  const [ink, setInk] = useState<InkColor>("black");
  const [threshold, setThreshold] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState(() => formatDDMMYYYY(todayYMD()));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<(ProcessResult & { url: string }) | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const withNameDate = !!exam?.nameDate && kind === "photo" && !custom;

  // The rules actually in force: the exam's, or the user's own settings.
  const spec: DocSpec = useMemo(() => {
    if (exam && !custom) return exam.spec;
    const fmtList: DocSpec["format"] = settings.format === "png" ? ["png"] : ["jpg"];
    return {
      format: fmtList,
      maxKB: num(settings.maxKB) ?? 100000,
      minKB: num(settings.minKB),
      widthPx: num(settings.w) ? Math.round(num(settings.w)!) : undefined,
      heightPx: num(settings.h) ? Math.round(num(settings.h)!) : undefined,
      dpi: num(settings.dpi) ? Math.round(num(settings.dpi)!) : undefined,
    };
  }, [exam, custom, settings]);

  const hasKbTarget = !!(exam && !custom) || num(settings.maxKB) !== undefined;

  const aspect = useMemo(() => {
    const base = resolveTargetDims(spec, kind);
    if (base.aspect !== null) return cropAspect(base, withNameDate);
    if (exam && !custom) return DEFAULT_ASPECT[kind];
    return ASPECTS[settings.aspect] ?? null;
  }, [spec, kind, withNameDate, exam, custom, settings.aspect]);

  // Re-fit the crop box whenever the aspect or image changes.
  useEffect(() => {
    if (source) setCrop((c) => (c ? expandToAspect(c, aspect, source.width, source.height) : initialCrop(source.width, source.height, aspect)));
  }, [aspect, source]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);
  useEffect(() => { if (exam) setLastExam(exam.slug); }, [exam]);

  // Any change after a result makes it stale.
  useEffect(() => setResult(null), [crop, spec, clean, ink, threshold, name, date]);

  async function showSource(s: Source, resetCrop: boolean) {
    setSource(s);
    const blob = await new Promise<Blob | null>((r) => s.canvas.toBlob(r, "image/jpeg", 0.85));
    if (blob) setPreview(URL.createObjectURL(blob));
    if (resetCrop) setCrop(initialCrop(s.width, s.height, aspect));
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setResult(null);
    try {
      await showSource(await loadImageFile(file), true);
    } catch {
      setError(t.readError);
    }
  }

  function autoCrop() {
    if (!source) return;
    const scale = Math.min(1, 600 / Math.max(source.width, source.height));
    const small = cropResize(source.canvas, { x: 0, y: 0, width: source.width, height: source.height }, Math.round(source.width * scale), Math.round(source.height * scale));
    const img = getPixels(small);
    const px = { data: img.data, width: img.width, height: img.height };
    cleanInk(px, { ink: "black", threshold: threshold ?? undefined });
    const b = inkBounds(px);
    if (!b) return;
    setCrop(expandToAspect({ x: b.x / scale, y: b.y / scale, width: b.width / scale, height: b.height / scale }, aspect, source.width, source.height));
  }

  async function run() {
    if (!source || !crop) return;
    setBusy(true);
    setError("");
    try {
      const target = resolveTargetDims(spec, kind, { width: crop.width, height: crop.height });
      const bounds = hasKbTarget ? kbToByteBounds(spec.minKB, spec.maxKB) : null;
      const r = await processDocument({
        source: source.canvas,
        crop,
        kind,
        target,
        bounds,
        format: spec.format.includes("jpg") || spec.format.includes("jpeg") ? "jpeg" : "png",
        clean: isInk && clean ? { ink, threshold: threshold ?? undefined } : null,
        nameDate: withNameDate && name.trim() ? { name: name.trim().toUpperCase(), date } : null,
        allowDownscale: !exam || custom ? !(num(settings.w) && num(settings.h)) : false,
      });
      setResult({ ...r, url: URL.createObjectURL(r.blob) });
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const ext = spec.format.includes("png") && !spec.format.includes("jpg") && !spec.format.includes("jpeg") ? "png" : "jpg";
  const filename = `${exam?.slug ?? "formsaathi"}-${kind}${result ? `-${result.width}x${result.height}` : ""}.${ext}`;

  // Checklist for the result.
  const checks = useMemo(() => {
    if (!result) return [];
    const list: { ok: boolean; text: string }[] = [];
    list.push({ ok: true, text: fmt(t.checkFormat, { format: ext.toUpperCase() }) });
    if (hasKbTarget) {
      const bounds = kbToByteBounds(spec.minKB, spec.maxKB);
      list.push({
        ok: result.bytes >= bounds.minBytes && result.bytes <= bounds.maxBytes,
        text: fmt(t.checkSize, { kb: formatKB(result.bytes), range: kbRangeLabel(spec.minKB, spec.maxKB, lang) }),
      });
    }
    const req = pxLabel(spec);
    if (req) list.push({ ok: dimsWithinSpec(spec, result.width, result.height), text: fmt(t.checkDims, { w: result.width, h: result.height, req }) });
    else if (spec.widthCm && spec.heightCm) {
      const dpi = spec.dpi ?? DEFAULT_DPI;
      list.push({ ok: true, text: fmt(t.checkCm, { cm: `${spec.widthCm} × ${spec.heightCm} cm`, dpi, w: result.width, h: result.height }) });
    }
    if (result.background && exam && !custom && (spec.background === "white" || spec.background === "light")) {
      const v = result.background.verdict;
      const ok = v === "white" || (v === "light" && spec.background !== "white");
      list.push({ ok, text: fmt(t.checkBg, { verdict: v === "white" ? t.bgWhite : v === "light" ? t.bgLight : t.bgDark }) });
    }
    if (withNameDate) list.push({ ok: !!name.trim(), text: t.checkNameDate });
    return list;
  }, [result, spec, hasKbTarget, t, lang, ext, withNameDate, name, exam]);
  const allOk = checks.every((c) => c.ok) && !result?.sizeError;

  const set = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setSettings((s) => ({ ...s, [k]: e.target.value }));

  return (
    <div className="card space-y-4">
      {/* Step 1: upload */}
      {!source ? (
        <div className="grid grid-cols-2 gap-3">
          <label className="btn-primary cursor-pointer">
            📁 {t.upload}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          <label className="btn-secondary cursor-pointer">
            📷 {t.camera}
            <input type="file" accept="image/*" capture={kind === "photo" ? "user" : "environment"} className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
        </div>
      ) : (
        <>
          {/* Step 2: adjust */}
          {preview && crop && (
            <Cropper src={preview} imgW={source.width} imgH={source.height} crop={crop} aspect={aspect} onChange={setCrop} guide={kind === "photo" ? "face" : "none"} label={t.dragHint} />
          )}
          <p className="text-center text-sm text-muted">{t.dragHint}</p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="btn-secondary cursor-pointer px-3 text-sm">
              {t.change}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            <button type="button" className="btn-secondary px-3 text-sm" onClick={() => showSource(rotate90(source), true)}>
              ⟳ {t.rotate}
            </button>
            {isInk && (
              <button type="button" className="btn-secondary px-3 text-sm" onClick={autoCrop}>
                ✂️ {t.autoCrop}
              </button>
            )}
          </div>
          {crop && (
            <label className="block text-sm">
              {t.zoom}
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.01}
                className="mt-1 w-full"
                value={Math.min(1, crop.width / (aspect ? Math.min(source.width, source.height * aspect) : source.width))}
                onChange={(e) => {
                  const full = aspect ? Math.min(source.width, source.height * aspect) : source.width;
                  setCrop(scaleCrop(crop, (Number(e.target.value) * full) / crop.width, source.width, source.height, aspect));
                }}
              />
            </label>
          )}
        </>
      )}

      {/* Ink cleanup */}
      {isInk && (
        <fieldset className="space-y-2 rounded-xl border border-line p-3">
          <label className="flex min-h-11 items-center gap-3">
            <input type="checkbox" className="h-5 w-5" checked={clean} onChange={(e) => setClean(e.target.checked)} />
            {t.clean}
          </label>
          {clean && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span>{t.ink}:</span>
                {(["black", "blue"] as const).map((c) => (
                  <button key={c} type="button" aria-pressed={ink === c} onClick={() => setInk(c)} className={`min-h-10 rounded-full border px-4 ${ink === c ? "border-brand bg-brand text-brand-ink" : "border-line"}`}>
                    {c === "black" ? t.inkBlack : t.inkBlue}
                  </button>
                ))}
              </div>
              <label className="block text-sm">
                {t.threshold}: {threshold ?? t.auto}
                <input type="range" min={60} max={230} value={threshold ?? 160} onChange={(e) => setThreshold(Number(e.target.value))} className="mt-1 w-full" />
              </label>
              {threshold !== null && (
                <button type="button" className="text-sm underline" onClick={() => setThreshold(null)}>{t.auto}</button>
              )}
            </>
          )}
        </fieldset>
      )}

      {/* Name & date strip (exams that need it) */}
      {withNameDate && (
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            {t.name}
            <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
          <label className="text-sm">
            {t.date}
            <input className="field mt-1" value={date} onChange={(e) => setDate(e.target.value)} inputMode="numeric" placeholder="DD/MM/YYYY" />
          </label>
        </div>
      )}

      {/* Size settings */}
      {exam && !custom ? (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-bg p-3 text-sm">
          <span>
            ✅ {fmt(t.examRules, { exam: exam.name })}: {formatLabel(spec)}, {kbRangeLabel(spec.minKB, spec.maxKB, lang)}
            {pxLabel(spec) ? `, ${pxLabel(spec)}` : ""}
            {!spec.widthPx && spec.widthCm ? `, ${spec.widthCm}×${spec.heightCm} cm` : ""}
            {!spec.widthPx && spec.widthCm && !spec.dpi && <span className="block text-muted">{fmt(t.dpiNote, { dpi: DEFAULT_DPI })}</span>}
          </span>
          <button
            type="button"
            className="shrink-0 underline"
            onClick={() => {
              const d = resolveTargetDims(spec, kind, crop ?? undefined);
              setSettings((s) => ({ ...s, w: String(d.width), h: String(d.height), minKB: spec.minKB ? String(spec.minKB) : "", maxKB: String(spec.maxKB), dpi: String(d.dpi) }));
              setCustom(true);
            }}
          >
            {t.customize}
          </button>
        </div>
      ) : (
        <details className="rounded-xl border border-line p-3" open={!preset}>
          <summary className="min-h-8 cursor-pointer font-semibold">{t.settings}</summary>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <label>{t.widthPx}<input className="field mt-1" inputMode="numeric" value={settings.w} onChange={set("w")} placeholder={t.anySize} /></label>
            <label>{t.heightPx}<input className="field mt-1" inputMode="numeric" value={settings.h} onChange={set("h")} placeholder={t.anySize} /></label>
            <label>{t.minKB}<input className="field mt-1" inputMode="decimal" value={settings.minKB} onChange={set("minKB")} placeholder="—" /></label>
            <label>{t.maxKB}<input className="field mt-1" inputMode="decimal" value={settings.maxKB} onChange={set("maxKB")} placeholder="—" /></label>
            {!(num(settings.w) && num(settings.h)) && (
              <label className="col-span-2">
                {t.cropShape}
                <select className="field mt-1" value={settings.aspect} onChange={set("aspect")}>
                  <option value="free">{t.aspectFree}</option>
                  <option value="passport">{t.aspectPassport} 3.5 × 4.5</option>
                  <option value="square">1 : 1</option>
                  <option value="signature">3 : 1</option>
                </select>
              </label>
            )}
            <label>{t.dpi}<input className="field mt-1" inputMode="numeric" value={settings.dpi} onChange={set("dpi")} /></label>
            <label>
              {t.format}
              <select className="field mt-1" value={settings.format} onChange={set("format")}>
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </label>
          </div>
        </details>
      )}

      {/* Step 3: make + download. Nothing (ads included) goes between these. */}
      <button type="button" className="btn-primary w-full text-lg" disabled={!source || busy} onClick={run}>
        {busy ? t.processing : fmt(t.process, { doc: docName })}
      </button>
      {error && <p role="alert" className="text-bad">{error}</p>}

      {result && (
        <div ref={resultRef} className="space-y-3 rounded-xl border-2 border-ok/50 p-3" aria-live="polite">
          <div className="flex items-start gap-3">
            <img
              src={result.url}
              alt=""
              width={result.width}
              height={result.height}
              className="h-auto max-h-48 w-auto max-w-[45%] rounded border border-line bg-white"
            />
            <div className="space-y-1 text-sm">
              <p className="text-base font-semibold">
                {fmt(t.yourFile, { doc: docName, kb: formatKB(result.bytes), w: result.width, h: result.height })} {allOk ? "✅" : "⚠️"}
              </p>
              <ul className="space-y-1">
                {checks.map((c) => (
                  <li key={c.text} className={c.ok ? "text-ok" : "text-warn"}>
                    {c.ok ? "✅" : "⚠️"} {c.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className={`font-semibold ${allOk ? "text-ok" : "text-warn"}`}>
            {allOk ? `✅ ${exam && !custom ? fmt(t.meets, { exam: exam.name }) : t.meetsGeneric}` : t.needsAttention}
          </p>
          {result.padded && <p className="text-sm text-muted">{t.padded}</p>}
          {result.downscaled && <p className="text-sm text-muted">{fmt(t.downscaled, { kb: spec.maxKB })}</p>}
          {result.sizeError && <p className="text-sm text-bad">{fmt(t.tooLarge, { kb: spec.maxKB })}</p>}
          <a href={result.url} download={filename} className="btn-primary w-full text-lg">
            ⬇️ {t.download}
          </a>
        </div>
      )}
    </div>
  );
}

