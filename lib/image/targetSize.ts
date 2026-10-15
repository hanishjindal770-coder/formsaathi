import { padJpeg } from "./jpeg";
import type { ByteBounds } from "./units";

export type Encoder = (quality: number) => Promise<Uint8Array>;

export type FitResult =
  | { ok: true; bytes: Uint8Array; quality: number; padded: boolean; attempts: number }
  | { ok: false; reason: "too-large"; smallest: number; attempts: number };

export type FitOptions = {
  /** Quality tried first; most exam photos fit here and look best. */
  preferredQuality?: number;
  minQuality?: number;
  maxQuality?: number;
  iterations?: number;
  /** Pad with JPEG comments when even the best quality is under minBytes (JPEG only). */
  allowPadding?: boolean;
};

/**
 * Finds the highest JPEG quality whose output fits under `maxBytes` (binary search on quality),
 * then, if the file is still smaller than `minBytes`, pads it up into the range.
 * Returns ok:false when even the lowest quality is too big; callers then shrink the pixels.
 */
export async function fitToByteRange(encode: Encoder, bounds: ByteBounds, opts: FitOptions = {}): Promise<FitResult> {
  const { preferredQuality = 0.92, minQuality = 0.05, maxQuality = 1, iterations = 8, allowPadding = true } = opts;
  let attempts = 0;
  const run = async (q: number) => {
    attempts++;
    return encode(q);
  };

  let best: { bytes: Uint8Array; q: number } | null = null;
  const first = await run(preferredQuality);
  if (first.length <= bounds.maxBytes) {
    best = { bytes: first, q: preferredQuality };
    if (first.length >= bounds.minBytes) return { ok: true, bytes: first, quality: preferredQuality, padded: false, attempts };
  }

  // Search the half of the quality range that can move us toward the target.
  let lo = best ? preferredQuality : minQuality;
  let hi = best ? maxQuality : preferredQuality;
  if (!best) {
    const smallest = await run(minQuality);
    if (smallest.length > bounds.maxBytes) return { ok: false, reason: "too-large", smallest: smallest.length, attempts };
    best = { bytes: smallest, q: minQuality };
  }
  for (let i = 0; i < iterations; i++) {
    const mid = (lo + hi) / 2;
    const out = await run(mid);
    if (out.length <= bounds.maxBytes) {
      if (mid > best.q) best = { bytes: out, q: mid };
      lo = mid;
      if (out.length >= bounds.minBytes && bounds.maxBytes - out.length < bounds.maxBytes * 0.04) break; // close enough
    } else {
      hi = mid;
    }
  }
  // Try the very top too when everything fit (small images): highest quality wins.
  if (best.bytes.length < bounds.minBytes && best.q < maxQuality) {
    const top = await run(maxQuality);
    if (top.length <= bounds.maxBytes) best = { bytes: top, q: maxQuality };
  }

  if (best.bytes.length >= bounds.minBytes) return { ok: true, bytes: best.bytes, quality: best.q, padded: false, attempts };
  if (!allowPadding) return { ok: true, bytes: best.bytes, quality: best.q, padded: false, attempts };
  const target = Math.min(bounds.minBytes + 2048, Math.floor((bounds.minBytes + bounds.maxBytes) / 2));
  return { ok: true, bytes: padJpeg(best.bytes, target), quality: best.q, padded: true, attempts };
}
