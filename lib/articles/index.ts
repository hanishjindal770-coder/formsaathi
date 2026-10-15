import type { Lang } from "@/i18n/config";
import type { ToolId } from "@/lib/tools/registry";
import { articlesA } from "./content-a";
import { articlesB } from "./content-b";
import type { Article } from "./types";

export type { Article } from "./types";

/** Newest first. */
export const ARTICLES: Article[] = [...articlesA, ...articlesB].sort((a, b) => b.published.localeCompare(a.published));

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
export const blogPath = (lang: Lang, slug?: string) => `/${lang}/blog/${slug ? `${slug}/` : ""}`;

/** Articles that use a tool, main-tool matches first. */
export function articlesForTool(tool: ToolId, limit = 4): Article[] {
  return ARTICLES.filter((a) => a.tools.includes(tool))
    .sort((a, b) => a.tools.indexOf(tool) - b.tools.indexOf(tool))
    .slice(0, limit);
}

/** Articles sharing the most tools with this one. */
export function relatedArticles(article: Article, limit = 4): Article[] {
  return ARTICLES.filter((a) => a.slug !== article.slug)
    .map((a) => ({ a, n: a.tools.filter((t) => article.tools.includes(t)).length }))
    .filter((x) => x.n > 0)
    .sort((x, y) => y.n - x.n)
    .slice(0, limit)
    .map((x) => x.a);
}

/** Reading time at ~200 words a minute. */
export function minutesToRead(article: Article, lang: Lang): number {
  const b = article[lang];
  const text = [b.intro, ...b.sections.flatMap((s) => [s.h, ...s.p, ...(s.list ?? [])]), ...b.faq.flatMap((f) => [f.q, f.a])].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
}
