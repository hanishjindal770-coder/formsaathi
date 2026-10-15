import { describe, expect, it } from "vitest";
import {
  acceptFiles, baseName, detectFormat, MAX_OUTPUT_SIDE, outputFormat, outputNames, planResize, shrinkFactor, totals, uniqueName, validateMode,
} from "@/lib/image/bulk";

const src = { width: 4000, height: 3000 };

describe("planResize", () => {
  it("percent scales both sides", () => {
    const p = planResize(src, { kind: "percent", percent: 25 });
    expect([p.width, p.height]).toEqual([1000, 750]);
    expect(p.crop).toEqual({ x: 0, y: 0, width: 4000, height: 3000 });
    expect(p.dest).toEqual({ x: 0, y: 0, width: 1000, height: 750 });
  });

  it("percent never goes below 1 px or above the canvas cap", () => {
    expect(planResize({ width: 3, height: 2 }, { kind: "percent", percent: 1 })).toMatchObject({ width: 1, height: 1 });
    const big = planResize(src, { kind: "percent", percent: 500 });
    expect(big.width).toBe(MAX_OUTPUT_SIDE);
    expect(big.height).toBe(6000);
  });

  it("fit keeps aspect inside the box and never enlarges", () => {
    expect(planResize(src, { kind: "fit", width: 800, height: 800 })).toMatchObject({ width: 800, height: 600 });
    expect(planResize({ width: 1000, height: 2000 }, { kind: "fit", width: 800, height: 800 })).toMatchObject({ width: 400, height: 800 });
    expect(planResize({ width: 300, height: 200 }, { kind: "fit", width: 800, height: 800 })).toMatchObject({ width: 300, height: 200 });
  });

  it("exact + crop fills the box with a centred crop of the right aspect", () => {
    const p = planResize(src, { kind: "exact", width: 200, height: 200, fill: "crop" });
    expect([p.width, p.height]).toEqual([200, 200]);
    expect(p.crop).toEqual({ x: 500, y: 0, width: 3000, height: 3000 });
    expect(p.dest).toEqual({ x: 0, y: 0, width: 200, height: 200 });
    const tall = planResize(src, { kind: "exact", width: 400, height: 100, fill: "crop" });
    expect(tall.crop).toEqual({ x: 0, y: 1000, width: 4000, height: 1000 });
  });

  it("exact + pad shows the whole image centred with bars", () => {
    const p = planResize(src, { kind: "exact", width: 200, height: 200, fill: "pad" });
    expect([p.width, p.height]).toEqual([200, 200]);
    expect(p.crop).toEqual({ x: 0, y: 0, width: 4000, height: 3000 });
    expect(p.dest).toEqual({ x: 0, y: 25, width: 200, height: 150 });
  });

  it("kb mode keeps the size", () => {
    expect(planResize(src, { kind: "kb", maxKB: 50 })).toMatchObject({ width: 4000, height: 3000 });
  });
});

describe("validateMode", () => {
  it("flags bad numbers", () => {
    expect(validateMode({ kind: "percent", percent: 50 })).toBeNull();
    expect(validateMode({ kind: "percent", percent: 0 })).toBe("percent");
    expect(validateMode({ kind: "percent", percent: NaN })).toBe("percent");
    expect(validateMode({ kind: "fit", width: 100, height: 0 })).toBe("size");
    expect(validateMode({ kind: "exact", width: 9000, height: 100, fill: "pad" })).toBe("size");
    expect(validateMode({ kind: "kb", maxKB: 1 })).toBe("kb");
    expect(validateMode({ kind: "kb", maxKB: 50 })).toBeNull();
  });
});

describe("formats", () => {
  it("detects by MIME or extension", () => {
    expect(detectFormat("image/jpeg", "a")).toBe("jpeg");
    expect(detectFormat("", "A.JPG")).toBe("jpeg");
    expect(detectFormat("", "x.bmp")).toBe("bmp");
    expect(detectFormat("application/pdf", "x.pdf")).toBeNull();
  });

  it("keep turns gif/bmp into png, kb mode forces a lossy format", () => {
    const pct = { kind: "percent", percent: 50 } as const;
    const kbm = { kind: "kb", maxKB: 50 } as const;
    expect(outputFormat({ type: "image/jpeg", name: "a.jpg" }, "keep", pct)).toBe("jpeg");
    expect(outputFormat({ type: "image/webp", name: "a.webp" }, "keep", pct)).toBe("webp");
    expect(outputFormat({ type: "image/gif", name: "a.gif" }, "keep", pct)).toBe("png");
    expect(outputFormat({ type: "image/bmp", name: "a.bmp" }, "keep", pct)).toBe("png");
    expect(outputFormat({ type: "image/png", name: "a.png" }, "keep", kbm)).toBe("jpeg");
    expect(outputFormat({ type: "image/png", name: "a.png" }, "png", kbm)).toBe("jpeg");
    expect(outputFormat({ type: "image/png", name: "a.png" }, "webp", kbm)).toBe("webp");
    expect(outputFormat({ type: "image/png", name: "a.png" }, "webp", pct, false)).toBe("jpeg");
  });
});

describe("names", () => {
  it("cleans base names", () => {
    expect(baseName("C:\\Users\\me\\IMG_1.jpeg")).toBe("IMG_1");
    expect(baseName("dir/a:b?.png")).toBe("a_b_");
    expect(baseName(".png")).toBe("image");
    expect(baseName("फोटो.jpg")).toBe("फोटो");
  });

  it("de-duplicates case-insensitively", () => {
    expect(outputNames([
      { name: "photo.png", ext: "jpg" },
      { name: "photo.jpg", ext: "jpg" },
      { name: "Photo.JPEG", ext: "jpg" },
      { name: "photo (2).jpg", ext: "jpg" },
      { name: "photo.jpg", ext: "png" },
    ])).toEqual(["photo.jpg", "photo (2).jpg", "Photo (3).jpg", "photo (2) (2).jpg", "photo.png"]);
    const used = new Set<string>();
    expect(uniqueName("a.jpg", "webp", used)).toBe("a.webp");
    expect(uniqueName("a.png", "webp", used)).toBe("a (2).webp");
  });
});

describe("helpers", () => {
  it("acceptFiles filters and limits", () => {
    const f = (name: string) => ({ name, type: "" });
    const r = acceptFiles(98, [f("a.jpg"), f("b.pdf"), f("c.png"), f("d.gif")]);
    expect(r.accepted.map((x) => x.name)).toEqual(["a.jpg", "c.png"]);
    expect(r.unsupported).toBe(1);
    expect(r.overLimit).toBe(1);
  });

  it("shrinkFactor stays between 0.5 and 0.9", () => {
    expect(shrinkFactor(100, 10000)).toBe(0.5);
    expect(shrinkFactor(99, 100)).toBe(0.9);
    expect(shrinkFactor(50, 100)).toBeCloseTo(Math.sqrt(0.5) * 0.95);
  });

  it("totals only count finished rows", () => {
    expect(totals([{ before: 1000, after: 250 }, { before: 500 }, { before: 1000, after: 750 }])).toEqual({ before: 2000, after: 1000, done: 2, savedPercent: 50 });
    expect(totals([]).savedPercent).toBe(0);
  });
});
