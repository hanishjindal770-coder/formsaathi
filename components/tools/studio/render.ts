/** Browser-side encoding for ImageStudio: turns the working canvas + output settings into a file. */
import { cropResize, encodeCanvas, flatten, type Source } from "@/lib/image/canvas";
import { fitToByteRange } from "@/lib/image/targetSize";
import { kbToByteBounds } from "@/lib/image/units";
import { isSameFormat, MIME, shrinkScaleFor, type OpTag, type OutFormat } from "@/lib/image/edit";

export type OutSettings = { format: OutFormat; mode: "auto" | "quality" | "target"; quality: number; targetKB: number };
export type Step = { src: Source; ops: OpTag[]; out: OutSettings };
export type Rendered = {
  blob: Blob;
  width: number;
  height: number;
  format: OutFormat;
  untouched: boolean;
  /** Pixels were reduced to reach the KB target. */
  shrunk: boolean;
  /** KB target could not be met; blob is the smallest we made. */
  tooBig: boolean;
};

const AUTO_QUALITY = 0.92;
// Below this JPEG/WebP turns blocky; shrinking pixels looks better than going lower.
const MIN_QUALITY = 0.15;

const toBlob = (bytes: Uint8Array, fmt: OutFormat) => new Blob([bytes as BlobPart], { type: MIME[fmt] });

export async function renderStep(step: Step, file: File, natural: { width: number; height: number }): Promise<Rendered> {
  const { format, mode, quality, targetKB } = step.out;
  // Nothing to do: hand back the user's own file, byte for byte.
  if (step.ops.length === 0 && mode === "auto" && isSameFormat(file.type, format)) {
    return { blob: file, width: natural.width, height: natural.height, format, untouched: true, shrunk: false, tooBig: false };
  }
  let canvas = format === "jpeg" ? flatten(step.src.canvas) : step.src.canvas;
  const enc = (c: HTMLCanvasElement, q: number) => encodeCanvas(c, MIME[format], format === "png" ? undefined : q);
  const done = (bytes: Uint8Array, c: HTMLCanvasElement, shrunk = false, tooBig = false): Rendered => ({
    blob: toBlob(bytes, format),
    width: c.width,
    height: c.height,
    format,
    untouched: false,
    shrunk,
    tooBig,
  });

  if (mode !== "target") return done(await enc(canvas, mode === "quality" ? quality : AUTO_QUALITY), canvas);

  const bounds = kbToByteBounds(undefined, targetKB);
  let smallest: { bytes: Uint8Array; c: HTMLCanvasElement } | null = null;
  for (let attempt = 0; attempt < 6; attempt++) {
    let over: number;
    if (format === "png") {
      const bytes = await enc(canvas, 1);
      if (bytes.length <= bounds.maxBytes) return done(bytes, canvas, attempt > 0);
      over = bytes.length;
      if (!smallest || bytes.length < smallest.bytes.length) smallest = { bytes, c: canvas };
    } else {
      const r = await fitToByteRange((q) => enc(canvas, q), bounds, { allowPadding: false, preferredQuality: 0.9, minQuality: MIN_QUALITY });
      if (r.ok) return done(r.bytes, canvas, attempt > 0);
      over = r.smallest;
      if (!smallest || r.smallest < smallest.bytes.length) smallest = { bytes: await enc(canvas, MIN_QUALITY), c: canvas };
    }
    const s = shrinkScaleFor(over, bounds.maxBytes);
    const w = Math.max(1, Math.round(canvas.width * s));
    const h = Math.max(1, Math.round(canvas.height * s));
    if (w < 16 || h < 16) break;
    canvas = cropResize(canvas, { x: 0, y: 0, width: canvas.width, height: canvas.height }, w, h);
  }
  return done(smallest!.bytes, smallest!.c, true, true);
}
