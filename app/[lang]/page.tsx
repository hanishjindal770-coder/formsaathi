import type { Metadata } from "next";
import Link from "next/link";
import { getDict, isLang, type Lang } from "@/i18n";
import ExamPicker from "@/components/ExamPicker";
import ToolCards from "@/components/ToolCards";
import JsonLd from "@/components/seo/JsonLd";
import { getAllExams } from "@/lib/exams/load";
import { summarize } from "@/lib/exams/describe";
import { KEYWORD_PAGES, keywordVars } from "@/lib/keywords";
import { alternates, genericToolPath, SITE_URL } from "@/lib/routes";
import { enabledTools } from "@/lib/tools/registry";
import { fmt } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = (await params) as { lang: Lang };
  const t = getDict(lang);
  return { title: { absolute: `${t.site.name} — ${t.site.tagline}` }, alternates: alternates(lang, "") };
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: l } = await params;
  if (!isLang(l)) return null;
  const lang = l;
  const t = getDict(lang);
  return (
    <>
      <section className="py-6">
        <h1 className="text-2xl font-semibold leading-snug sm:text-3xl">{t.site.tagline}</h1>
        <p className="mt-2 text-muted">🔒 {t.site.privacy}</p>
      </section>
      <ExamPicker lang={lang} exams={getAllExams().map(summarize)} t={t.picker} />
      <section className="prose-section">
        <h2>{t.seo.toolsHeading}</h2>
        <ToolCards lang={lang} tools={enabledTools().map((x) => x.id)} hrefFor={(id) => genericToolPath(lang, id)} />
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
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: t.site.name, url: `${SITE_URL}/${lang}/`, inLanguage: lang }} />
    </>
  );
}
