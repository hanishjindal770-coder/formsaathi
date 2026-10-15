import { describe, expect, it } from "vitest";
import jpeg from "jpeg-js";
import { fitToByteRange } from "@/lib/image/targetSize";
import { padJpeg, readJpegDpi, setJpegDpi } from "@/lib/image/jpeg";
import { cmToPx, dimsWithinSpec, kbToByteBounds, resolveTargetDims } from "@/lib/image/units";
import { clampCrop, initialCrop, resizeCrop, scaleCrop } from "@/lib/image/crop";
import { checkBackground, cleanInk, inkBounds, otsuThreshold } from "@/lib/image/pixels";

/** Deterministic pseudo-random noise so tests are stable. */
function rng(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

function makeImage(width: number, height: number, opts: { noise?: number; bg?: [number, number, number]; face?: boolean } = {}) {
  const { noise = 40, bg = [250, 250, 250], face = true } = opts;
  const rand = rng(42);
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const inFace = face && (x - width / 2) ** 2 / (width / 3) ** 2 + (y - height / 2) ** 2 / (height / 2.6) ** 2 < 1;
      const base = inFace ? [190, 140, 110] : bg;
      const n = inFace ? (rand() - 0.5) * noise : 0;
      data[i] = base[0] + n;
      data[i + 1] = base[1] + n;
      data[i + 2] = base[2] + n;
      data[i + 3] = 255;
    }
  }
  return { data, width, height };
}

const encoderFor = (img: { data: Uint8ClampedArray; width: number; height: number }) => async (q: number) =>
  new Uint8Array(jpeg.encode({ data: Buffer.from(img.data), width: img.width, height: img.height }, Math.round(q * 100)).data);

describe("fitToByteRange (real JPEG encoding)", () => {
  it("hits an IBPS-style 20–50 KB photo range", async () => {
    const img = makeImage(200, 230, { noise: 120 });
    const bounds = kbToByteBounds(20, 50);
    const r = await fitToByteRange(encoderFor(img), bounds);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.bytes.length).toBeGreaterThanOrEqual(bounds.minBytes);
    expect(r.bytes.length).toBeLessThanOrEqual(bounds.maxBytes);
    expect(jpeg.decode(r.bytes).width).toBe(200);
  });

  it("lowers quality to get under a tight maximum", async () => {
    const img = makeImage(600, 600, { noise: 160 });
    const bounds = kbToByteBounds(10, 20);
    const r = await fitToByteRange(encoderFor(img), bounds);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.quality).toBeLessThan(0.92);
    expect(r.bytes.length).toBeLessThanOrEqual(bounds.maxBytes);
    expect(r.bytes.length).toBeGreaterThanOrEqual(bounds.minBytes);
  });

  it("pads a small, simple image up to the minimum without breaking it", async () => {
    const img = makeImage(140, 60, { face: false });
    const bounds = kbToByteBounds(10, 20);
    const r = await fitToByteRange(encoderFor(img), bounds);
    expect(r.ok && r.padded).toBe(true);
    if (!r.ok) return;
    expect(r.bytes.length).toBeGreaterThanOrEqual(bounds.minBytes);
    expect(r.bytes.length).toBeLessThanOrEqual(bounds.maxBytes);
    const decoded = jpeg.decode(r.bytes);
    expect([decoded.width, decoded.height]).toEqual([140, 60]);
  });

  it("reports when no quality is small enough", async () => {
    const img = makeImage(800, 800, { noise: 255 });
    const r = await fitToByteRange(encoderFor(img), kbToByteBounds(undefined, 5));
    expect(r.ok).toBe(false);
  });

  it("uses few encodes", async () => {
    const img = makeImage(200, 230, { noise: 120 });
    const r = await fitToByteRange(encoderFor(img), kbToByteBounds(20, 50));
    expect(r.attempts).toBeLessThanOrEqual(12);
  });
});

describe("JPEG byte helpers", () => {
  const small = encoderFor(makeImage(50, 50, { face: false }));
  it("padJpeg reaches the exact size and stays decodable", async () => {
    const b = await small(0.9);
    for (const target of [b.length + 1, b.length + 4, b.length + 1000, b.length + 70000, b.length + 200000]) {
      const p = padJpeg(b, target);
      expect(p.length - target).toBeGreaterThanOrEqual(0);
      expect(p.length - target).toBeLessThanOrEqual(3);
      expect(jpeg.decode(p).width).toBe(50);
    }
  });
  it("setJpegDpi writes the density", async () => {
    const out = setJpegDpi(await small(0.9), 200);
    expect(readJpegDpi(out)).toBe(200);
    expect(jpeg.decode(out).width).toBe(50);
  });
  it("setJpegDpi adds a JFIF header when missing", async () => {
    const b = await small(0.9);
    // Strip APP0 if present to simulate an encoder that omits it.
    const stripped = b[3] === 0xe0 ? new Uint8Array([0xff, 0xd8, ...b.subarray(4 + ((b[4] << 8) | b[5]))]) : b;
    const out = setJpegDpi(stripped, 300);
    expect(readJpegDpi(out)).toBe(300);
    expect(jpeg.decode(out).height).toBe(50);
  });
});

describe("target dimensions", () => {
  it("uses exact pixels", () => {
    expect(resolveTargetDims({ widthPx: 200, heightPx: 230 }, "photo")).toMatchObject({ width: 200, height: 230 });
  });
  it("converts cm at the given or default DPI", () => {
    expect(cmToPx(2.54, 300)).toBe(300);
    expect(resolveTargetDims({ widthCm: 3.5, heightCm: 4.5, dpi: 200 }, "photo")).toMatchObject({ width: 276, height: 354, dpi: 200 });
    expect(resolveTargetDims({ widthCm: 3.5, heightCm: 4.5 }, "photo")).toMatchObject({ width: 138, height: 177, dpi: 100 });
  });
  it("picks a size inside pixel ranges without upscaling", () => {
    const spec = { widthPx: { min: 350, max: 1000 }, heightPx: { min: 350, max: 1000 } };
    const big = resolveTargetDims(spec, "photo", { width: 3000, height: 3800 });
    expect(dimsWithinSpec(spec, big.width, big.height)).toBe(true);
    expect(big.height).toBe(1000);
    const small = resolveTargetDims(spec, "photo", { width: 300, height: 390 });
    expect(dimsWithinSpec(spec, small.width, small.height)).toBe(true);
    const sign = resolveTargetDims(spec, "signature", { width: 2000, height: 600 });
    expect(dimsWithinSpec(spec, sign.width, sign.height)).toBe(true); // 3:1 clamped to what the ranges allow
  });
  it("keeps proportions in generic mode", () => {
    expect(resolveTargetDims({ widthPx: 600 }, "photo", { width: 1200, height: 900 })).toMatchObject({ width: 600, height: 450, aspect: null });
    expect(resolveTargetDims({}, "photo", { width: 4000, height: 3000 })).toMatchObject({ width: 2000, height: 1500 });
  });
  it("KB bounds pass under both 1000- and 1024-byte conventions", () => {
    const b = kbToByteBounds(20, 50);
    expect(b.minBytes).toBe(20480);
    expect(b.maxBytes).toBe(50000);
  });
});

describe("crop geometry", () => {
  it("starts centred with the locked aspect", () => {
    const r = initialCrop(1000, 1000, 0.5);
    expect(r.width / r.height).toBeCloseTo(0.5);
    expect(r.x + r.width / 2).toBeCloseTo(500);
  });
  it("never leaves the image and keeps the aspect when resizing", () => {
    const r = resizeCrop(initialCrop(800, 600, 4 / 3), 500, 500, 800, 600, 4 / 3);
    expect(r.x + r.width).toBeLessThanOrEqual(800.0001);
    expect(r.y + r.height).toBeLessThanOrEqual(600.0001);
    expect(r.width / r.height).toBeCloseTo(4 / 3);
    const c = clampCrop({ x: -50, y: 700, width: 100, height: 100 }, 800, 600, 1);
    expect(c).toEqual({ x: 0, y: 500, width: 100, height: 100 });
    const s = scaleCrop(initialCrop(800, 600, 1), 3, 800, 600, 1);
    expect(s.height).toBeLessThanOrEqual(600);
  });
});

describe("pixel operations", () => {
  it("detects white, light and dark backgrounds", () => {
    expect(checkBackground(makeImage(200, 230, { bg: [252, 252, 252] })).verdict).toBe("white");
    expect(checkBackground(makeImage(200, 230, { bg: [215, 225, 235] })).verdict).toBe("light");
    expect(checkBackground(makeImage(200, 230, { bg: [40, 60, 120] })).verdict).toBe("not-light");
  });

  function signaturePhoto() {
    // Grey, unevenly lit paper with a dark stroke across the middle.
    const w = 300, h = 100;
    const data = new Uint8ClampedArray(w * h * 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const paper = 200 - (x / w) * 60; // shadow toward the right
      const ink = Math.abs(y - 50 - Math.sin(x / 15) * 15) < 3 && x > 30 && x < 270;
      const v = ink ? 50 : paper;
      data[i] = v; data[i + 1] = v; data[i + 2] = v + 5; data[i + 3] = 255;
    }
    return { data, width: w, height: h };
  }

  it("cleans a signature to white paper and solid ink", () => {
    const px = signaturePhoto();
    cleanInk(px, { ink: "black" });
    let white = 0, black = 0;
    for (let i = 0; i < px.data.length; i += 4) {
      if (px.data[i] === 255 && px.data[i + 1] === 255) white++;
      if (px.data[i] < 30) black++;
    }
    const total = px.width * px.height;
    expect(white / total).toBeGreaterThan(0.85); // shadowed paper became pure white
    expect(black).toBeGreaterThan(1000); // stroke kept
  });

  it("can colour ink blue", () => {
    const px = signaturePhoto();
    cleanInk(px, { ink: "blue" });
    const i = (50 * px.width + 150) * 4; // a pixel near the stroke
    let found = false;
    for (let k = 0; k < px.data.length; k += 4) if (px.data[k + 2] > 120 && px.data[k] < 40) { found = true; break; }
    expect(found).toBe(true);
    expect(px.data[i + 3]).toBe(255);
  });

  it("finds ink bounds for auto-crop", () => {
    const px = signaturePhoto();
    cleanInk(px);
    const b = inkBounds(px)!;
    expect(b.x).toBeLessThan(35);
    expect(b.x + b.width).toBeGreaterThan(265);
    expect(b.width).toBeLessThan(300);
  });

  it("otsu splits a bimodal histogram between the peaks", () => {
    const g = [...Array(500).fill(40), ...Array(500).fill(220)];
    const t = otsuThreshold(g);
    expect(t).toBeGreaterThanOrEqual(40);
    expect(t).toBeLessThan(220);
  });
});
