/**
 * The full document pipeline used by every image tool:
 * crop → resize → (ink cleanup) → (name/date strip) → background check → encode to a KB range.
 * Browser-only (uses canvas); the maths it relies on lives in pure, tested modules.
 */
import type { DocKind } from "@/lib/exams/schema";
import { cropResize, drawNameDateStrip, encodeCanvas, getPixels, putPixels, createCanvas } from "./canvas";
import type { Rect } from "./crop";
import { setJpegDpi } from "./jpeg";
import { checkBackground, cleanInk, type BackgroundCheck, type CleanOptions } from "./pixels";
import { fitToByteRange } from "./targetSize";
import type { ByteBounds, TargetDims } from "./units";

export const NAME_DATE_STRIP = 0.16; // fraction of output height

export type ProcessInput = {
  source: HTMLCanvasElement;
  crop: Rect;
  kind: DocKind;
  target: TargetDims;
  /** null: no size target, encode at a good default quality. */
  bounds: ByteBounds | null;
  format: "jpeg" | "png";
  clean?: CleanOptions | null;
  nameDate?: { name: string; date: string } | null;
  /** Generic mode: shrink the pixels when the KB limit can't be met at any quality. */
  allowDownscale?: boolean;
};

export type ProcessResult = {
  blob: Blob;
  bytes: number;
  width: number;
  height: number;
  quality: number | null;
  padded: boolean;
  downscaled: boolean;
  background: BackgroundCheck | null;
  /** Set when the KB range could not be met; the file is still produced. */
  sizeError?: "too-large";
};

/** Aspect ratio the crop box must use, accounting for the name/date strip. */
export function cropAspect(target: TargetDims, withNameDate: boolean): number | null {
  if (target.aspect === null) return null;
  if (!withNameDate) return target.aspect;
  const photoH = target.height - Math.round(target.height * NAME_DATE_STRIP);
  return target.width / photoH;
}

function render(input: ProcessInput, width: number, height: number) {
  const stripH = input.nameDate ? Math.round(height * NAME_DATE_STRIP) : 0;
  let canvas = cropResize(input.source, input.crop, width, height - stripH);
  if (stripH) {
    const full = createCanvas(width, height);
    full.getContext("2d")!.drawImage(canvas, 0, 0);
    drawNameDateStrip(full, input.nameDate!.name, input.nameDate!.date, stripH);
    canvas = full;
  }
  if (input.clean) {
    const img = getPixels(canvas);
    cleanInk({ data: img.data, width: img.width, height: img.height }, input.clean);
    putPixels(canvas, img);
  }
  return { canvas, stripH };
}

export async function processDocument(input: ProcessInput): Promise<ProcessResult> {
  let { width, height } = input.target;
  const mime = input.format === "png" ? "image/png" : "image/jpeg";
  let downscaled = false;

  for (let round = 0; round < 10; round++) {
    const { canvas, stripH } = render(input, width, height);
    let background: BackgroundCheck | null = null;
    if (input.kind === "photo") {
      const img = getPixels(canvas);
      background = checkBackground({ data: img.data, width, height: height - stripH });
    }

    if (input.format === "png") {
      const bytes = await encodeCanvas(canvas, "image/png");
      const tooBig = input.bounds && bytes.length > input.bounds.maxBytes;
      if (tooBig && input.allowDownscale && width > 32) {
        width = Math.round(width * 0.85);
        height = Math.round(height * 0.85);
        downscaled = true;
        continue;
      }
      return {
        blob: new Blob([bytes as BlobPart], { type: mime }), bytes: bytes.length, width, height, quality: null,
        padded: false, downscaled, background, sizeError: tooBig ? "too-large" : undefined,
      };
    }

    const encode = async (q: number) => setJpegDpi(await encodeCanvas(canvas, "image/jpeg", q), input.target.dpi);
    if (!input.bounds) {
      const bytes = await encode(0.92);
      return { blob: new Blob([bytes as BlobPart], { type: mime }), bytes: bytes.length, width, height, quality: 0.92, padded: false, downscaled, background };
    }
    const fit = await fitToByteRange(encode, input.bounds);
    if (fit.ok) {
      return {
        blob: new Blob([fit.bytes as BlobPart], { type: mime }), bytes: fit.bytes.length, width, height,
        quality: fit.quality, padded: fit.padded, downscaled, background,
      };
    }
    if (!input.allowDownscale || width <= 32) {
      const bytes = await encode(0.05);
      return {
        blob: new Blob([bytes as BlobPart], { type: mime }), bytes: bytes.length, width, height, quality: 0.05,
        padded: false, downscaled, background, sizeError: "too-large",
      };
    }
    // Shrink in proportion to how far over we are, at least 10%.
    const factor = Math.max(0.5, Math.min(0.9, Math.sqrt(input.bounds.maxBytes / fit.smallest) * 0.95));
    width = Math.max(32, Math.round(width * factor));
    height = Math.max(32, Math.round(height * factor));
    downscaled = true;
  }
  throw new Error("Could not reach the target size");
}
