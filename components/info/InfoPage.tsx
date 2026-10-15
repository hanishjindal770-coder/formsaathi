import type { Metadata } from "next";
import { getDict, type Lang } from "@/i18n";
import { alternates, homePath } from "@/lib/routes";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export type InfoKind = "privacy" | "about" | "contact";

export function infoMetadata(lang: Lang, kind: InfoKind): Metadata {
  const p = getDict(lang).info[kind];
  return { title: p.title, description: p.description, alternates: alternates(lang, `${kind}/`) };
}

/** Shared layout for the privacy, about and contact pages. Plain text, so it stays tiny and fast. */
export default function InfoPage({ lang, kind }: { lang: Lang; kind: InfoKind }) {
  const d = getDict(lang);
  const p = d.info[kind];
  return (
    <article>
      <Breadcrumbs items={[{ name: d.site.home, href: homePath(lang) }, { name: p.title, href: `/${lang}/${kind}/` }]} />
      <h1 className="mt-2 text-2xl font-semibold">{p.title}</h1>
      <p className="mt-1 text-muted">{p.description}</p>
      {kind === "privacy" && <p className="mt-1 text-sm text-muted">{d.info.updated}</p>}
      {p.sections.map((s) => (
        <section key={s.h} className="prose-section">
          <h2>{s.h}</h2>
          {s.p.map((para) => <p key={para} className="mb-2 break-words">{para}</p>)}
        </section>
      ))}
      {kind === "contact" && (
        <a href={d.info.repoIssues} className="btn-primary mt-4 w-full" rel="noopener" target="_blank">{d.info.openIssue} ↗</a>
      )}
    </article>
  );
}
