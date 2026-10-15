"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/i18n/config";
import { fmt } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import type { ExamSummary } from "@/lib/exams/describe";
import { examPath } from "@/lib/routes-client";
import { getLastExam, setLastExam } from "@/lib/prefs";

type Props = { lang: Lang; exams: ExamSummary[]; t: Dict["picker"] };

const norm = (s: string) => s.toLowerCase().replace(/[\s\-_.()]/g, "");

export default function ExamPicker({ lang, exams, t }: Props) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [last, setLast] = useState<ExamSummary | null>(null);

  useEffect(() => {
    const slug = getLastExam();
    setLast(exams.find((e) => e.slug === slug) ?? null);
  }, [exams]);

  const categories = useMemo(() => [...new Set(exams.map((e) => e.category))], [exams]);
  const states = useMemo(() => [...new Set(exams.map((e) => e.state).filter(Boolean) as string[])].sort(), [exams]);

  const list = useMemo(() => {
    const nq = norm(q);
    return exams.filter(
      (e) =>
        (!cat || e.category === cat) &&
        (!state || e.state === state) &&
        (!nq || [e.name.en, e.name.hi, e.slug, e.body, e.state ?? ""].some((s) => norm(s).includes(nq))),
    );
  }, [exams, q, cat, state]);

  return (
    <section aria-labelledby="picker-h" className="card">
      <h2 id="picker-h" className="mb-3 text-xl font-semibold">{t.heading}</h2>
      {last && (
        <Link href={examPath(lang, last.slug)} className="btn-primary mb-3 w-full">
          {fmt(t.continueWith, { exam: last.name[lang] })} →
        </Link>
      )}
      <label className="sr-only" htmlFor="exam-search">{t.search}</label>
      <input
        id="exam-search"
        type="search"
        className="field"
        placeholder={t.search}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
      />
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Category">
        {["", ...categories].map((c) => (
          <button
            key={c || "all"}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={`min-h-10 shrink-0 rounded-full border px-4 text-sm ${cat === c ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"}`}
          >
            {c ? t.categories[c as keyof typeof t.categories] : t.allCategories}
          </button>
        ))}
      </div>
      {states.length > 0 && (cat === "" || cat === "state" || cat === "police") && (
        <select className="field mt-2" value={state} onChange={(e) => setState(e.target.value)} aria-label={t.allStates}>
          <option value="">{t.allStates}</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}
      <ul className="mt-3 divide-y divide-line">
        {list.map((e) => (
          <li key={e.slug}>
            <Link
              href={examPath(lang, e.slug)}
              onClick={() => setLastExam(e.slug)}
              className="flex min-h-12 items-center justify-between gap-2 py-2 text-ink no-underline"
            >
              <span>
                <span className="font-semibold">{e.name[lang]}</span>
                <span className="block text-xs text-muted">{lang === "hi" ? e.name.en : e.name.hi}{e.state ? ` · ${e.state}` : ""}</span>
              </span>
              <span aria-hidden className="text-muted">›</span>
            </Link>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="mt-3 text-muted">{t.noResults}</p>}
    </section>
  );
}
