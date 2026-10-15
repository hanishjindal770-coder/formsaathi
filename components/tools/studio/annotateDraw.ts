/** Canvas drawing for the Text and Blur tabs. Used at preview scale and at full size, so every size is relative. */
import { createCanvas, type Source } from "@/lib/image/canvas";
import {
  boxBlur,
  boxColorFor,
  clampCenter,
  fontPx,
  pixelate,
  textBlock,
  textLines,
  tileGrid,
  tileStep,
  type IRect,
} from "@/lib/image/annotate";
import type { Dims } from "@/lib/image/edit";

export const FONT_FAMILY = '"Noto Sans Devanagari", system-ui, sans-serif';

export type TextOpts = {
  text: string;
  /** Font size as % of the image's shorter side. */
  size: number;
  color: string;
  bold: boolean;
  /** 0–1 */
  opacity: number;
  box: boolean;
  /** Centre of the text block as a fraction of the image (0–1). */
  fx: number;
  fy: number;
  tile: boolean;
  angle: number;
};

export type BlurOpts = { mode: "blur" | "pixelate"; level: number; rect: IRect };

const ctxOf = (c: HTMLCanvasElement) => {
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) throw new Error("Canvas not supported");
  return x;
};

const fontFor = (o: Pick<TextOpts, "bold">, px: number) => `${o.bold ? 600 : 400} ${px}px ${FONT_FAMILY}`;

/** Waits for the Devanagari web font so the first canvas draw doesn't use a fallback font. */
export async function loadTextFont(o: Pick<TextOpts, "bold" | "text">): Promise<void> {
  try {
    await document.fonts?.load(fontFor(o, 32), o.text || "अ A");
  } catch {
    // Font loading is best effort; canvas falls back to the system font.
  }
}

function layout(ctx: CanvasRenderingContext2D, dims: Dims, o: TextOpts) {
  const fs = fontPx(o.size, dims);
  ctx.font = fontFor(o, fs);
  const lines = textLines(o.text);
  // Devanagari has tall matras above and below; 1.4 keeps lines from touching.
  const lh = fs * 1.4;
  const pad = o.box ? fs * 0.35 : 0;
  const block = textBlock(lines.map((l) => ctx.measureText(l).width), lh, pad);
  return { fs, lines, lh, pad, block };
}

/** Text block size in image px, for the position presets. */
export function measureText(dims: Dims, o: TextOpts): Dims {
  return layout(ctxOf(createCanvas(1, 1)), dims, o).block;
}

export function drawText(canvas: HTMLCanvasElement, o: TextOpts): void {
  const ctx = ctxOf(canvas);
  const dims = { width: canvas.width, height: canvas.height };
  const { fs, lines, lh, pad, block } = layout(ctx, dims, o);
  if (!lines.length) return;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const drawAt = (cx: number, cy: number) => {
    const top = cy - block.height / 2;
    if (o.box) {
      ctx.globalAlpha = o.opacity * 0.6;
      ctx.fillStyle = boxColorFor(o.color);
      ctx.fillRect(cx - block.width / 2, top, block.width, block.height);
    }
    ctx.globalAlpha = o.opacity;
    ctx.fillStyle = o.color;
    lines.forEach((l, i) => ctx.fillText(l, cx, top + pad + lh * (i + 0.5)));
  };
  if (o.tile) {
    ctx.translate(dims.width / 2, dims.height / 2);
    ctx.rotate((o.angle * Math.PI) / 180);
    for (const p of tileGrid(dims, tileStep(block, fs))) drawAt(p.x, p.y);
  } else {
    const c = clampCenter({ x: o.fx * dims.width, y: o.fy * dims.height }, dims, block);
    drawAt(c.x, c.y);
  }
  ctx.restore();
}

let filterOk: boolean | null = null;
/** Safari has no working `ctx.filter`; detect by actually blurring a tiny canvas. */
export function canvasFilterWorks(): boolean {
  if (filterOk !== null) return filterOk;
  try {
    const a = createCanvas(9, 1);
    const ax = ctxOf(a);
    ax.fillStyle = "#000";
    ax.fillRect(0, 0, 9, 1);
    ax.fillStyle = "#fff";
    ax.fillRect(4, 0, 1, 1);
    const b = createCanvas(9, 1);
    const bx = ctxOf(b);
    bx.filter = "blur(2px)";
    bx.drawImage(a, 0, 0);
    const d = bx.getImageData(4, 0, 1, 1).data;
    filterOk = d[0] > 0 && d[0] < 250;
  } catch {
    filterOk = false;
  }
  return filterOk;
}

/** Blurs only inside `r`. Pixels outside are never written. */
function blurRect(canvas: HTMLCanvasElement, r: IRect, radius: number) {
  const ctx = ctxOf(canvas);
  if (!canvasFilterWorks()) {
    const img = ctx.getImageData(r.x, r.y, r.width, r.height);
    boxBlur(img.data, r.width, r.height, radius);
    ctx.putImageData(img, r.x, r.y);
    return;
  }
  // Copy the area with a margin, repeating the edge pixels where the margin falls off the
  // image, so the blur doesn't fade to transparent at the photo's border.
  const p = Math.ceil(radius * 2);
  const tmp = createCanvas(r.width + p * 2, r.height + p * 2);
  const t = ctxOf(tmp);
  const sx = Math.max(0, r.x - p);
  const sy = Math.max(0, r.y - p);
  const ex = Math.min(canvas.width, r.x + r.width + p);
  const ey = Math.min(canvas.height, r.y + r.height + p);
  const ox = sx - (r.x - p);
  const oy = sy - (r.y - p);
  const w = ex - sx;
  const h = ey - sy;
  t.drawImage(canvas, sx, sy, w, h, ox, oy, w, h);
  if (ox > 0) t.drawImage(tmp, ox, oy, 1, h, 0, oy, ox, h);
  if (ox + w < tmp.width) t.drawImage(tmp, ox + w - 1, oy, 1, h, ox + w, oy, tmp.width - ox - w, h);
  if (oy > 0) t.drawImage(tmp, 0, oy, tmp.width, 1, 0, 0, tmp.width, oy);
  if (oy + h < tmp.height) t.drawImage(tmp, 0, oy + h - 1, tmp.width, 1, 0, oy + h, tmp.width, tmp.height - oy - h);
  const out = createCanvas(tmp.width, tmp.height);
  const o = ctxOf(out);
  o.filter = `blur(${radius / 2}px)`;
  o.drawImage(tmp, 0, 0);
  ctx.save();
  ctx.clearRect(r.x, r.y, r.width, r.height);
  ctx.drawImage(out, p, p, r.width, r.height, r.x, r.y, r.width, r.height);
  ctx.restore();
}

function pixelateRect(canvas: HTMLCanvasElement, r: IRect, block: number) {
  const ctx = ctxOf(canvas);
  const img = ctx.getImageData(r.x, r.y, r.width, r.height);
  pixelate(img.data, r.width, r.height, block);
  ctx.putImageData(img, r.x, r.y);
}

/** Applies blur/pixelate to `canvas` in place; `px` is the radius or block size in canvas px. */
export function drawBlur(canvas: HTMLCanvasElement, mode: BlurOpts["mode"], r: IRect, px: number): void {
  if (r.width < 1 || r.height < 1) return;
  if (mode === "pixelate") pixelateRect(canvas, r, px);
  else blurRect(canvas, r, px);
}

/** New Source with `draw` applied to a copy, so the undo history keeps the old canvas intact. */
export function editCopy(src: Source, draw: (c: HTMLCanvasElement) => void): Source {
  const c = createCanvas(src.width, src.height);
  ctxOf(c).drawImage(src.canvas, 0, 0);
  draw(c);
  return { canvas: c, width: src.width, height: src.height };
}

/** Downscaled copy of the working image for live previews (keeps dragging smooth on phones). */
export function previewBase(src: Source, maxSide = 1000): HTMLCanvasElement {
  const s = Math.min(1, maxSide / Math.max(src.width, src.height));
  const c = createCanvas(Math.max(1, Math.round(src.width * s)), Math.max(1, Math.round(src.height * s)));
  const x = ctxOf(c);
  x.imageSmoothingQuality = "high";
  x.drawImage(src.canvas, 0, 0, c.width, c.height);
  return c;
}
