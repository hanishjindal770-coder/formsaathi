import { PDFDocument } from "pdf-lib";

/** pdf-lib helpers. Pure (bytes in, bytes out), so they run in tests and in the browser. */

export const A4_PT = { width: 595.28, height: 841.89 };
export const CM_TO_PT = 72 / 2.54;

export type PageImage = { bytes: Uint8Array; format: "jpeg" | "png"; width: number; height: number };

export type ImagesToPdfOptions = {
  /** "a4": each image centred on an A4 page with a margin; "fit": page is exactly the image size. */
  pageSize?: "a4" | "fit";
  marginPt?: number;
  /** For "fit": physical size of the image in points per pixel (72/dpi). */
  ptPerPx?: number;
};

export async function imagesToPdf(images: PageImage[], opts: ImagesToPdfOptions = {}): Promise<Uint8Array> {
  const { pageSize = "a4", marginPt = 28, ptPerPx = 72 / 150 } = opts;
  const doc = await PDFDocument.create();
  for (const img of images) {
    const embedded = img.format === "png" ? await doc.embedPng(img.bytes) : await doc.embedJpg(img.bytes);
    if (pageSize === "fit") {
      const w = img.width * ptPerPx;
      const h = img.height * ptPerPx;
      doc.addPage([w, h]).drawImage(embedded, { x: 0, y: 0, width: w, height: h });
      continue;
    }
    // Landscape images get a landscape page so they aren't shrunk needlessly.
    const landscape = img.width > img.height;
    const pw = landscape ? A4_PT.height : A4_PT.width;
    const ph = landscape ? A4_PT.width : A4_PT.height;
    const scale = Math.min((pw - 2 * marginPt) / img.width, (ph - 2 * marginPt) / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    doc.addPage([pw, ph]).drawImage(embedded, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
  }
  return doc.save();
}

/** Joins PDFs in order. Encrypted files are opened without decrypting where pdf-lib allows. */
export async function mergePdfs(files: Uint8Array[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const bytes of files) {
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  return out.save();
}

export async function pageCount(bytes: Uint8Array): Promise<number> {
  return (await PDFDocument.load(bytes, { ignoreEncryption: true })).getPageCount();
}

/**
 * Rebuilds a PDF from rendered page images, keeping each page's original size in points.
 * Used by the compressor once pages are rendered to JPEG.
 */
export async function pagesFromJpegs(pages: { jpeg: Uint8Array; widthPt: number; heightPt: number }[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (const p of pages) {
    const img = await doc.embedJpg(p.jpeg);
    doc.addPage([p.widthPt, p.heightPt]).drawImage(img, { x: 0, y: 0, width: p.widthPt, height: p.heightPt });
  }
  return doc.save({ useObjectStreams: true });
}
