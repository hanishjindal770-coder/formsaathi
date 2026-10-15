import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { allPagePaths, SITE_URL } from "@/lib/routes";
import { getAllExams } from "@/lib/exams/load";
import { getArticle } from "@/lib/articles";

export const dynamic = "force-static";

/** Every page in every language, with hreflang alternates. Generated from lib/routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  const exams = Object.fromEntries(getAllExams().map((e) => [e.slug, e]));
  return allPagePaths().flatMap((path) => {
    const exam = exams[path.split("/")[0]];
    const article = path.startsWith("blog/") ? getArticle(path.split("/")[1]) : undefined;
    const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/${path}`]));
    return LOCALES.map((lang) => ({
      url: `${SITE_URL}/${lang}/${path}`,
      lastModified: article?.published ?? (exam?.verified ? exam.lastVerified : undefined),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path.split("/").length > 2 ? 0.8 : 0.7,
      alternates: { languages },
    }));
  });
}
