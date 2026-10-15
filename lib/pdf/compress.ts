/**
 * "Compress PDF to X KB", entirely in the browser:
 * render each page with pdf.js → JPEG → rebuild with pdf-lib, searching JPEG quality (and,
 * if needed, render resolution) until the file fits. Heavy libraries are imported lazily so
 * only this tool's page ever downloads them.
 */
import { asset } from "@/lib/base";
import { fitToByteRange } from "@/lib/image/targetSize";
import { pagesFromJpegs } from "./build";

export type CompressProgress = { page: number; pages: number };

export type CompressResult =
  | { ok: true; bytes: Uint8Array; pages: number; unchanged: boolean; quality?: number; scale?: number }
  | { ok: false; reason: "too-large"; pages: number; smallest: number };

type Rendered = { canvas: HTMLCanvasElement; widthPt: number; heightPt: number };

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = asset("/pdf.worker.min.js");
  return pdfjs;
}

async function renderPages(data: Uint8Array, scale: number, onProgress?: (p: CompressProgress) => void): Promise<Rendered[]> {
  const pdfjs = await loadPdfjs();
  const doc = await pdfjs.getDocument({ data: data.slice() }).promise;
  const out: Rendered[] = [];
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      onProgress?.({ page: i, pages: doc.numPages });
      const page = await doc.getPage(i);
      const base = page.getViewport({ scale: 1 });
      const vp = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(vp.width));
      canvas.height = Math.max(1, Math.floor(vp.height));
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      out.push({ canvas, widthPt: base.width, heightPt: base.height });
      page.cleanup();
    }
  } finally {
    await doc.destroy();
  }
  return out;
}

const toJpeg = (c: HTMLCanvasElement, q: number) =>
  new Promise<Uint8Array>((resolve, reject) =>
    c.toBlob((b) => (b ? b.arrayBuffer().then((a) => resolve(new Uint8Array(a))) : reject(new Error("encode failed"))), "image/jpeg", q),
  );

/** Render scales tried in order: ~150, ~110, ~80, ~55 DPI (pdf.js scale 1 = 72 DPI). */
const SCALES = [2.08, 1.5, 1.1, 0.76];

export async function compressPdf(data: Uint8Array, maxBytes: number, onProgress?: (p: CompressProgress) => void): Promise<CompressResult> {
  const { pageCount } = await import("./build");
  const pages = await pageCount(data).catch(() => 0);
  if (data.length <= maxBytes) return { ok: true, bytes: data, pages, unchanged: true };

  let smallest = Infinity;
  for (const scale of SCALES) {
    const rendered = await renderPages(data, scale, onProgress);
    const encode = async (q: number) =>
      pagesFromJpegs(await Promise.all(rendered.map(async (r) => ({ jpeg: await toJpeg(r.canvas, q), widthPt: r.widthPt, heightPt: r.heightPt }))));
    const fit = await fitToByteRange(encode, { minBytes: 0, maxBytes }, { preferredQuality: 0.75, minQuality: 0.2, allowPadding: false, iterations: 6 });
    if (fit.ok) return { ok: true, bytes: fit.bytes, pages: rendered.length, unchanged: false, quality: fit.quality, scale };
    smallest = Math.min(smallest, fit.smallest);
  }
  return { ok: false, reason: "too-large", pages, smallest };
}
