"use client";
import { useCallback } from "react";
import type { Lang } from "@/i18n/config";
import type { docgenEn } from "@/i18n/parts/docgen";
import type { Measure } from "@/lib/docgen/layout";
import { DOC_LABELS } from "@/lib/docgen/labels";
import { buildResume, emptyEdu, emptyExp, emptyResume, type ResumeData } from "@/lib/docgen/resume";
import { Area, Choice, DocLangChoice, DocOutput, Field, PhotoField, Rows, Section, todayISO, useAutosave } from "./docgen-shared";

type Props = { lang: Lang; t: typeof docgenEn };

export default function ResumeMaker({ lang, t }: Props) {
  const r = t.resume;
  const c = t.common;
  const [d, setD, clear] = useAutosave<ResumeData>("fs:docgen:resume", () => emptyResume(lang), (v) => ({ ...v, date: v.date || todayISO() }));
  const set = (patch: Partial<ResumeData>) => setD((x) => ({ ...x, ...patch }));
  const build = useCallback((m: Measure) => buildResume(d, m), [d]);

  return (
    <div className="card space-y-4">
      <DocLangChoice value={d.docLang} onChange={(docLang) => set({ docLang })} t={c} />
      <Choice label={r.template} value={d.template} onChange={(template) => set({ template })} options={[{ value: "classic", label: r.classic }, { value: "modern", label: r.modern }]} />

      <Section title={r.basics}>
        <Field label={r.name} value={d.name} onChange={(name) => set({ name })} />
        <Field label={r.phone} type="tel" inputMode="tel" value={d.phone} onChange={(phone) => set({ phone })} />
        <Field label={r.email} type="email" inputMode="email" value={d.email} onChange={(email) => set({ email })} />
        <Area label={r.address} rows={2} value={d.address} onChange={(address) => set({ address })} />
        <div className="text-sm">
          {c.photo} <span className="text-muted">({c.optional})</span>
          <div className="mt-1"><PhotoField value={d.photo} onChange={(photo) => set({ photo })} t={c} /></div>
        </div>
        <Area label={r.objective} rows={3} value={d.objective} placeholder={r.objectivePh} onChange={(objective) => set({ objective })} />
      </Section>

      <Section title={r.education}>
        <Rows
          rows={d.education}
          onChange={(education) => set({ education })}
          fresh={emptyEdu}
          addLabel={r.addEducation}
          t={c}
          render={(row, upd) => (
            <>
              <Field label={r.exam} value={row.exam} placeholder={r.examPh} onChange={(exam) => upd({ exam })} />
              <Field label={r.board} value={row.board} onChange={(board) => upd({ board })} />
              <div className="grid grid-cols-2 gap-2">
                <Field label={r.year} inputMode="numeric" value={row.year} onChange={(year) => upd({ year })} />
                <Field label={r.score} inputMode="decimal" value={row.score} onChange={(score) => upd({ score })} />
              </div>
            </>
          )}
        />
      </Section>

      <Section title={r.experience} open={d.experience.length > 0}>
        {!d.experience.length && <p className="text-sm text-muted">{r.noExperience}</p>}
        <Rows
          rows={d.experience}
          onChange={(experience) => set({ experience })}
          fresh={emptyExp}
          addLabel={r.addExperience}
          t={c}
          render={(row, upd) => (
            <>
              <Field label={r.role} value={row.role} onChange={(role) => upd({ role })} />
              <Field label={r.org} value={row.org} onChange={(org) => upd({ org })} />
              <Field label={r.period} value={row.period} placeholder={r.periodPh} onChange={(period) => upd({ period })} />
              <Area label={r.details} rows={2} value={row.details} onChange={(details) => upd({ details })} />
            </>
          )}
        />
      </Section>

      <Section title={r.skills}>
        <Area label={r.skillsLabel} rows={4} value={d.skills} placeholder={r.skillsPh} onChange={(skills) => set({ skills })} />
        <Field label={r.languages} value={d.languages} placeholder={r.languagesPh} onChange={(languages) => set({ languages })} />
      </Section>

      <Section title={r.personal}>
        <Field label={r.dob} type="date" value={d.dob} onChange={(dob) => set({ dob })} />
        <Field label={r.father} value={d.father} onChange={(father) => set({ father })} />
        <Field label={r.genderText} value={d.gender} onChange={(gender) => set({ gender })} />
        <Field label={r.nationality} value={d.nationality} onChange={(nationality) => set({ nationality })} />
        <Area label={r.permAddress} rows={2} value={d.permAddress} onChange={(permAddress) => set({ permAddress })} />
      </Section>

      <Section title={r.declaration}>
        <Area label={r.declarationLabel} rows={2} value={d.declaration} placeholder={DOC_LABELS[d.docLang].resume.declarationText} hint={r.declarationHint} onChange={(declaration) => set({ declaration })} />
        <div className="grid grid-cols-2 gap-2">
          <Field label={r.place} value={d.place} onChange={(place) => set({ place })} />
          <Field label={r.date} type="date" value={d.date} onChange={(date) => set({ date })} />
        </div>
      </Section>

      <DocOutput build={build} photo={d.photo} fileName={r.fileName} t={c} onClear={clear} />
    </div>
  );
}
