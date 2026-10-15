import type { Metadata } from "next";
import Link from "next/link";
import { getDict, LOCALES, type Lang } from "@/i18n";
import { alternates, homePath, SITE_URL } from "@/lib/routes";
import { ARTICLES, blogPath } from "@/lib/articles";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

type Params = { lang: Lang };

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params;
  const b = getDict(lang).blog;
  return { title: b.title, description: b.description, alternates: alternates(lang, "blog/"), openGraph: { title: b.title, description: b.description, url: `${SITE_URL}/${lang}/blog/` } };
}

export default async function BlogIndex({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  const d = getDict(lang);
  return (
    <>
      <Breadcrumbs items={[{ name: d.site.home, href: homePath(lang) }, { name: d.blog.link, href: blogPath(lang) }]} />
      <h1 className="mt-2 text-2xl font-semibold">{d.blog.title}</h1>
      <p className="mb-4 text-muted">{d.blog.description}</p>
      <ul className="space-y-3">
        {ARTICLES.map((a) => (
          <li key={a.slug}>
            <Link href={blogPath(lang, a.slug)} className="card block text-ink no-underline hover:border-brand">
              <h2 className="text-lg font-semibold text-brand">{a[lang].title}</h2>
              <p className="text-sm text-muted">{a[lang].description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
