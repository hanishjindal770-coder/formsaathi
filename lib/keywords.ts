import type { EnabledToolId } from "@/lib/tools/registry";

/**
 * Generic keyword landing pages (e.g. /hi/resize-image-to-20kb/). Each one is a preset of a
 * generic tool. Add sizes here; pages and sitemap entries follow automatically.
 */
export type KeywordKind = "imageKb" | "signatureKb" | "imagePx" | "pdfKb" | "convert";

export type KeywordPage = {
  slug: string;
  tool: EnabledToolId;
  kind: KeywordKind;
  preset: { maxKB?: number; widthPx?: number; heightPx?: number; to?: "jpeg" | "png"; from?: string };
};

const IMAGE_KB = [10, 20, 30, 40, 50, 100, 200, 500];
const SIGNATURE_KB = [10, 20, 50];
const PDF_KB = [50, 100, 200, 300, 500];
/** Common form sizes: bank photo, bank signature, thumb, square, passport at 300 DPI. */
const IMAGE_PX: [number, number][] = [[200, 230], [140, 60], [240, 240], [300, 300], [600, 600], [413, 531], [800, 400]];

export const KEYWORD_PAGES: KeywordPage[] = [
  ...IMAGE_KB.map((kb) => ({ slug: `resize-image-to-${kb}kb`, tool: "photo-resize" as const, kind: "imageKb" as const, preset: { maxKB: kb } })),
  ...SIGNATURE_KB.map((kb) => ({ slug: `signature-resize-${kb}kb`, tool: "signature-resize" as const, kind: "signatureKb" as const, preset: { maxKB: kb } })),
  ...IMAGE_PX.map(([w, h]) => ({ slug: `resize-image-to-${w}x${h}-pixels`, tool: "photo-resize" as const, kind: "imagePx" as const, preset: { widthPx: w, heightPx: h } })),
  ...PDF_KB.map((kb) => ({ slug: `compress-pdf-to-${kb}kb`, tool: "pdf-compress" as const, kind: "pdfKb" as const, preset: { maxKB: kb } })),
  { slug: "jpg-to-png", tool: "image-convert", kind: "convert", preset: { from: "JPG", to: "png" } },
  { slug: "png-to-jpg", tool: "image-convert", kind: "convert", preset: { from: "PNG", to: "jpeg" } },
];

export const getKeywordPage = (slug: string) => KEYWORD_PAGES.find((k) => k.slug === slug);

/** Placeholder values for a keyword page's title template. */
export const keywordVars = (k: KeywordPage) => ({
  kb: k.preset.maxKB ?? "",
  w: k.preset.widthPx ?? "",
  h: k.preset.heightPx ?? "",
  from: k.preset.from ?? "",
  to: k.preset.to === "png" ? "PNG" : "JPG",
});
