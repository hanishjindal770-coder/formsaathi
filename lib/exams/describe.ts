import type { Lang } from "@/i18n/config";
import type { DocSpec, ExamSpec } from "./schema";
import { pxRangeLabel } from "@/lib/image/units";

/** Human-readable rule fragments, shared by tool checklists, rule tables, FAQs and meta tags. */

export const formatLabel = (spec: Pick<DocSpec, "format">) =>
  [...new Set(spec.format.map((f) => (f === "jpeg" ? "jpg" : f)))].map((f) => f.toUpperCase()).join("/");

export function kbRangeLabel(minKB: number | undefined, maxKB: number, lang: Lang) {
  if (minKB) return `${minKB}–${maxKB} KB`;
  return lang === "hi" ? `अधिकतम ${maxKB} KB` : `up to ${maxKB} KB`;
}

export function pxLabel(spec: Pick<DocSpec, "widthPx" | "heightPx">): string | undefined {
  const w = pxRangeLabel(spec.widthPx);
  const h = pxRangeLabel(spec.heightPx);
  if (!w && !h) return undefined;
  return `${w ?? "?"} × ${h ?? "?"} px`;
}

export function cmLabel(spec: Pick<DocSpec, "widthCm" | "heightCm" | "dpi">): string | undefined {
  if (!spec.widthCm || !spec.heightCm) return undefined;
  return `${spec.widthCm} × ${spec.heightCm} cm${spec.dpi ? ` @ ${spec.dpi} DPI` : ""}`;
}

export function docRulesSummary(spec: DocSpec, lang: Lang): string {
  return [formatLabel(spec), kbRangeLabel(spec.minKB, spec.maxKB, lang), pxLabel(spec) ?? cmLabel(spec)].filter(Boolean).join(", ");
}

const bgLabels = {
  en: { white: "Plain white", light: "Light / white", any: "Any" },
  hi: { white: "सादा सफ़ेद", light: "हल्का / सफ़ेद", any: "कोई भी" },
};
export const backgroundLabel = (bg: NonNullable<DocSpec["background"]>, lang: Lang) => bgLabels[lang][bg];

/** Exams in the same category (and state first), for "similar exams" links. */
export function similarExams(exam: ExamSpec, all: ExamSpec[], limit = 6): ExamSpec[] {
  return all
    .filter((e) => e.slug !== exam.slug && (e.category === exam.category || (exam.state && e.state === exam.state) || e.body === exam.body))
    .sort((a, b) => Number(b.state === exam.state && !!exam.state) - Number(a.state === exam.state && !!exam.state))
    .slice(0, limit);
}

/** The small, serialisable subset of an exam that client components need. */
export type ExamSummary = Pick<ExamSpec, "slug" | "name" | "body" | "state" | "category">;
export const summarize = (e: ExamSpec): ExamSummary => ({ slug: e.slug, name: e.name, body: e.body, state: e.state, category: e.category });
