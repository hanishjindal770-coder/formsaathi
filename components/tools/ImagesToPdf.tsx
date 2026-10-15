"use client";
import { useState } from "react";
import { fmt } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { encodeCanvas, loadImageFile } from "@/lib/image/canvas";
import { FileList, FilePick, kb, pdfBlob, useObjectUrl } from "./shared";

export default function ImagesToPdf({ t }: { t: Dict["pdf"] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "fit">("a4");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pdf, setPdf] = useState<Uint8Array | null>(null);
  const url = useObjectUrl(pdf ? pdfBlob(pdf) : null);

  async function run() {
    setBusy(true);
    setError("");
    try {
      const { imagesToPdf } = await import("@/lib/pdf/build");
      const pages = [];
      // Re-encode every photo: fixes phone rotation (EXIF) and keeps the PDF a sensible size.
      for (const f of files) {
        const src = await loadImageFile(f, 2200);
        pages.push({ bytes: await encodeCanvas(src.canvas, "image/jpeg", 0.85), format: "jpeg" as const, width: src.width, height: src.height });
      }
      setPdf(await imagesToPdf(pages, { pageSize }));
    } catch {
      setError(t.readError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card space-y-4">
      <FilePick label={files.length ? t.addMore : t.chooseImages} accept="image/*" multiple primary={!files.length} onFiles={(f) => { setPdf(null); setFiles((x) => [...x, ...f]); }} />
      {files.length > 0 && <FileList items={files} onChange={(f) => { setPdf(null); setFiles(f); }} t={t} />}
      <div className="flex items-center gap-2 text-sm">
        <span>{t.pageSize}:</span>
        {(["a4", "fit"] as const).map((p) => (
          <button key={p} type="button" aria-pressed={pageSize === p} onClick={() => { setPageSize(p); setPdf(null); }} className={`min-h-10 rounded-full border px-4 ${pageSize === p ? "border-brand bg-brand text-brand-ink" : "border-line"}`}>
            {p === "a4" ? t.pageA4 : t.pageFit}
          </button>
        ))}
      </div>
      <button type="button" className="btn-primary w-full text-lg" disabled={!files.length || busy} onClick={run}>{busy ? "…" : t.makePdf}</button>
      {error && <p role="alert" className="text-bad">{error}</p>}
      {pdf && (
        <div className="space-y-2 rounded-xl border-2 border-ok/50 p-3" aria-live="polite">
          <p className="text-lg font-semibold">{fmt(t.result, { kb: kb(pdf.length), pages: files.length })} ✅</p>
          <a className="btn-primary w-full text-lg" href={url} download="documents.pdf">⬇️ {t.download}</a>
        </div>
      )}
    </div>
  );
}
