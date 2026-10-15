/**
 * Generic keyword landing pages (e.g. /hi/resize-image-to-20kb/). Each one is a preset of a
 * generic tool. Add sizes here; pages and sitemap entries follow automatically.
 */
export type KeywordPage = {
  slug: string;
  tool: "photo-resize" | "signature-resize";
  kind: "imageKb" | "signatureKb";
  maxKB: number;
};

const IMAGE_KB = [10, 20, 30, 40, 50, 100, 200, 500];
const SIGNATURE_KB = [10, 20, 50];

export const KEYWORD_PAGES: KeywordPage[] = [
  ...IMAGE_KB.map((kb) => ({ slug: `resize-image-to-${kb}kb`, tool: "photo-resize" as const, kind: "imageKb" as const, maxKB: kb })),
  ...SIGNATURE_KB.map((kb) => ({ slug: `signature-resize-${kb}kb`, tool: "signature-resize" as const, kind: "signatureKb" as const, maxKB: kb })),
];

export const getKeywordPage = (slug: string) => KEYWORD_PAGES.find((k) => k.slug === slug);
