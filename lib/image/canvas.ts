/** Browser-only canvas helpers. Nothing here uploads anything: all work stays on the device. */
import type { Rect } from "./crop";
import { GENERIC_MAX_SIDE } from "./units";

export type Source = { canvas: HTMLCanvasElement; width: number; height: number };

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  return c;
}

function ctx2d(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas not supported");
  return ctx;
}

/**
 * Decodes a user file into a canvas, honouring EXIF rotation and capping the working size so
 * 48 MP phone photos don't run cheap phones out of memory.
 */
export async function loadImageFile(
  file: Blob,
  maxSide = GENERIC_MAX_SIDE * 2,
  opts: { background?: "white" | "transparent" } = {},
): Promise<Source & { originalWidth: number; originalHeight: number }> {
  let bitmap: ImageBitmap | HTMLImageElement;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    bitmap = await new Promise<HTMLImageElement>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Could not read this image"));
      };
      img.src = url;
    });
  }
  const w0 = "naturalWidth" in bitmap ? bitmap.naturalWidth : bitmap.width;
  const h0 = "naturalHeight" in bitmap ? bitmap.naturalHeight : bitmap.height;
  const scale = Math.min(1, maxSide / Math.max(w0, h0));
  const width = Math.max(1, Math.round(w0 * scale));
  const height = Math.max(1, Math.round(h0 * scale));
  const canvas = createCanvas(width, height);
  const ctx = ctx2d(canvas);
  if (opts.background !== "transparent") {
    ctx.fillStyle = "#fff"; // transparent PNGs become white, not black, as JPEG
    ctx.fillRect(0, 0, width, height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  if ("close" in bitmap) bitmap.close();
  return { canvas, width, height, originalWidth: w0, originalHeight: h0 };
}

/** Rotates clockwise by 90, 180 or 270 degrees. */
export function rotateBy(src: Source, deg: 90 | 180 | 270): Source {
  const swap = deg !== 180;
  const width = swap ? src.height : src.width;
  const height = swap ? src.width : src.height;
  const canvas = createCanvas(width, height);
  const ctx = ctx2d(canvas);
  ctx.translate(width / 2, height / 2);
  ctx.rotate((deg * Math.PI) / 180);
  ctx.drawImage(src.canvas, -src.width / 2, -src.height / 2);
  return { canvas, width, height };
}

/** Mirrors horizontally ("h") or vertically ("v"). */
export function flip(src: Source, dir: "h" | "v"): Source {
  const canvas = createCanvas(src.width, src.height);
  const ctx = ctx2d(canvas);
  if (dir === "h") ctx.setTransform(-1, 0, 0, 1, src.width, 0);
  else ctx.setTransform(1, 0, 0, -1, 0, src.height);
  ctx.drawImage(src.canvas, 0, 0);
  return { canvas, width: src.width, height: src.height };
}

/** Copy of `c` drawn over a solid colour, for JPEG output of transparent images. */
export function flatten(c: HTMLCanvasElement, color = "#fff"): HTMLCanvasElement {
  const out = createCanvas(c.width, c.height);
  const ctx = ctx2d(out);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(c, 0, 0);
  return out;
}

export function rotate90(src: Source): Source {
  const canvas = createCanvas(src.height, src.width);
  const ctx = ctx2d(canvas);
  ctx.translate(src.height, 0);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(src.canvas, 0, 0);
  return { canvas, width: src.height, height: src.width };
}

/**
 * Crops and resizes with stepwise halving, which looks far sharper than one big drawImage
 * downscale (browsers use bilinear filtering for a single step).
 */
export function cropResize(src: HTMLCanvasElement, crop: Rect, outW: number, outH: number): HTMLCanvasElement {
  let cur = createCanvas(Math.max(1, Math.round(crop.width)), Math.max(1, Math.round(crop.height)));
  ctx2d(cur).drawImage(src, crop.x, crop.y, crop.width, crop.height, 0, 0, cur.width, cur.height);
  while (cur.width / 2 >= outW && cur.height / 2 >= outH) {
    const half = createCanvas(Math.round(cur.width / 2), Math.round(cur.height / 2));
    const hctx = ctx2d(half);
    hctx.imageSmoothingQuality = "high";
    hctx.drawImage(cur, 0, 0, half.width, half.height);
    cur = half;
  }
  const out = createCanvas(outW, outH);
  const octx = ctx2d(out);
  octx.imageSmoothingQuality = "high";
  octx.drawImage(cur, 0, 0, outW, outH);
  return out;
}

export function getPixels(c: HTMLCanvasElement) {
  return ctx2d(c).getImageData(0, 0, c.width, c.height);
}

export function putPixels(c: HTMLCanvasElement, img: ImageData) {
  ctx2d(c).putImageData(img, 0, 0);
}

export async function encodeCanvas(c: HTMLCanvasElement, type: "image/jpeg" | "image/png" | "image/webp", quality?: number): Promise<Uint8Array> {
  const blob = await new Promise<Blob | null>((resolve) => c.toBlob(resolve, type, quality));
  if (!blob) throw new Error("Encoding failed");
  return new Uint8Array(await blob.arrayBuffer());
}

/** Safari < 17 silently falls back to PNG for WebP; check once before offering WebP output. */
export function canEncodeWebp(): boolean {
  try {
    return createCanvas(1, 1).toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}

/**
 * Draws a white strip with the candidate's name and a date at the bottom of `photo`
 * (UPSC-style "photo with name and date"). The photo is squeezed into the area above the strip
 * by the caller, which crops for the remaining height.
 */
export function drawNameDateStrip(c: HTMLCanvasElement, name: string, date: string, stripHeight: number) {
  const ctx = ctx2d(c);
  const y = c.height - stripHeight;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, y, c.width, stripHeight);
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const line = stripHeight / 2;
  const fit = (text: string, max: number) => {
    let size = Math.floor(line * 0.8);
    ctx.font = `600 ${size}px "Noto Sans Devanagari", Arial, sans-serif`;
    while (size > 6 && ctx.measureText(text).width > max) {
      size--;
      ctx.font = `600 ${size}px "Noto Sans Devanagari", Arial, sans-serif`;
    }
  };
  const pad = c.width * 0.04;
  fit(name, c.width - 2 * pad);
  ctx.fillText(name, c.width / 2, y + line * 0.55);
  fit(date, c.width - 2 * pad);
  ctx.fillText(date, c.width / 2, y + line * 1.45);
}
