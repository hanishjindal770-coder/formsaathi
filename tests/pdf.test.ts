import { describe, expect, it } from "vitest";
import jpeg from "jpeg-js";
import { PDFDocument } from "pdf-lib";
import { A4_PT, imagesToPdf, mergePdfs, pageCount, pagesFromJpegs } from "@/lib/pdf/build";
import { fitToByteRange } from "@/lib/image/targetSize";
import { A4_CM, layoutSheet, PHOTO_SIZES } from "@/lib/print/sheet";

function jpg(w: number, h: number, q = 80, noise = 0) {
  const data = Buffer.alloc(w * h * 4);
  let s = 7;
  for (let i = 0; i < data.length; i += 4) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const n = noise ? (s / 2 ** 32) * noise : 0;
    data[i] = 200 - n; data[i + 1] = 180 - n; data[i + 2] = 160 - n; data[i + 3] = 255;
  }
  return new Uint8Array(jpeg.encode({ data, width: w, height: h }, q).data);
}

describe("imagesToPdf", () => {
  it("puts each image on its own A4 page, landscape pages for landscape images", async () => {
    const pdf = await imagesToPdf([
      { bytes: jpg(300, 400), format: "jpeg", width: 300, height: 400 },
      { bytes: jpg(400, 300), format: "jpeg", width: 400, height: 300 },
    ]);
    const doc = await PDFDocument.load(pdf);
    expect(doc.getPageCount()).toBe(2);
    expect(doc.getPage(0).getWidth()).toBeCloseTo(A4_PT.width);
    expect(doc.getPage(1).getWidth()).toBeCloseTo(A4_PT.height);
  });
  it("can size pages to the image", async () => {
    const doc = await PDFDocument.load(await imagesToPdf([{ bytes: jpg(150, 300), format: "jpeg", width: 150, height: 300 }], { pageSize: "fit", ptPerPx: 72 / 150 }));
    expect(doc.getPage(0).getWidth()).toBeCloseTo(72);
    expect(doc.getPage(0).getHeight()).toBeCloseTo(144);
  });
});

describe("mergePdfs", () => {
  it("keeps every page in order", async () => {
    const a = await imagesToPdf([{ bytes: jpg(100, 100), format: "jpeg", width: 100, height: 100 }]);
    const b = await imagesToPdf([1, 2].map(() => ({ bytes: jpg(100, 200), format: "jpeg" as const, width: 100, height: 200 })), { pageSize: "fit" });
    const merged = await mergePdfs([a, b]);
    expect(await pageCount(merged)).toBe(3);
    const doc = await PDFDocument.load(merged);
    expect(doc.getPage(0).getWidth()).toBeCloseTo(A4_PT.width);
    expect(doc.getPage(2).getHeight()).toBeCloseTo(96);
  });
});

describe("compress search (rebuild from JPEG pages)", () => {
  it("finds a quality that fits the target KB", async () => {
    const raw = Buffer.alloc(800 * 1100 * 4);
    let s = 3;
    for (let i = 0; i < raw.length; i++) raw[i] = (s = (s * 1664525 + 1013904223) >>> 0) >>> 24;
    const encode = async (q: number) =>
      pagesFromJpegs([0, 1].map(() => ({ jpeg: new Uint8Array(jpeg.encode({ data: raw, width: 800, height: 1100 }, Math.round(q * 100)).data), widthPt: A4_PT.width, heightPt: A4_PT.height })));
    const big = await encode(0.9);
    const target = Math.round(big.length * 0.4);
    const r = await fitToByteRange(encode, { minBytes: 0, maxBytes: target }, { preferredQuality: 0.75, minQuality: 0.05, allowPadding: false, iterations: 6 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.bytes.length).toBeLessThanOrEqual(target);
      expect(await pageCount(r.bytes)).toBe(2);
    }
  });
});

describe("layoutSheet", () => {
  it("fits 8 and 16 passport photos and 32 stamp photos on A4", () => {
    for (const [count, size] of [[8, "passport"], [16, "passport"], [32, "stamp"]] as const) {
      const { w, h } = PHOTO_SIZES[size];
      const l = layoutSheet(count, w, h)!;
      expect(l, `${count} ${size}`).not.toBeNull();
      expect(l.cells).toHaveLength(count);
      for (const c of l.cells) {
        expect(c.x).toBeGreaterThanOrEqual(0.8 - 1e-9);
        expect(c.y).toBeGreaterThanOrEqual(0.8 - 1e-9);
        expect(c.x + w).toBeLessThanOrEqual(A4_CM.width - 0.8 + 1e-9);
        expect(c.y + h).toBeLessThanOrEqual(A4_CM.height - 0.8 + 1e-9);
      }
    }
  });
  it("refuses layouts that don't fit", () => {
    expect(layoutSheet(32, 3.5, 4.5)).toBeNull();
  });
  it("never overlaps photos", () => {
    const l = layoutSheet(16, 3.5, 4.5)!;
    for (let i = 1; i < l.cells.length; i++) {
      const a = l.cells[i - 1], b = l.cells[i];
      expect(a.y !== b.y || b.x - a.x >= 3.5).toBe(true);
    }
  });
});
