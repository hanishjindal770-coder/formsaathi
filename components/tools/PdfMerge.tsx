"use client";
import { useState } from "react";
import { fmt } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { FileList, FilePick, kb, pdfBlob, readBytes, useObjectUrl } from "./shared";

export default function PdfMerge({ t }: { t: Dict["pdf"] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pdf, setPdf] = useState<{ bytes: Uint8Array; pages: number } | null>(null);
  const url = useObjectUrl(pdf ? pdfBlob(pdf.bytes) : null);

  async function run() {
    setBusy(true);
    setError("");
    try {
      const { mergePdfs, pageCount } = await import("@/lib/pdf/build");
      const bytes = await mergePdfs(await Promise.all(files.map(readBytes)));
      setPdf({ bytes, pages: await pageCount(bytes) });
    } catch {
      setError(t.readError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card space-y-4">
      <FilePick label={files.length ? t.addMore : t.choosePdfs} accept="application/pdf,.pdf" multiple primary={!files.length} onFiles={(f) => { setPdf(null); setFiles((x) => [...x, ...f]); }} />
      {files.length > 0 && <FileList items={files} onChange={(f) => { setPdf(null); setFiles(f); }} t={t} />}
      {files.length === 1 && <p className="text-sm text-muted">{t.needTwo}</p>}
      <button type="button" className="btn-primary w-full text-lg" disabled={files.length < 2 || busy} onClick={run}>{busy ? "…" : t.merge}</button>
      {error && <p role="alert" className="text-bad">{error}</p>}
      {pdf && (
        <div className="space-y-2 rounded-xl border-2 border-ok/50 p-3" aria-live="polite">
          <p className="text-lg font-semibold">{fmt(t.result, { kb: kb(pdf.bytes.length), pages: pdf.pages })} ✅</p>
          <a className="btn-primary w-full text-lg" href={url} download="merged.pdf">⬇️ {t.download}</a>
        </div>
      )}
    </div>
  );
}
