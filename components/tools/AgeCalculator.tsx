"use client";
import { useEffect, useMemo, useState } from "react";
import { fmt, type Lang } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { ageOn, checkEligibility, SOCIAL_CATEGORIES, type SocialCategory } from "@/lib/exams/age";
import type { AgeSpec } from "@/lib/exams/schema";
import { formatDDMMYYYY, parseISODate, toISO, todayYMD } from "@/lib/date";
import { setLastExam } from "@/lib/prefs";

export type AgeExam = { slug: string; name: string; age: AgeSpec };

type Props = { lang: Lang; t: Dict["age"]; exams: AgeExam[]; initialExam?: string };

export default function AgeCalculator({ lang, t, exams, initialExam }: Props) {
  const [slug, setSlug] = useState(initialExam ?? "");
  const [dob, setDob] = useState("");
  const [category, setCategory] = useState<SocialCategory>("GEN");
  const [pwd, setPwd] = useState(false);
  const [exsm, setExsm] = useState(false);
  const [onDate, setOnDate] = useState(() => toISO(todayYMD()));
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  const exam = exams.find((e) => e.slug === slug);
  useEffect(() => { if (initialExam) setLastExam(initialExam); }, [initialExam]);

  const result = useMemo(() => {
    const d = parseISODate(dob);
    if (!d) return null;
    if (exam) {
      const cutoff = parseISODate(exam.age.cutoffDate)!;
      return { ...checkEligibility(exam.age, cutoff, { dob: d, category, pwd, exServiceman: exsm }) };
    }
    const on = parseISODate(onDate);
    if (!on) return null;
    const min = Number(minAge), max = Number(maxAge);
    if (minAge && maxAge && min < max) {
      const spec: AgeSpec = { min, max, cutoffDate: onDate, relaxation: { OBC: 0, SC: 0, ST: 0, EWS: 0, PwD: 0, ExSM: 0 } };
      // Generic check: no relaxation, because it differs for every exam.
      return { ...checkEligibility(spec, on, { dob: d, category: "GEN" }) };
    }
    return { cutoff: on, age: ageOn(d, on), eligible: null as boolean | null };
  }, [dob, exam, category, pwd, exsm, onDate, minAge, maxAge]);

  const showCategory = !!exam;

  return (
    <div className="card space-y-4">
      <label className="block">
        <span className="text-sm">{t.exam}</span>
        <select className="field mt-1" value={slug} onChange={(e) => setSlug(e.target.value)}>
          <option value="">{t.noExam}</option>
          {exams.map((e) => (
            <option key={e.slug} value={e.slug}>{e.name}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm">{t.dob}</span>
        <input type="date" className="field mt-1" value={dob} max={toISO(todayYMD())} min="1940-01-01" onChange={(e) => setDob(e.target.value)} />
      </label>

      {!exam && (
        <div className="grid grid-cols-3 gap-3 text-sm">
          <label className="col-span-3">
            {t.cutoff}
            <input type="date" className="field mt-1" value={onDate} onChange={(e) => setOnDate(e.target.value)} />
          </label>
          <label>{t.minAge}<input className="field mt-1" inputMode="numeric" value={minAge} onChange={(e) => setMinAge(e.target.value)} placeholder="18" /></label>
          <label>{t.maxAge}<input className="field mt-1" inputMode="numeric" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} placeholder="32" /></label>
        </div>
      )}

      {showCategory && (
        <fieldset className="space-y-2">
          <legend className="text-sm">{t.category}</legend>
          <div className="flex flex-wrap gap-2">
            {SOCIAL_CATEGORIES.map((c) => (
              <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={`min-h-11 rounded-full border px-4 text-sm ${category === c ? "border-brand bg-brand text-brand-ink" : "border-line"}`}>
                {t.categories[c]}
              </button>
            ))}
          </div>
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" className="h-5 w-5" checked={pwd} onChange={(e) => setPwd(e.target.checked)} />{t.pwd}</label>
          <label className="flex min-h-11 items-center gap-3"><input type="checkbox" className="h-5 w-5" checked={exsm} onChange={(e) => setExsm(e.target.checked)} />{t.exsm}</label>
        </fieldset>
      )}

      {result && (
        <div className="space-y-2 rounded-xl border-2 border-line p-3" aria-live="polite">
          {result.age ? (
            <>
              <p className="text-sm text-muted">{fmt(t.yourAge, { date: formatDDMMYYYY(result.cutoff) })}</p>
              <p className="text-2xl font-semibold">{fmt(t.ymd, { y: result.age.years, m: result.age.months, d: result.age.days })}</p>
            </>
          ) : (
            <p className="text-bad">{t.futureDob}</p>
          )}
          {"reason" in result && result.age && (
            <>
              <p className={`text-xl font-semibold ${result.eligible ? "text-ok" : "text-bad"}`}>{result.eligible ? t.eligible : t.notEligible}</p>
              {result.reason === "too-young" && <p>{fmt(t.tooYoung, { min: exam?.age.min ?? minAge })}</p>}
              {result.reason === "too-old" && <p>{fmt(t.tooOld, { max: result.upperLimit, relax: result.relaxationYears })}</p>}
              {result.relaxationYears > 0 && <p className="text-sm">{fmt(t.relaxation, { years: result.relaxationYears })}</p>}
              <p className="text-sm text-muted">{fmt(t.window, { from: formatDDMMYYYY(result.earliestDob), to: formatDDMMYYYY(result.latestDob) })}</p>
              {exam?.age.upperLimitRule === "notAttained" && <p className="text-sm text-muted">{fmt(t.upperRuleNotAttained, { max: result.upperLimit })}</p>}
              {exsm && <p className="text-sm text-warn">{t.exsmNote}</p>}
              {exam?.age.notes && <p className="text-sm text-muted">{exam.age.notes[lang]}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
