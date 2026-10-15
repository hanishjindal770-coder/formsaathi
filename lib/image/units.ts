import type { DocKind, DocSpec, PxValue } from "@/lib/exams/schema";

/** DPI used when an exam gives sizes in cm but no DPI. Shown to the user so they can change it. */
export const DEFAULT_DPI = 100;

/** Upper bound for generic output so phones don't choke on 48 MP camera images. */
export const GENERIC_MAX_SIDE = 2000;

export type ByteBounds = { minBytes: number; maxBytes: number };

/**
 * Converts KB limits to bytes conservatively. Portals disagree on whether 1 KB is
 * 1000 or 1024 bytes, so the lower bound uses 1024 and the upper bound 1000: a file
 * inside these bounds passes either way.
 */
export function kbToByteBounds(minKB: number | undefined, maxKB: number): ByteBounds {
  const maxBytes = Math.floor(maxKB * 1000);
  let minBytes = minKB ? Math.ceil(minKB * 1024) : 0;
  if (minBytes >= maxBytes) minBytes = Math.ceil((minKB ?? 0) * 1000); // tiny ranges: fall back to SI
  return { minBytes, maxBytes };
}

export function formatKB(bytes: number): string {
  const kb = bytes / 1024;
  return kb < 10 ? kb.toFixed(1) : String(Math.round(kb));
}

export function cmToPx(cm: number, dpi: number): number {
  return Math.round((cm / 2.54) * dpi);
}

export const DEFAULT_ASPECT: Record<DocKind, number> = {
  photo: 3.5 / 4.5,
  signature: 3,
  thumb: 1,
  declaration: 2,
};

export type TargetDims = {
  width: number;
  height: number;
  /** Width/height ratio the crop box must keep, or null for free cropping. */
  aspect: number | null;
  /** DPI written into the JPEG header. */
  dpi: number;
};

const lo = (v: PxValue) => (typeof v === "number" ? v : v.min);
const hi = (v: PxValue) => (typeof v === "number" ? v : v.max);

/**
 * Works out the output pixel size for a document spec.
 * - exact px (IBPS 200×230): used as is.
 * - cm (+dpi): converted at the given or default DPI.
 * - px ranges (UPSC 350–1000): keeps the default aspect for the document kind (clamped to what
 *   the ranges allow) and picks the largest size that fits the range without upscaling the crop.
 * - nothing: free aspect, keeps the crop's size (capped at GENERIC_MAX_SIDE).
 */
export function resolveTargetDims(
  spec: Pick<DocSpec, "widthPx" | "heightPx" | "widthCm" | "heightCm" | "dpi" | "aspect">,
  kind: DocKind,
  crop?: { width: number; height: number },
  maxSide = GENERIC_MAX_SIDE,
): TargetDims {
  const dpi = spec.dpi ?? DEFAULT_DPI;
  if (typeof spec.widthPx === "number" && typeof spec.heightPx === "number") {
    return { width: spec.widthPx, height: spec.heightPx, aspect: spec.widthPx / spec.heightPx, dpi };
  }
  if (spec.widthCm && spec.heightCm && spec.widthPx === undefined && spec.heightPx === undefined) {
    const width = cmToPx(spec.widthCm, dpi);
    const height = cmToPx(spec.heightCm, dpi);
    return { width, height, aspect: width / height, dpi };
  }
  if (spec.widthPx !== undefined && spec.heightPx !== undefined) {
    const [wMin, wMax, hMin, hMax] = [lo(spec.widthPx), hi(spec.widthPx), lo(spec.heightPx), hi(spec.heightPx)];
    const aspect = Math.min(Math.max(spec.aspect ?? DEFAULT_ASPECT[kind], wMin / hMax), wMax / hMin);
    // Largest height such that width = aspect*height stays inside both ranges.
    let height = Math.min(hMax, Math.floor(wMax / aspect));
    if (crop) height = Math.min(height, Math.max(crop.height, Math.ceil(wMin / aspect), hMin));
    height = Math.max(height, hMin, Math.ceil(wMin / aspect));
    const width = Math.round(aspect * height);
    return { width, height, aspect, dpi };
  }
  // Generic: only width or only height (or none). Keep crop proportions.
  const cw = crop?.width ?? 1000;
  const ch = crop?.height ?? 1000;
  if (typeof spec.widthPx === "number") {
    return { width: spec.widthPx, height: Math.max(1, Math.round((spec.widthPx * ch) / cw)), aspect: null, dpi };
  }
  if (typeof spec.heightPx === "number") {
    return { width: Math.max(1, Math.round((spec.heightPx * cw) / ch)), height: spec.heightPx, aspect: null, dpi };
  }
  const scale = Math.min(1, maxSide / Math.max(cw, ch));
  return { width: Math.max(1, Math.round(cw * scale)), height: Math.max(1, Math.round(ch * scale)), aspect: null, dpi };
}

export function pxRangeLabel(v: PxValue | undefined): string | undefined {
  if (v === undefined) return undefined;
  return typeof v === "number" ? String(v) : `${v.min}–${v.max}`;
}

export function dimsWithinSpec(spec: Pick<DocSpec, "widthPx" | "heightPx">, width: number, height: number): boolean {
  const ok = (v: PxValue | undefined, n: number) => v === undefined || (n >= lo(v) && n <= hi(v));
  return ok(spec.widthPx, width) && ok(spec.heightPx, height);
}
