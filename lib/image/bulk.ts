/**
 * Pure planning logic for the bulk resizer: what size each output should be, which part of the
 * source to draw where, the output format and a unique file name. No DOM here, so it is tested
 * in Node; the component does the canvas work.
 */
import type { Rect } from "./crop";

export const MAX_BULK_FILES = 100;
/** Browsers refuse (or crash on) very large canvases; 8000 px is safe almost everywhere. */
export const MAX_OUTPUT_SIDE = 8000;

export type BulkMode =
  | { kind: "percent"; percent: number }
  /** Shrinks to fit inside W×H keeping the aspect ratio; never enlarges. */
  | { kind: "fit"; width: number; height: number }
  /** Exactly W×H: "crop" fills the box and trims the edges, "pad" shows the whole image with white bars. */
  | { kind: "exact"; width: number; height: number; fill: "crop" | "pad" }
  /** Keeps the pixel size (shrinking only if needed) and lowers quality to get under maxKB. */
  | { kind: "kb"; maxKB: number };

export type OutFormat = "jpeg" | "png" | "webp";
export type FormatChoice = "keep" | OutFormat;

export type ResizePlan = {
  width: number;
  height: number;
  /** Region of the source image to draw. */
  crop: Rect;
  /** Where that region goes in the output; smaller than the output only in pad mode. */
  dest: Rect;
};

export type ModeError = "percent" | "size" | "kb" | null;

/** Validates user-entered numbers so the run button can be disabled with a clear reason. */
export function validateMode(mode: BulkMode): ModeError {
  const pos = (n: number) => Number.isFinite(n) && n > 0;
  switch (mode.kind) {
    case "percent":
      return pos(mode.percent) && mode.percent <= 1000 ? null : "percent";
    case "fit":
    case "exact":
      return pos(mode.width) && pos(mode.height) && mode.width <= MAX_OUTPUT_SIDE && mode.height <= MAX_OUTPUT_SIDE ? null : "size";
    case "kb":
      return pos(mode.maxKB) && mode.maxKB >= 2 ? null : "kb";
  }
}

const whole = (w: number, h: number): Rect => ({ x: 0, y: 0, width: w, height: h });
const atLeast1 = (n: number) => Math.max(1, Math.round(n));

/** Scales (w, h) down so neither side exceeds `max`. */
function capSides(w: number, h: number, max = MAX_OUTPUT_SIDE) {
  const s = Math.min(1, max / Math.max(w, h));
  return { width: atLeast1(w * s), height: atLeast1(h * s) };
}

export function planResize(src: { width: number; height: number }, mode: BulkMode): ResizePlan {
  const { width: sw, height: sh } = src;
  switch (mode.kind) {
    case "percent": {
      const { width, height } = capSides(sw * (mode.percent / 100), sh * (mode.percent / 100));
      return { width, height, crop: whole(sw, sh), dest: whole(width, height) };
    }
    case "fit": {
      const s = Math.min(1, mode.width / sw, mode.height / sh);
      const width = Math.min(mode.width, atLeast1(sw * s));
      const height = Math.min(mode.height, atLeast1(sh * s));
      return { width, height, crop: whole(sw, sh), dest: whole(width, height) };
    }
    case "exact": {
      const W = atLeast1(Math.min(mode.width, MAX_OUTPUT_SIDE));
      const H = atLeast1(Math.min(mode.height, MAX_OUTPUT_SIDE));
      if (mode.fill === "crop") {
        // Largest centred region of the source with the target's aspect ratio.
        const aspect = W / H;
        let cw = sw, ch = sw / aspect;
        if (ch > sh) {
          ch = sh;
          cw = sh * aspect;
        }
        return { width: W, height: H, crop: { x: (sw - cw) / 2, y: (sh - ch) / 2, width: cw, height: ch }, dest: whole(W, H) };
      }
      const s = Math.min(W / sw, H / sh);
      const dw = Math.min(W, atLeast1(sw * s));
      const dh = Math.min(H, atLeast1(sh * s));
      return { width: W, height: H, crop: whole(sw, sh), dest: { x: Math.floor((W - dw) / 2), y: Math.floor((H - dh) / 2), width: dw, height: dh } };
    }
    case "kb": {
      const { width, height } = capSides(sw, sh);
      return { width, height, crop: whole(sw, sh), dest: whole(width, height) };
    }
  }
}

/** Format of an input file from its MIME type, falling back to the extension. */
export function detectFormat(type: string, name: string): "jpeg" | "png" | "webp" | "gif" | "bmp" | null {
  const t = type.toLowerCase();
  const ext = name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "";
  if (t === "image/jpeg" || t === "image/jpg" || ext === "jpg" || ext === "jpeg" || ext === "jfif") return "jpeg";
  if (t === "image/png" || ext === "png") return "png";
  if (t === "image/webp" || ext === "webp") return "webp";
  if (t === "image/gif" || ext === "gif") return "gif";
  if (t === "image/bmp" || t === "image/x-ms-bmp" || ext === "bmp") return "bmp";
  return null;
}

export const isSupportedImage = (f: { type: string; name: string }) => detectFormat(f.type, f.name) !== null;

/**
 * Output format for one file. GIF and BMP can't be written by browsers, so "keep" turns them into
 * PNG. A KB target needs a format with a quality knob, so PNG becomes JPG in that mode.
 */
export function outputFormat(input: { type: string; name: string }, choice: FormatChoice, mode: BulkMode, webpOk = true): OutFormat {
  let f: OutFormat;
  if (choice !== "keep") f = choice;
  else {
    const d = detectFormat(input.type, input.name);
    f = d === "jpeg" || d === "webp" ? d : "png";
  }
  if (f === "webp" && !webpOk) f = "jpeg";
  if (mode.kind === "kb" && f === "png") f = "jpeg";
  return f;
}

export const EXT: Record<OutFormat, string> = { jpeg: "jpg", png: "png", webp: "webp" };
export const MIME: Record<OutFormat, string> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };

/** Strips the extension and characters that break ZIP paths or file systems. */
export function baseName(name: string): string {
  const base = name.replace(/^.*[\\/]/, "").replace(/\.[^.]*$/, "");
  const clean = base.replace(/[\u0000-\u001f<>:"|?*\\/]/g, "_").trim().replace(/^\.+/, "");
  return clean || "image";
}

/**
 * Gives each output a unique name ("photo.jpg", "photo (2).jpg", ...). Comparison ignores case
 * because Windows and phone galleries treat Photo.JPG and photo.jpg as the same file.
 * `used` is updated in place so it can be shared across a batch.
 */
export function uniqueName(name: string, ext: string, used: Set<string>): string {
  const base = baseName(name);
  let candidate = `${base}.${ext}`;
  for (let n = 2; used.has(candidate.toLowerCase()); n++) candidate = `${base} (${n}).${ext}`;
  used.add(candidate.toLowerCase());
  return candidate;
}

/** Output names for a whole batch, in order. */
export function outputNames(items: { name: string; ext: string }[]): string[] {
  const used = new Set<string>();
  return items.map((i) => uniqueName(i.name, i.ext, used));
}

/** Shrink factor for the next try when a KB target can't be met even at the lowest quality. */
export function shrinkFactor(maxBytes: number, smallestBytes: number): number {
  // File size scales roughly with pixel count, i.e. with the square of the side.
  return Math.max(0.5, Math.min(0.9, Math.sqrt(maxBytes / smallestBytes) * 0.95));
}

/** Splits an incoming file list into what we accept and what we skip (unsupported or over the limit). */
export function acceptFiles<T extends { type: string; name: string }>(current: number, incoming: T[], max = MAX_BULK_FILES) {
  const supported = incoming.filter(isSupportedImage);
  const room = Math.max(0, max - current);
  return { accepted: supported.slice(0, room), unsupported: incoming.length - supported.length, overLimit: Math.max(0, supported.length - room) };
}

export function totals(rows: { before: number; after?: number }[]) {
  let before = 0, after = 0, done = 0;
  for (const r of rows) {
    if (r.after === undefined) continue;
    before += r.before;
    after += r.after;
    done++;
  }
  return { before, after, done, savedPercent: before > 0 ? Math.round((1 - after / before) * 100) : 0 };
}
