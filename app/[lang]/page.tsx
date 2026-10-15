import type { Metadata } from "next";
import Link from "next/link";
import { getDict, isLang, type Lang } from "@/i18n";
import ExamPicker from "@/components/ExamPicker";
import ToolGrid from "@/components/ToolGrid";
import ToolSlot from "@/components/ToolSlot";
import JsonLd from "@/components/seo/JsonLd";
import { getAllExams } from "@/lib/exams/load";
import { summarize } from "@/lib/exams/describe";
import { KEYWORD_PAGES, keywordVars } from "@/lib/keywords";
import { ARTICLES } from "@/lib/articles";
import ArticleLinks from "@/components/seo/ArticleLinks";
import { alternates, genericToolPath, SITE_URL } from "@/lib/routes";
import { fmt } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = (await params) as { lang: Lang };
  const t = getDict(lang);
  return { title: { absolute: `${t.nav.heroTitle} — ${t.site.name}` }, description: t.nav.heroSub, alternates: alternates(lang, "") };
}

/** Tool-first home page: the image editor is the first thing on screen, exams come after the tools. */
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  if (!isLang(l)) return null;
  const lang = l;
  const t = getDict(lang);
  return (
    <>
      <section className="pt-6 pb-4 text-center">
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{t.nav.heroTitle}</h1>
        <p className="mx-auto mt-2 max-w-xl text-muted">{t.nav.heroSub}</p>
      </section>
      <ToolSlot tool="resize-image" lang={lang} />
      <ToolGrid lang={lang} />
      <section className="prose-section" id="exams">
        <h2>🎓 {t.nav.examPresets}</h2>
        <p className="mb-3 text-muted">{t.nav.examPresetsDesc}</p>
        <ExamPicker lang={lang} exams={getAllExams().map(summarize)} t={t.picker} />
      </section>
      <section className="prose-section">
        <h2>{t.keyword.otherSizes}</h2>
        <ul className="flex flex-wrap gap-2">
          {KEYWORD_PAGES.map((k) => (
            <li key={k.slug}>
              <Link href={genericToolPath(lang, k.slug)} className="btn-secondary min-h-10 px-3 text-sm">
                {fmt(t.keyword[k.kind].title, keywordVars(k))}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <ArticleLinks lang={lang} heading={t.blog.latest} articles={ARTICLES.slice(0, 6)} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: t.site.name, url: `${SITE_URL}/${lang}/`, inLanguage: lang, applicationCategory: "MultimediaApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" } }} />
    </>
  );
}
