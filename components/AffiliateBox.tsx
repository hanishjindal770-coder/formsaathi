import affiliates from "@/data/affiliates.json";
import type { Lang } from "@/i18n/config";

type Affiliate = { title: { en: string; hi: string }; url: string; note?: { en: string; hi: string } };
const data = affiliates as { exams: Record<string, Affiliate[]>; default: Affiliate[] };

/** Exam-specific book/course links from data/affiliates.json. Renders nothing while it is empty. */
export default function AffiliateBox({ exam, lang }: { exam?: string; lang: Lang }) {
  const items = (exam && data.exams[exam]) || data.default;
  if (!items?.length) return null;
  return (
    <aside className="card my-6">
      <ul className="space-y-2">
        {items.map((a) => (
          <li key={a.url}>
            <a href={a.url} rel="sponsored noopener" target="_blank" className="font-semibold">
              {a.title[lang]}
            </a>
            {a.note && <p className="text-sm text-muted">{a.note[lang]}</p>}
          </li>
        ))}
      </ul>
    </aside>
  );
}
