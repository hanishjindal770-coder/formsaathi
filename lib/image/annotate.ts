/** Pure helpers for the "Text" and "Blur" tabs of ImageStudio: layout, tiling, rectangles, pixel filters. No DOM. */
import type { Dims } from "./edit";

export type Pt = { x: number; y: number };
export type IRect = { x: number; y: number; width: number; height: number };

export type Anchor = "tl" | "tc" | "tr" | "ml" | "mc" | "mr" | "bl" | "bc" | "br";
/** Row-major, so it maps straight onto a 3×3 grid of buttons. */
export const ANCHORS: Anchor[] = ["tl", "tc", "tr", "ml", "mc", "mr", "bl", "bc", "br"];

/** Margin from the image edge for the corner/edge presets, as a share of the shorter side. */
export const EDGE_MARGIN = 0.03;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Centre point (image px) of a text block of size `box` placed at a 9-way preset.
 * Edges keep a small margin so the text doesn't touch the border.
 */
export function anchorCenter(anchor: Anchor, img: Dims, box: Dims, margin = EDGE_MARGIN * Math.min(img.width, img.height)): Pt {
  const col = ANCHORS.indexOf(anchor) % 3;
  const row = Math.floor(ANCHORS.indexOf(anchor) / 3);
  const xs = [margin + box.width / 2, img.width / 2, img.width - margin - box.width / 2];
  const ys = [margin + box.height / 2, img.height / 2, img.height - margin - box.height / 2];
  return clampCenter({ x: xs[col], y: ys[row] }, img, box);
}

/**
 * Keeps a block's centre so the block stays inside the image. When the block is bigger than the
 * image on an axis it is centred on that axis instead (there is no position that fits).
 */
export function clampCenter(c: Pt, img: Dims, box: Dims): Pt {
  const fit = (v: number, size: number, limit: number) => (size >= limit ? limit / 2 : clamp(v, size / 2, limit - size / 2));
  return { x: fit(c.x, box.width, img.width), y: fit(c.y, box.height, img.height) };
}

/** Size of a multi-line text block (optionally with padding for a background box). */
export function textBlock(lineWidths: number[], lineHeight: number, pad: number): Dims {
  const w = lineWidths.length ? Math.max(...lineWidths) : 0;
  return { width: w + pad * 2, height: lineWidths.length * lineHeight + pad * 2 };
}

/** Splits user text into lines, dropping trailing blank lines but keeping blank lines in between. */
export function textLines(s: string): string[] {
  const lines = s.replace(/\r\n?/g, "\n").split("\n");
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  return lines;
}

/** Font size in px for a "size" level given as a percentage of the image's shorter side. */
export function fontPx(level: number, img: Dims): number {
  return Math.max(8, Math.round((level / 100) * Math.min(img.width, img.height)));
}

/**
 * Points (in a frame centred on the image and rotated by the tile angle) where a watermark copy
 * is drawn. Covers the whole image at any angle by spanning its diagonal; every other row is
 * shifted half a step so copies form a brick pattern, which reads less like a grid.
 */
export function tileGrid(img: Dims, step: Dims, maxPoints = 2000): Pt[] {
  const sx = Math.max(1, step.width);
  const sy = Math.max(1, step.height);
  const half = Math.hypot(img.width, img.height) / 2;
  const nx = Math.ceil(half / sx) + 1;
  const ny = Math.ceil(half / sy) + 1;
  const pts: Pt[] = [];
  for (let j = -ny; j <= ny; j++) {
    const shift = Math.abs(j) % 2 ? sx / 2 : 0;
    for (let i = -nx; i <= nx; i++) {
      pts.push({ x: i * sx + shift, y: j * sy });
      if (pts.length >= maxPoints) return pts;
    }
  }
  return pts;
}

/** Spacing between tiled copies: one text width plus a gap horizontally, ~2.5 block heights vertically. */
export function tileStep(box: Dims, fontSize: number): Dims {
  return { width: box.width + fontSize * 2, height: box.height + fontSize * 2.5 };
}

/** Rectangle from two drag points (any direction), clamped to the image and rounded to whole pixels. */
export function normRect(a: Pt, b: Pt, img: Dims): IRect {
  const x0 = clamp(Math.min(a.x, b.x), 0, img.width);
  const y0 = clamp(Math.min(a.y, b.y), 0, img.height);
  const x1 = clamp(Math.max(a.x, b.x), 0, img.width);
  const y1 = clamp(Math.max(a.y, b.y), 0, img.height);
  const x = Math.floor(x0);
  const y = Math.floor(y0);
  return { x, y, width: Math.ceil(x1) - x, height: Math.ceil(y1) - y };
}

/** Too small to be a deliberate selection (a tap rather than a drag). */
export function tinyRect(r: IRect, minSide = 4): boolean {
  return r.width < minSide || r.height < minSide;
}

/** Maps a rect between two image sizes (preview ↔ full), keeping it inside the target. */
export function scaleRect(r: IRect, from: Dims, to: Dims): IRect {
  const sx = to.width / from.width;
  const sy = to.height / from.height;
  return normRect({ x: r.x * sx, y: r.y * sy }, { x: (r.x + r.width) * sx, y: (r.y + r.height) * sy }, to);
}

/**
 * Blur radius / pixel block size in image px for a 1–20 strength level. Scaled by the image's
 * longer side so "strength 8" hides a face equally well on a 600 px and a 4000 px photo.
 */
export function strengthPx(level: number, img: Dims): number {
  return Math.max(2, Math.round((level * Math.max(img.width, img.height)) / 400));
}

/** WCAG relative luminance (0–1) of a #rrggbb colour; used to pick a contrasting background box. */
export function luminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 0;
  const n = parseInt(m[1], 16);
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}

/** Dark box behind light text, light box behind dark text. */
export function boxColorFor(textHex: string): string {
  return luminance(textHex) > 0.4 ? "#000000" : "#ffffff";
}

type Px = { length: number; [i: number]: number };

/** Replaces each `block`×`block` cell of an RGBA buffer with its average colour, in place. */
export function pixelate(data: Px, w: number, h: number, block: number): void {
  const b = Math.max(1, Math.round(block));
  for (let by = 0; by < h; by += b) {
    for (let bx = 0; bx < w; bx += b) {
      const ex = Math.min(w, bx + b);
      const ey = Math.min(h, by + b);
      let r = 0, g = 0, bl = 0, a = 0;
      for (let y = by; y < ey; y++) {
        for (let x = bx; x < ex; x++) {
          const i = (y * w + x) * 4;
          r += data[i]; g += data[i + 1]; bl += data[i + 2]; a += data[i + 3];
        }
      }
      const n = (ex - bx) * (ey - by);
      const avg = [Math.round(r / n), Math.round(g / n), Math.round(bl / n), Math.round(a / n)];
      for (let y = by; y < ey; y++) {
        for (let x = bx; x < ex; x++) {
          const i = (y * w + x) * 4;
          data[i] = avg[0]; data[i + 1] = avg[1]; data[i + 2] = avg[2]; data[i + 3] = avg[3];
        }
      }
    }
  }
}

/** One horizontal (dx=1) or vertical box-blur pass with edge clamping, sliding-window O(n). */
function boxPass(src: Float32Array, dst: Float32Array, w: number, h: number, r: number, horizontal: boolean) {
  const len = horizontal ? w : h;
  const lines = horizontal ? h : w;
  const win = r * 2 + 1;
  for (let l = 0; l < lines; l++) {
    const at = (k: number) => {
      const kk = k < 0 ? 0 : k >= len ? len - 1 : k;
      return (horizontal ? l * w + kk : kk * w + l) * 4;
    };
    for (let c = 0; c < 4; c++) {
      let sum = 0;
      for (let k = -r; k <= r; k++) sum += src[at(k) + c];
      for (let k = 0; k < len; k++) {
        dst[at(k) + c] = sum / win;
        sum += src[at(k + r + 1) + c] - src[at(k - r) + c];
      }
    }
  }
}

/**
 * Approximate Gaussian blur of an RGBA buffer, in place: three box-blur passes each way.
 * This is the fallback for browsers without `ctx.filter` (Safari). Edges are clamped, so a
 * region's border never pulls in pixels from outside it.
 */
export function boxBlur(data: Px, w: number, h: number, radius: number, passes = 3): void {
  // Three boxes of radius r ≈ one Gaussian of sigma ≈ r; split the requested radius across them.
  const r = Math.max(1, Math.round(radius / Math.sqrt(passes)));
  if (w < 1 || h < 1) return;
  const a = Float32Array.from(data as ArrayLike<number>);
  const b = new Float32Array(a.length);
  for (let p = 0; p < passes; p++) {
    boxPass(a, b, w, h, r, true);
    boxPass(b, a, w, h, r, false);
  }
  for (let i = 0; i < data.length; i++) data[i] = Math.round(a[i]);
}
