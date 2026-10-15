/** Pure helpers for the ImageStudio editor (size math, naming, formats). No DOM here. */

export type OutFormat = "jpeg" | "png" | "webp";
export type Unit = "px" | "cm" | "in";
export type Dims = { width: number; height: number };
export type OpTag = "resized" | "cropped" | "compressed" | "converted" | "rotated" | "flipped" | "text" | "blurred" | "pixelated";

export const FORMATS: OutFormat[] = ["jpeg", "png", "webp"];
export const MIME: Record<OutFormat, "image/jpeg" | "image/png" | "image/webp"> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };
export const EXT: Record<OutFormat, string> = { jpeg: "jpg", png: "png", webp: "webp" };
export const FORMAT_LABEL: Record<OutFormat, string> = { jpeg: "JPG", png: "PNG", webp: "WebP" };

export const PERCENT_PRESETS = [25, 50, 75] as const;
export const KB_PRESETS = [20, 50, 100, 200, 500] as const;
/** Upscaling past this many times the original looks blurry; we warn first. */
export const MAX_UPSCALE = 4;
/** iOS Safari refuses canvases above 16.7 MP, so outputs are kept under it everywhere. */
export const MAX_AREA = 16_777_216;
export const MAX_SIDE = 16_384;
export const DEFAULT_PRINT_DPI = 300;

export type CropPresetId = "free" | "1:1" | "4:3" | "16:9" | "3:4" | "passport" | "custom";
export const CROP_PRESETS: { id: CropPresetId; ratio: number | null }[] = [
  { id: "free", ratio: null },
  { id: "1:1", ratio: 1 },
  { id: "4:3", ratio: 4 / 3 },
  { id: "16:9", ratio: 16 / 9 },
  { id: "3:4", ratio: 3 / 4 },
  { id: "passport", ratio: 3.5 / 4.5 },
  { id: "custom", ratio: null },
];

/** Ratio (w/h) for a crop preset; "custom" uses the user's two numbers. Null = free crop. */
export function cropRatio(id: CropPresetId, custom?: { w: number; h: number }): number | null {
  if (id === "custom") return custom && custom.w > 0 && custom.h > 0 && isFinite(custom.w / custom.h) ? custom.w / custom.h : null;
  return CROP_PRESETS.find((p) => p.id === id)?.ratio ?? null;
}

/** Parses "16:9", "16x9", "3.5 / 4.5" into a ratio; null if it isn't two positive numbers. */
export function parseRatio(s: string): number | null {
  const m = s.trim().match(/^(\d+(?:\.\d+)?)\s*[:x×/]\s*(\d+(?:\.\d+)?)$/i);
  if (!m) return null;
  const w = Number(m[1]);
  const h = Number(m[2]);
  return w > 0 && h > 0 ? w / h : null;
}

const px = (n: number) => Math.max(1, Math.round(n));

export function scaleByPercent(d: Dims, pct: number): Dims {
  return { width: px((d.width * pct) / 100), height: px((d.height * pct) / 100) };
}

/**
 * When one side is edited with the aspect lock on, works out the other from the base image.
 * With the lock off, the other side is left as `other`.
 */
export function lockedDims(base: Dims, changed: "width" | "height", value: number, lock: boolean, other: number): Dims {
  const v = px(value);
  if (!lock) return changed === "width" ? { width: v, height: px(other) } : { width: px(other), height: v };
  return changed === "width" ? { width: v, height: px((v * base.height) / base.width) } : { width: px((v * base.width) / base.height), height: v };
}

export function toPx(value: number, unit: Unit, dpi: number): number {
  if (unit === "px") return value;
  return unit === "in" ? value * dpi : (value / 2.54) * dpi;
}

export function fromPx(pixels: number, unit: Unit, dpi: number): number {
  if (unit === "px") return pixels;
  return unit === "in" ? pixels / dpi : (pixels / dpi) * 2.54;
}

/** Rounds a unit value for an input field: whole px, 2 decimals for cm/inch. */
export function roundUnit(v: number, unit: Unit): number {
  return unit === "px" ? Math.round(v) : Math.round(v * 100) / 100;
}

/** How many times larger than the original the new size is (largest side ratio). */
export function upscaleFactor(next: Dims, original: Dims): number {
  return Math.max(next.width / original.width, next.height / original.height);
}

/** Shrinks dims proportionally to stay inside browser canvas limits. */
export function clampDims(d: Dims, maxArea = MAX_AREA, maxSide = MAX_SIDE): Dims & { clamped: boolean } {
  const s = Math.min(1, maxSide / d.width, maxSide / d.height, Math.sqrt(maxArea / (d.width * d.height)));
  if (s >= 1) return { ...d, clamped: false };
  // floor so rounding can never push us back over the limit
  return { width: Math.max(1, Math.floor(d.width * s)), height: Math.max(1, Math.floor(d.height * s)), clamped: true };
}

/** Default output format for an input: keep JPG/PNG/WebP, GIF→PNG (may be transparent), others→JPG. */
export function formatForInput(mime: string, name = ""): OutFormat {
  const t = mime.toLowerCase();
  const ext = name.toLowerCase().split(".").pop() ?? "";
  if (t === "image/png" || t === "image/gif" || ext === "png" || ext === "gif") return "png";
  if (t === "image/webp" || ext === "webp") return "webp";
  return "jpeg";
}

/** True when the input file is already in `fmt`, so it can be handed back untouched. */
export function isSameFormat(mime: string, fmt: OutFormat): boolean {
  return mime.toLowerCase() === MIME[fmt] || (fmt === "jpeg" && mime.toLowerCase() === "image/jpg");
}

export function looksLikeHeic(mime: string, name: string): boolean {
  return /hei[cf]/i.test(mime) || /\.hei[cf]$/i.test(name);
}

/** "My Photo (1).HEIC" + [cropped, resized] + jpeg → "my-photo-1-cropped-resized.jpg". */
export function outputName(original: string, ops: OpTag[], fmt: OutFormat): string {
  const stem =
    original
      .replace(/\.[^.]*$/, "")
      .normalize("NFC")
      .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase()
      .slice(0, 60)
      .replace(/-+$/, "") || "image";
  const tags = [...new Set(ops)].slice(-3);
  return `${stem}${tags.length ? "-" + tags.join("-") : "-edited"}.${EXT[fmt]}`;
}

/** Percent saved going from `before` to `after` bytes (negative when the file grew). */
export function savedPercent(before: number, after: number): number {
  if (before <= 0) return 0;
  return Math.round(((before - after) / before) * 100);
}

/**
 * Drops the oldest undo entries until there are at most `maxEntries` and their total pixels fit
 * the budget, so a few 12 MP steps can't exhaust a phone's memory. Returns how many to drop.
 */
export function historyOverflow(pixelsPerEntry: number[], maxEntries = 10, maxPixels = 80_000_000): number {
  let drop = Math.max(0, pixelsPerEntry.length - maxEntries);
  let total = pixelsPerEntry.slice(drop).reduce((a, b) => a + b, 0);
  while (drop < pixelsPerEntry.length - 1 && total > maxPixels) {
    total -= pixelsPerEntry[drop];
    drop++;
  }
  return drop;
}

/** Next pixel scale to try when even the lowest quality is over the KB target. */
export function shrinkScaleFor(smallestBytes: number, maxBytes: number): number {
  // Bytes grow roughly with area, so scale sides by the square root, with a margin.
  return Math.min(0.9, Math.sqrt(maxBytes / smallestBytes) * 0.92);
}
