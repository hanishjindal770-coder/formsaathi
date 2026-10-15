import Link from "next/link";
import type { Lang } from "@/i18n";
import type { ExamSpec } from "@/lib/exams/schema";

export default function ExamLinks({ heading, exams, lang, hrefFor }: { heading: string; exams: ExamSpec[]; lang: Lang; hrefFor: (e: ExamSpec) => string }) {
  if (!exams.length) return null;
  return (
    <section className="prose-section">
      <h2>{heading}</h2>
      <ul className="flex flex-wrap gap-2">
        {exams.map((e) => (
          <li key={e.slug}>
            <Link href={hrefFor(e)} className="btn-secondary min-h-10 px-3 text-sm">{e.name[lang]}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
