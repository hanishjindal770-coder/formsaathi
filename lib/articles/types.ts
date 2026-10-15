import type { ToolId } from "@/lib/tools/registry";

/** A long-form guide at /{lang}/blog/{slug}/. Text is plain; tools are linked as cards. */
export type ArticleSection = { h: string; p: string[]; list?: string[]; ordered?: boolean };
export type ArticleBody = {
  /** <title> and H1, written for the search phrase. */
  title: string;
  /** Meta description, 120–160 characters. */
  description: string;
  intro: string;
  sections: ArticleSection[];
  faq: { q: string; a: string }[];
};
export type Article = {
  slug: string;
  /** Tools the article links to, first one is the main call to action. */
  tools: ToolId[];
  /** ISO date. */
  published: string;
  en: ArticleBody;
  hi: ArticleBody;
};
