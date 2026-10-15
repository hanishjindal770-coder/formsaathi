import { describe, expect, it } from "vitest";
import {
  anchorCenter,
  ANCHORS,
  boxBlur,
  boxColorFor,
  clampCenter,
  fontPx,
  luminance,
  normRect,
  pixelate,
  scaleRect,
  strengthPx,
  textBlock,
  textLines,
  tileGrid,
  tileStep,
  tinyRect,
} from "@/lib/image/annotate";
import { outputName } from "@/lib/image/edit";

const img = { width: 1000, height: 500 };
const box = { width: 200, height: 50 };

describe("text placement", () => {
  it("places the 9 presets inside the image with a margin", () => {
    const m = 15; // 3% of 500
    expect(anchorCenter("tl", img, box)).toEqual({ x: m + 100, y: m + 25 });
    expect(anchorCenter("mc", img, box)).toEqual({ x: 500, y: 250 });
    expect(anchorCenter("br", img, box)).toEqual({ x: 1000 - m - 100, y: 500 - m - 25 });
    expect(anchorCenter("tc", img, box).x).toBe(500);
    expect(anchorCenter("ml", img, box).y).toBe(250);
    for (const a of ANCHORS) {
      const c = anchorCenter(a, img, box);
      expect(c.x - 100).toBeGreaterThanOrEqual(0);
      expect(c.x + 100).toBeLessThanOrEqual(1000);
      expect(c.y - 25).toBeGreaterThanOrEqual(0);
      expect(c.y + 25).toBeLessThanOrEqual(500);
    }
  });

  it("clamps a dragged block inside, and centres a block wider than the image", () => {
    expect(clampCenter({ x: -50, y: 9999 }, img, box)).toEqual({ x: 100, y: 475 });
    expect(clampCenter({ x: 10, y: 10 }, img, { width: 1200, height: 50 })).toEqual({ x: 500, y: 25 });
  });

  it("measures text blocks and splits lines", () => {
    expect(textBlock([100, 180, 40], 20, 5)).toEqual({ width: 190, height: 70 });
    expect(textBlock([], 20, 0)).toEqual({ width: 0, height: 0 });
    expect(textLines("राम\r\n\nShyam\n\n")).toEqual(["राम", "", "Shyam"]);
    expect(textLines("   ")).toEqual([]);
  });

  it("scales font size with the shorter side", () => {
    expect(fontPx(10, img)).toBe(50);
    expect(fontPx(0.1, img)).toBe(8);
  });

  it("picks a contrasting box colour", () => {
    expect(luminance("#ffffff")).toBeCloseTo(1);
    expect(luminance("#000000")).toBe(0);
    expect(boxColorFor("#ffffff")).toBe("#000000");
    expect(boxColorFor("#ffeb3b")).toBe("#000000");
    expect(boxColorFor("#1d4ed8")).toBe("#ffffff");
  });
});

describe("watermark tiling", () => {
  it("covers the whole image at any angle", () => {
    const step = tileStep(box, 40);
    const pts = tileGrid(img, step);
    for (const deg of [0, 30, -45, 90]) {
      const a = (deg * Math.PI) / 180;
      // Every corner of the image, in the rotated frame, must be within one step of some point.
      for (const [cx, cy] of [[-500, -250], [500, -250], [-500, 250], [500, 250], [0, 0]]) {
        const rx = cx * Math.cos(-a) - cy * Math.sin(-a);
        const ry = cx * Math.sin(-a) + cy * Math.cos(-a);
        expect(pts.some((p) => Math.abs(p.x - rx) <= step.width && Math.abs(p.y - ry) <= step.height)).toBe(true);
      }
    }
  });

  it("offsets alternate rows and caps the count", () => {
    const pts = tileGrid({ width: 100, height: 100 }, { width: 40, height: 30 });
    const row0 = pts.filter((p) => p.y === 0).map((p) => p.x);
    const row1 = pts.filter((p) => p.y === 30).map((p) => p.x);
    expect(row0).toContain(0);
    expect(row1).toContain(20);
    expect(tileGrid({ width: 10000, height: 10000 }, { width: 1, height: 1 }, 500)).toHaveLength(500);
  });
});

describe("rectangles", () => {
  it("normalises any drag direction and clamps to the image", () => {
    expect(normRect({ x: 300, y: 200 }, { x: 100.4, y: 50.6 }, img)).toEqual({ x: 100, y: 50, width: 200, height: 150 });
    expect(normRect({ x: -20, y: -20 }, { x: 2000, y: 900 }, img)).toEqual({ x: 0, y: 0, width: 1000, height: 500 });
    expect(normRect({ x: 1200, y: 10 }, { x: 1300, y: 20 }, img).width).toBe(0);
  });

  it("flags taps as too small", () => {
    expect(tinyRect({ x: 0, y: 0, width: 2, height: 50 })).toBe(true);
    expect(tinyRect({ x: 0, y: 0, width: 20, height: 50 })).toBe(false);
  });

  it("maps preview rects to full size", () => {
    expect(scaleRect({ x: 10, y: 10, width: 50, height: 25 }, { width: 100, height: 50 }, img)).toEqual({ x: 100, y: 100, width: 500, height: 250 });
  });

  it("scales strength with the image", () => {
    expect(strengthPx(8, { width: 4000, height: 3000 })).toBe(80);
    expect(strengthPx(1, { width: 100, height: 100 })).toBe(2);
  });
});

/** RGBA buffer filled by fn(x, y) → grey value. */
function buf(w: number, h: number, fn: (x: number, y: number) => number) {
  const d = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    d[i] = d[i + 1] = d[i + 2] = fn(x, y);
    d[i + 3] = 255;
  }
  return d;
}

describe("pixel filters", () => {
  it("pixelates into flat blocks, including a partial edge block", () => {
    const d = buf(5, 2, (x) => x * 10); // 0 10 20 30 40
    pixelate(d, 5, 2, 2);
    const row = [0, 1, 2, 3, 4].map((x) => d[x * 4]);
    expect(row).toEqual([5, 5, 25, 25, 40]);
    expect(d[(5 + 1) * 4]).toBe(5); // second row same block
    expect(d[3]).toBe(255);
  });

  it("box blur keeps a flat image flat and preserves the average", () => {
    const flat = buf(6, 6, () => 77);
    boxBlur(flat, 6, 6, 3);
    expect(new Set(flat).size).toBe(2); // 77 and 255 alpha

    const w = 20, h = 4;
    const edge = buf(w, h, (x) => (x < 10 ? 0 : 200));
    boxBlur(edge, w, h, 4);
    const row = Array.from({ length: w }, (_, x) => edge[x * 4]);
    expect(row[0]).toBe(0);
    expect(row[19]).toBe(200);
    expect(row[9]).toBeGreaterThan(30);
    expect(row[10]).toBeLessThan(170);
    for (let x = 1; x < w; x++) expect(row[x]).toBeGreaterThanOrEqual(row[x - 1]); // monotonic, no ringing
  });

  it("handles a 1-pixel buffer", () => {
    const d = buf(1, 1, () => 9);
    boxBlur(d, 1, 1, 5);
    pixelate(d, 1, 1, 8);
    expect(d[0]).toBe(9);
  });
});

it("names files after text and blur edits", () => {
  expect(outputName("pic.jpg", ["text", "blurred"], "jpeg")).toBe("pic-text-blurred.jpg");
});
