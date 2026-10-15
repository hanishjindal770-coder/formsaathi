import { describe, expect, it } from "vitest";
import {
  clampDims,
  cropRatio,
  formatForInput,
  fromPx,
  historyOverflow,
  isSameFormat,
  lockedDims,
  looksLikeHeic,
  MAX_AREA,
  outputName,
  parseRatio,
  roundUnit,
  savedPercent,
  scaleByPercent,
  shrinkScaleFor,
  toPx,
  upscaleFactor,
} from "@/lib/image/edit";

describe("size math", () => {
  it("scales by percent with at least 1px", () => {
    expect(scaleByPercent({ width: 1000, height: 750 }, 50)).toEqual({ width: 500, height: 375 });
    expect(scaleByPercent({ width: 3, height: 1 }, 10)).toEqual({ width: 1, height: 1 });
  });
  it("keeps aspect when locked", () => {
    expect(lockedDims({ width: 4000, height: 3000 }, "width", 600, true, 0)).toEqual({ width: 600, height: 450 });
    expect(lockedDims({ width: 4000, height: 3000 }, "height", 300, true, 0)).toEqual({ width: 400, height: 300 });
    expect(lockedDims({ width: 4000, height: 3000 }, "width", 600, false, 600)).toEqual({ width: 600, height: 600 });
  });
  it("converts cm/inch at a DPI", () => {
    expect(toPx(1, "in", 300)).toBe(300);
    expect(Math.round(toPx(3.5, "cm", 300))).toBe(413);
    expect(roundUnit(fromPx(413, "cm", 300), "cm")).toBe(3.5);
    expect(toPx(640, "px", 300)).toBe(640);
  });
  it("measures upscaling and clamps to browser limits", () => {
    expect(upscaleFactor({ width: 2000, height: 1000 }, { width: 500, height: 500 })).toBe(4);
    const c = clampDims({ width: 20000, height: 10000 });
    expect(c.clamped).toBe(true);
    expect(c.width * c.height).toBeLessThanOrEqual(MAX_AREA);
    expect(c.width).toBeLessThanOrEqual(16384);
    expect(clampDims({ width: 100, height: 100 })).toEqual({ width: 100, height: 100, clamped: false });
  });
});

describe("crop presets", () => {
  it("returns ratios", () => {
    expect(cropRatio("free")).toBeNull();
    expect(cropRatio("1:1")).toBe(1);
    expect(cropRatio("16:9")).toBeCloseTo(16 / 9);
    expect(cropRatio("passport")).toBeCloseTo(3.5 / 4.5);
    expect(cropRatio("custom", { w: 2, h: 3 })).toBeCloseTo(2 / 3);
    expect(cropRatio("custom", { w: 0, h: 3 })).toBeNull();
  });
  it("parses ratio strings", () => {
    expect(parseRatio("16:9")).toBeCloseTo(16 / 9);
    expect(parseRatio("3.5 x 4.5")).toBeCloseTo(3.5 / 4.5);
    expect(parseRatio("abc")).toBeNull();
    expect(parseRatio("0:1")).toBeNull();
  });
});

describe("formats and naming", () => {
  it("maps inputs to output formats", () => {
    expect(formatForInput("image/jpeg")).toBe("jpeg");
    expect(formatForInput("image/png")).toBe("png");
    expect(formatForInput("image/gif")).toBe("png");
    expect(formatForInput("image/webp")).toBe("webp");
    expect(formatForInput("image/bmp")).toBe("jpeg");
    expect(formatForInput("", "x.PNG")).toBe("png");
    expect(isSameFormat("image/jpeg", "jpeg")).toBe(true);
    expect(isSameFormat("image/png", "jpeg")).toBe(false);
    expect(looksLikeHeic("", "IMG_1.HEIC")).toBe(true);
    expect(looksLikeHeic("image/heif", "a")).toBe(true);
  });
  it("names outputs", () => {
    expect(outputName("My Photo (1).HEIC", ["cropped", "resized"], "jpeg")).toBe("my-photo-1-cropped-resized.jpg");
    expect(outputName("a.png", ["resized", "resized"], "webp")).toBe("a-resized.webp");
    expect(outputName("फोटो.jpg", [], "png")).toBe("फोटो-edited.png");
    expect(outputName(".jpg", ["rotated"], "jpeg")).toBe("image-rotated.jpg");
  });
  it("computes savings", () => {
    expect(savedPercent(1000, 250)).toBe(75);
    expect(savedPercent(1000, 1200)).toBe(-20);
    expect(savedPercent(0, 10)).toBe(0);
  });
});

describe("history and compression helpers", () => {
  it("trims by count and pixel budget", () => {
    expect(historyOverflow(new Array(12).fill(1))).toBe(2);
    expect(historyOverflow([50e6, 50e6, 10e6], 10, 80e6)).toBe(1);
    expect(historyOverflow([200e6], 10, 80e6)).toBe(0); // always keep the latest
  });
  it("shrinks proportionally to the byte overshoot", () => {
    expect(shrinkScaleFor(400_000, 100_000)).toBeCloseTo(0.46, 2);
    expect(shrinkScaleFor(101_000, 100_000)).toBe(0.9);
  });
});
