import Link from "next/link";
import { getDict, type Lang } from "@/i18n";
import { blogPath, type Article } from "@/lib/articles";

/** A short list of guide links, used under tools and articles. */
export default function ArticleLinks({ lang, heading, articles }: { lang: Lang; heading: string; articles: Article[] }) {
  if (!articles.length) return null;
  const d = getDict(lang);
  return (
    <section className="prose-section">
      <h2>{heading}</h2>
      <ul className="space-y-2">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={blogPath(lang, a.slug)} className="card block text-ink no-underline hover:border-brand">
              <span className="block font-semibold text-brand">{a[lang].title}</span>
              <span className="block text-sm text-muted">{a[lang].description}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm"><Link href={blogPath(lang)}>{d.blog.allGuides} →</Link></p>
    </section>
  );
}
