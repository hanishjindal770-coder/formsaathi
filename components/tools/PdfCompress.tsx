"use client";
import { useState } from "react";
import { fmt } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import type { CompressProgress, CompressResult } from "@/lib/pdf/compress";
import { FilePick, kb, pdfBlob, readBytes, useObjectUrl } from "./shared";

const PRESETS = [100, 200, 300, 500];

export default function PdfCompress({ t, preset }: { t: Dict["pdf"]; preset?: { maxKB?: number } }) {
  const [file, setFile] = useState<{ name: string; bytes: Uint8Array } | null>(null);
  const [target, setTarget] = useState<number>(preset?.maxKB ?? 200);
  const [custom, setCustom] = useState(preset?.maxKB && !PRESETS.includes(preset.maxKB) ? String(preset.maxKB) : "");
  const [progress, setProgress] = useState<CompressProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CompressResult | null>(null);
  const targetKB = Number(custom) > 0 ? Number(custom) : target;
  const url = useObjectUrl(result?.ok ? pdfBlob(result.bytes) : null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const { compressPdf } = await import("@/lib/pdf/compress");
      setResult(await compressPdf(file.bytes, Math.floor(targetKB * 1000), setProgress));
    } catch {
      setError(t.readError);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <div className="card space-y-4">
      <FilePick label={file ? file.name : t.choosePdf} accept="application/pdf,.pdf" primary={!file} onFiles={async ([f]) => { setResult(null); setFile({ name: f.name, bytes: await readBytes(f) }); }} />
      {file && <p className="text-sm text-muted">{kb(file.bytes.length)} KB</p>}
      <fieldset>
        <legend className="mb-2 text-sm">{t.target}</legend>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p} type="button" aria-pressed={!custom && target === p} onClick={() => { setTarget(p); setCustom(""); setResult(null); }} className={`min-h-11 rounded-full border px-4 ${!custom && target === p ? "border-brand bg-brand text-brand-ink" : "border-line"}`}>
              {p} KB
            </button>
          ))}
          <input className="field w-28" inputMode="numeric" placeholder={t.custom} aria-label={t.custom} value={custom} onChange={(e) => { setCustom(e.target.value.replace(/\D/g, "")); setResult(null); }} />
        </div>
      </fieldset>
      <button type="button" className="btn-primary w-full text-lg" disabled={!file || busy} onClick={run}>
        {busy ? (progress ? fmt(t.working, progress) : "…") : t.compress}
      </button>
      {error && <p role="alert" className="text-bad">{error}</p>}
      {result && (
        <div className="space-y-2 rounded-xl border-2 border-ok/50 p-3" aria-live="polite">
          {result.ok ? (
            <>
              <p className="text-lg font-semibold">{fmt(t.result, { kb: kb(result.bytes.length), pages: result.pages })} ✅</p>
              <p className="text-sm text-muted">{result.unchanged ? fmt(t.alreadySmall, { kb: targetKB }) : t.scanNote}</p>
              <a className="btn-primary w-full text-lg" href={url} download={file!.name.replace(/\.pdf$/i, "") + `-${targetKB}kb.pdf`}>⬇️ {t.download}</a>
            </>
          ) : (
            <p className="text-bad">{fmt(t.tooBig, { kb: targetKB })}</p>
          )}
        </div>
      )}
    </div>
  );
}
