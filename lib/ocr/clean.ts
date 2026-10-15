/** Tidies raw Tesseract output so it is ready to paste into a form or notes. */

export type OcrLang = "hin" | "eng" | "hin+eng";

export function cleanOcrText(raw: string): string {
  return (
    raw
      .replace(/\r\n?/g, "\n")
      // Tesseract emits form feeds between pages and stray NBSPs.
      .replace(/\f/g, "\n")
      .replace(/ /g, " ")
      // English words split across lines: "exam-\nination" -> "examination". Only when a Latin
      // letter is before the hyphen and a lowercase Latin letter after, so "Covid-\n19" and
      // real dashes at line ends are left alone.
      .replace(/(\p{Script=Latin})-[ \t]*\n[ \t]*(\p{Ll})/gu, "$1$2")
      // A straight bar right after Hindi text is almost always a misread danda (।).
      .replace(/(\p{Script=Devanagari})[ \t]*\|(?=\s|$)/gu, "$1।")
      // Trailing spaces on every line.
      .replace(/[ \t]+$/gm, "")
      // Keep at most one empty line between paragraphs.
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^\n+|\n+$/g, "")
  );
}

/** "hi" site → Hindi + English (Hindi pages often mix both); "en" site → English only. */
export const defaultOcrLang = (siteLang: "hi" | "en"): OcrLang => (siteLang === "hi" ? "hin+eng" : "eng");

// Approximate first-run download in MB (gzip'd as served): the tesseract core plus each model.
// Later runs read the models from IndexedDB, and the service worker keeps the scripts.
const CORE_MB = 1.5;
const MODEL_MB: Record<"hin" | "eng", number> = { eng: 2, hin: 0.9 };

export function firstRunMB(lang: OcrLang): number {
  const total = lang.split("+").reduce((n, l) => n + MODEL_MB[l as "hin" | "eng"], CORE_MB);
  return Math.round(total * 10) / 10;
}

/** File name for the .txt download, based on the picked image's name. */
export function txtName(imageName: string | undefined): string {
  const base = (imageName ?? "").replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|]+/g, "_").trim();
  return `${base || "text"}.txt`;
}
