import type { Lang } from "@/i18n/config";
import { LOCALES } from "@/i18n/config";
import { getAllExams, getExam } from "@/lib/exams/load";
import { KEYWORD_PAGES, getKeywordPage } from "@/lib/keywords";
import { enabledTools, getTool, toolsForExam } from "@/lib/tools/registry";

/**
 * The one place that knows the URL structure:
 *   /{lang}/                         home + exam picker
 *   /{lang}/{exam}/                  exam hub
 *   /{lang}/{exam}/{tool}/           tool set up for an exam
 *   /{lang}/{tool}/                  generic tool
 *   /{lang}/{keyword}/               keyword landing page (generic tool preset)
 * Exam slugs, tool ids and keyword slugs share the second segment, so they must not collide
 * (checked in tests/routes.test.ts).
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://formsaathi.pages.dev").replace(/\/$/, "");

export * from "./routes-client";

export type Segment =
  | { type: "exam"; slug: string }
  | { type: "tool"; slug: string }
  | { type: "keyword"; slug: string };

export function resolveSegment(slug: string): Segment | null {
  if (getExam(slug)) return { type: "exam", slug };
  const tool = getTool(slug);
  if (tool?.generic) return { type: "tool", slug };
  if (getKeywordPage(slug)) return { type: "keyword", slug };
  return null;
}

export function secondSegmentSlugs(): string[] {
  return [
    ...getAllExams().map((e) => e.slug),
    ...enabledTools().filter((t) => t.generic).map((t) => t.id),
    ...KEYWORD_PAGES.map((k) => k.slug),
  ];
}

export function examToolParams(): { exam: string; tool: string }[] {
  return getAllExams().flatMap((e) => toolsForExam(e).map((t) => ({ exam: e.slug, tool: t.id })));
}

/** Every page path without the language prefix, e.g. "ssc-cgl/photo-resize/". */
export function allPagePaths(): string[] {
  return ["", ...secondSegmentSlugs().map((s) => `${s}/`), ...examToolParams().map((p) => `${p.exam}/${p.tool}/`)];
}

export function alternates(lang: Lang, pathWithoutLang: string) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}/${pathWithoutLang}`;
  languages["x-default"] = `${SITE_URL}/hi/${pathWithoutLang}`;
  return { canonical: `${SITE_URL}/${lang}/${pathWithoutLang}`, languages };
}
