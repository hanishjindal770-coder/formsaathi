import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fmt, getDict, LOCALES, type Lang } from "@/i18n";
import { alternates, genericToolPath, homePath, SITE_URL } from "@/lib/routes";
import { ARTICLES, blogPath, getArticle, minutesToRead, relatedArticles } from "@/lib/articles";
import ToolCards from "@/components/ToolCards";
import ShareButtons from "@/components/ShareButtons";
import AdSlot from "@/components/AdSlot";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import Faq from "@/components/seo/Faq";
import JsonLd from "@/components/seo/JsonLd";
import ArticleLinks from "@/components/seo/ArticleLinks";
import Link from "next/link";

type Params = { lang: Lang; slug: string };

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.flatMap((lang) => ARTICLES.map((a) => ({ lang, slug: a.slug })));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const b = a[lang];
  return {
    title: b.title,
    description: b.description,
    alternates: alternates(lang, `blog/${slug}/`),
    openGraph: { type: "article", title: b.title, description: b.description, url: `${SITE_URL}/${lang}/blog/${slug}/`, publishedTime: a.published },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const d = getDict(lang);
  const b = a[lang];
  const url = `${SITE_URL}/${lang}/blog/${slug}/`;
  const main = a.tools[0];
  const date = new Date(a.published).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" });
  return (
    <article>
      <Breadcrumbs items={[{ name: d.site.home, href: homePath(lang) }, { name: d.blog.link, href: blogPath(lang) }, { name: b.title, href: blogPath(lang, slug) }]} />
      <h1 className="mt-2 text-2xl font-semibold leading-snug">{b.title}</h1>
      <p className="mt-1 text-sm text-muted">
        {d.blog.published} <time dateTime={a.published}>{date}</time> · {fmt(d.blog.minRead, { n: minutesToRead(a, lang) })}
      </p>
      <p className="mt-3">{b.intro}</p>
      <Link href={genericToolPath(lang, main)} className="btn-primary mt-4 w-full">
        {d.blog.tryTool}: {d.tools[main].name} →
      </Link>
      {b.sections.map((s) => {
        const List = s.ordered ? "ol" : "ul";
        return (
          <section key={s.h} className="prose-section">
            <h2>{s.h}</h2>
            {s.p.map((para) => <p key={para} className="mb-2">{para}</p>)}
            {s.list && (
              <List className={`${s.ordered ? "list-decimal" : "list-disc"} space-y-1 pl-5`}>
                {s.list.map((li) => <li key={li}>{li}</li>)}
              </List>
            )}
          </section>
        );
      })}
      <AdSlot position="inline" />
      <section className="prose-section">
        <h2>{d.blog.toolsHeading}</h2>
        <ToolCards lang={lang} tools={a.tools} hrefFor={(id) => genericToolPath(lang, id)} />
      </section>
      <Faq heading={d.seo.faqHeading} items={b.faq} />
      <ShareButtons lang={lang} url={url} title={b.title} />
      <ArticleLinks lang={lang} heading={d.blog.related} articles={relatedArticles(a)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: b.title,
          description: b.description,
          inLanguage: lang,
          datePublished: a.published,
          dateModified: a.published,
          mainEntityOfPage: url,
          author: { "@type": "Organization", name: d.site.name },
          publisher: { "@type": "Organization", name: d.site.name },
        }}
      />
      <AdSlot position="bottom" />
    </article>
  );
}
