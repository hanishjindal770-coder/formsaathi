/**
 * Browser-only: paints layout pages on a canvas and wraps them in a PDF. Text goes through the
 * canvas so the browser's shaper handles Devanagari (pdf-lib would draw broken conjuncts).
 */
import { coverCrop, PAGE, type Font, type Measure, type Page } from "./layout";

export const FONT_FAMILY = '"Noto Sans Devanagari", "Nirmala UI", "Mangal", sans-serif';
export const cssFont = (f: Font) => `${f.weight ?? 400} ${f.size}px ${FONT_FAMILY}`;

export type Images = Record<string, HTMLImageElement | undefined>;

let fontsReady: Promise<void> | null = null;
/**
 * Both weights, both unicode-range subsets (the sample text has Latin and Devanagari), so the
 * first measurement isn't taken with a fallback font.
 */
export function loadFonts(): Promise<void> {
  fontsReady ??= Promise.all(
    [400, 600].map((w) => document.fonts.load(`${w} 24px "Noto Sans Devanagari"`, "अक्षर Aa1")),
  ).then(
    () => undefined,
    () => undefined,
  );
  return fontsReady;
}

export function canvasMeasure(): Measure {
  const ctx = document.createElement("canvas").getContext("2d")!;
  let current = "";
  return (text, font) => {
    const f = cssFont(font);
    if (f !== current) {
      ctx.font = f;
      current = f;
    }
    return ctx.measureText(text).width;
  };
}

export function loadImage(src: string): Promise<HTMLImageElement | undefined> {
  if (!src) return Promise.resolve(undefined);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(undefined);
    img.src = src;
  });
}

/** Paints one page at `scale` (1 = 1240×1754 px) on a white background. */
export function paintPage(ctx: CanvasRenderingContext2D, page: Page, images: Images, scale = 1) {
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, PAGE.width, PAGE.height);
  ctx.textBaseline = "middle";
  for (const op of page.ops) {
    switch (op.kind) {
      case "text":
        ctx.font = cssFont(op.font);
        ctx.fillStyle = op.color ?? "#111";
        ctx.textAlign = op.align ?? "left";
        ctx.fillText(op.text, op.x, op.y);
        break;
      case "line":
        ctx.strokeStyle = op.color ?? "#111";
        ctx.lineWidth = op.width;
        ctx.beginPath();
        ctx.moveTo(op.x1, op.y1);
        ctx.lineTo(op.x2, op.y2);
        ctx.stroke();
        break;
      case "rect":
        if (op.fill) {
          ctx.fillStyle = op.fill;
          ctx.fillRect(op.x, op.y, op.w, op.h);
        }
        if (op.stroke) {
          ctx.strokeStyle = op.stroke;
          ctx.lineWidth = op.width ?? 1;
          ctx.strokeRect(op.x, op.y, op.w, op.h);
        }
        break;
      case "image": {
        const img = images[op.key];
        if (!img) break;
        const c = coverCrop(img.naturalWidth, img.naturalHeight, op.w, op.h);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, op.x, op.y, op.w, op.h);
        break;
      }
    }
  }
  ctx.restore();
}

function pageCanvas(page: Page, images: Images): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = PAGE.width;
  c.height = PAGE.height;
  paintPage(c.getContext("2d")!, page, images);
  return c;
}

const toJpeg = (c: HTMLCanvasElement) =>
  new Promise<Uint8Array>((resolve, reject) =>
    c.toBlob(async (b) => (b ? resolve(new Uint8Array(await b.arrayBuffer())) : reject(new Error("encode failed"))), "image/jpeg", 0.9),
  );

/** One JPEG per A4 page. pdf-lib is loaded only when the student actually downloads. */
export async function renderPdf(pages: Page[], images: Images, title = "Document"): Promise<Uint8Array> {
  const [{ PDFDocument }, { A4_PT }] = await Promise.all([import("pdf-lib"), import("@/lib/pdf/build")]);
  const doc = await PDFDocument.create();
  doc.setTitle(title);
  doc.setProducer("FormSaathi");
  for (const p of pages) {
    const img = await doc.embedJpg(await toJpeg(pageCanvas(p, images)));
    doc.addPage([A4_PT.width, A4_PT.height]).drawImage(img, { x: 0, y: 0, width: A4_PT.width, height: A4_PT.height });
  }
  return doc.save();
}

/**
 * Prints page images from a hidden iframe. Printing a PDF inside an iframe fails on most
 * phones, but plain images print everywhere.
 */
export function printPages(pages: Page[], images: Images) {
  const srcs = pages.map((p) => pageCanvas(p, images).toDataURL("image/jpeg", 0.92));
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  document.body.appendChild(frame);
  const doc = frame.contentDocument!;
  doc.open();
  doc.write(
    `<!doctype html><html><head><title>print</title><style>@page{size:A4;margin:0}html,body{margin:0}img{display:block;width:210mm;height:297mm;break-after:page}img:last-child{break-after:auto}</style></head><body>${srcs.map((s) => `<img src="${s}">`).join("")}</body></html>`,
  );
  doc.close();
  const imgs = [...doc.images];
  Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.onload = i.onerror = r; })))).then(() => {
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
    // Removing immediately can cancel the dialog in some browsers.
    setTimeout(() => frame.remove(), 60_000);
  });
}
