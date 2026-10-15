"use client";
import { useMemo, useState } from "react";
import type { Lang } from "@/i18n/config";
import type { myFormsEn } from "@/i18n/parts/myForms";
import { formatDDMMYYYY, toISO, todayYMD } from "@/lib/date";
import { emptyEntry, upcomingEvents } from "@/lib/forms/store";
import { useForms } from "@/lib/forms/useForms";
import FormChecklist from "./FormChecklist";

/** Countdown to every upcoming date in My Forms, plus the syllabus checklist for one exam. */
export default function Countdown({ t, trackerHref }: { lang: Lang; t: typeof myFormsEn; trackerHref: string }) {
  const { forms, ready, saveFailed, update } = useForms();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [sel, setSel] = useState("");
  const events = useMemo(() => upcomingEvents(forms, todayYMD()), [forms]);
  const current = forms.find((f) => f.id === sel) ?? forms.find((f) => f.id === events.find((e) => e.field === "examDate")?.formId) ?? forms[0];

  if (!ready) return <div className="card min-h-40" aria-busy="true" />;

  const hero = events.find((e) => e.field === "examDate") ?? events[0];

  return (
    <div className="space-y-4">
      {saveFailed && <p className="rounded-xl bg-warn-bg p-3 text-sm">{t.saveFailed}</p>}
      {hero ? (
        <div className="card text-center">
          <p className="text-sm text-muted">{hero.examName} · {t.dates[hero.field]}</p>
          <p className="text-5xl font-semibold tabular-nums">{hero.daysLeft === 0 ? t.isToday : hero.daysLeft}</p>
          {hero.daysLeft > 0 && <p className="text-muted">{hero.daysLeft === 1 ? t.dayLeft : t.daysLeft}</p>}
          <p className="mt-1 text-sm">{formatDDMMYYYY(hero.date)}</p>
        </div>
      ) : (
        <p className="card text-muted">{t.countdownEmpty}</p>
      )}

      {events.length > 1 && (
        <ul className="divide-y divide-line rounded-xl border border-line">
          {events.filter((e) => e !== hero).map((e) => (
            <li key={`${e.formId}-${e.field}`} className="flex items-center justify-between gap-3 p-3 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-medium">{e.examName}</span>
                <span className="text-muted">{t.dates[e.field]} · {formatDDMMYYYY(e.date)}</span>
              </span>
              <span className={`shrink-0 tabular-nums ${e.daysLeft <= 3 ? "font-semibold text-bad" : ""}`}>{e.daysLeft === 0 ? t.isToday : `${e.daysLeft} ${e.daysLeft === 1 ? t.dayLeft : t.daysLeft}`}</span>
            </li>
          ))}
        </ul>
      )}

      <form
        className="card space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !date) return;
          update([...forms, { ...emptyEntry(name.trim()), examDate: date }]);
          setName("");
          setDate("");
        }}
      >
        <h2 className="font-semibold">{t.quickAdd}</h2>
        <input className="field" required value={name} placeholder={t.examPlaceholder} onChange={(e) => setName(e.target.value)} aria-label={t.exam} />
        <input type="date" className="field" required min={toISO(todayYMD())} value={date} onChange={(e) => setDate(e.target.value)} aria-label={t.dates.examDate} />
        <button type="submit" className="btn-primary w-full">{t.quickAddBtn}</button>
      </form>

      {current && (
        <section className="card space-y-3">
          <h2 className="font-semibold">{t.checklist}</h2>
          {forms.length > 1 && (
            <label className="block text-sm">
              {t.chooseForm}
              <select className="field mt-1" value={current.id} onChange={(e) => setSel(e.target.value)}>
                {forms.map((f) => <option key={f.id} value={f.id}>{f.examName}</option>)}
              </select>
            </label>
          )}
          <FormChecklist items={current.checklist} t={t} onChange={(checklist) => update(forms.map((x) => (x.id === current.id ? { ...x, checklist, updatedAt: Date.now() } : x)))} />
        </section>
      )}
      <a href={trackerHref} className="btn-secondary w-full">{t.openTracker}</a>
    </div>
  );
}
