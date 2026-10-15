/**
 * Pixel-level operations on RGBA buffers (ImageData.data layout). Pure, so they run in
 * Vitest, Web Workers and the main thread alike.
 */

export type Pixels = { data: Uint8ClampedArray; width: number; height: number };

export const luminance = (r: number, g: number, b: number) => 0.299 * r + 0.587 * g + 0.114 * b;

export type BackgroundVerdict = "white" | "light" | "not-light";
export type BackgroundCheck = { whiteRatio: number; lightRatio: number; verdict: BackgroundVerdict };

/**
 * Checks the background of a portrait by sampling a band along the left, right and top edges
 * (the bottom is usually shoulders/clothes). A pixel is "white" if it is bright and unsaturated,
 * "light" if it is reasonably bright and only mildly tinted.
 */
export function checkBackground(px: Pixels, bandFraction = 0.06, threshold = 0.7): BackgroundCheck {
  const { data, width, height } = px;
  const band = Math.max(2, Math.round(Math.min(width, height) * bandFraction));
  let total = 0;
  let white = 0;
  let light = 0;
  const visit = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mn = Math.min(r, g, b);
    const spread = Math.max(r, g, b) - mn;
    total++;
    if (mn >= 225 && spread <= 25) white++;
    if (mn >= 180 && spread <= 45) light++;
  };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y < band || x < band || x >= width - band) visit(x, y);
    }
  }
  const whiteRatio = total ? white / total : 0;
  const lightRatio = total ? light / total : 0;
  const verdict: BackgroundVerdict = whiteRatio >= threshold ? "white" : lightRatio >= threshold ? "light" : "not-light";
  return { whiteRatio, lightRatio, verdict };
}

export function toGray(px: Pixels): Float32Array {
  const { data, width, height } = px;
  const out = new Float32Array(width * height);
  for (let i = 0, j = 0; j < out.length; i += 4, j++) out[j] = luminance(data[i], data[i + 1], data[i + 2]);
  return out;
}

/** Otsu's method: the threshold that best separates ink from paper in a grayscale histogram. */
export function otsuThreshold(gray: ArrayLike<number>): number {
  const hist = new Array(256).fill(0);
  for (let i = 0; i < gray.length; i++) hist[Math.max(0, Math.min(255, Math.round(gray[i])))]++;
  const total = gray.length;
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sumB = 0, wB = 0, best = 0, bestT = 127;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB) continue;
    const wF = total - wB;
    if (!wF) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) ** 2;
    if (between > best) {
      best = between;
      bestT = t;
    }
  }
  return bestT;
}

/**
 * Removes uneven lighting (shadows from a phone held over paper): divides each pixel by a
 * heavily blurred copy of the image, which approximates the paper colour at that spot.
 */
export function flattenLighting(gray: Float32Array, width: number, height: number, radius?: number): Float32Array {
  const r = radius ?? Math.max(4, Math.round(Math.min(width, height) / 8));
  // Integral image for an O(n) box blur.
  const W = width + 1;
  const integral = new Float64Array(W * (height + 1));
  for (let y = 0; y < height; y++) {
    let row = 0;
    for (let x = 0; x < width; x++) {
      row += gray[y * width + x];
      integral[(y + 1) * W + (x + 1)] = integral[y * W + (x + 1)] + row;
    }
  }
  const out = new Float32Array(gray.length);
  for (let y = 0; y < height; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(height, y + r + 1);
    for (let x = 0; x < width; x++) {
      const x0 = Math.max(0, x - r), x1 = Math.min(width, x + r + 1);
      const s = integral[y1 * W + x1] - integral[y0 * W + x1] - integral[y1 * W + x0] + integral[y0 * W + x0];
      const mean = s / ((y1 - y0) * (x1 - x0));
      // The local mean is pulled down by ink; brightening it slightly keeps paper at pure white.
      const bg = Math.max(1, Math.min(255, mean * 1.08));
      out[y * width + x] = Math.min(255, (gray[y * width + x] / bg) * 255);
    }
  }
  return out;
}

export type InkColor = "black" | "blue";
const INK_RGB: Record<InkColor, [number, number, number]> = { black: [0, 0, 0], blue: [13, 33, 161] };

export type CleanOptions = {
  ink?: InkColor;
  /** 0–255; omit for automatic (Otsu after lighting correction). */
  threshold?: number;
  /** Width of the soft edge around the threshold, keeps strokes smooth. */
  softness?: number;
  flatten?: boolean;
};

/**
 * Signature / thumb / handwriting cleanup: pure white paper, solid ink. Modifies `px.data` in
 * place and returns the threshold that was used.
 */
export function cleanInk(px: Pixels, opts: CleanOptions = {}): number {
  const { ink = "black", softness = 14, flatten = true } = opts;
  let gray = toGray(px);
  if (flatten) gray = flattenLighting(gray, px.width, px.height);
  const t = opts.threshold ?? Math.min(225, Math.max(60, otsuThreshold(gray) + 10));
  const [ir, ig, ib] = INK_RGB[ink];
  const { data } = px;
  for (let j = 0, i = 0; j < gray.length; j++, i += 4) {
    const g = gray[j];
    // a = 1 → ink, 0 → paper, linear ramp across the soft edge.
    const a = g <= t - softness ? 1 : g >= t + softness ? 0 : (t + softness - g) / (2 * softness);
    data[i] = Math.round(255 + (ir - 255) * a);
    data[i + 1] = Math.round(255 + (ig - 255) * a);
    data[i + 2] = Math.round(255 + (ib - 255) * a);
    data[i + 3] = 255;
  }
  return t;
}

/** Bounding box of non-white pixels plus a margin (for "auto-crop to signature"). Null if blank. */
export function inkBounds(px: Pixels, whiteCutoff = 200, marginFraction = 0.06) {
  const { data, width, height } = px;
  let x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (luminance(data[i], data[i + 1], data[i + 2]) < whiteCutoff) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) return null;
  const m = Math.round(Math.max(x1 - x0, y1 - y0) * marginFraction) + 2;
  const x = Math.max(0, x0 - m), y = Math.max(0, y0 - m);
  return { x, y, width: Math.min(width, x1 + m + 1) - x, height: Math.min(height, y1 + m + 1) - y };
}
