"use client";
import { useCallback } from "react";
import type { Lang } from "@/i18n/config";
import type { docgenEn } from "@/i18n/parts/docgen";
import type { Measure } from "@/lib/docgen/layout";
import { buildLetter, defaultSigner, emptyLetter, LETTER_KINDS, letterTemplate, type Gender, type GuardianRelation, type LetterData, type LetterText, type LetterVars } from "@/lib/docgen/letter";
import { Area, Choice, DocLangChoice, DocOutput, Field, Section, todayISO, useAutosave } from "./docgen-shared";

type Props = { lang: Lang; t: typeof docgenEn };

export default function LetterMaker({ lang, t }: Props) {
  const l = t.letter;
  const c = t.common;
  const [d, setD, clear] = useAutosave<LetterData>("fs:docgen:letter", () => emptyLetter(lang), (v) => ({ ...v, date: v.date || todayISO() }));
  const build = useCallback((m: Measure) => buildLetter(d, m), [d]);

  // Detail fields (and kind/language) regenerate the text until the student edits it by hand.
  const set = (patch: Partial<LetterData>) =>
    setD((x) => {
      const next = { ...x, ...patch };
      return next.edited ? next : { ...next, ...letterTemplate(next.kind, next.docLang, next) };
    });
  const setText = (patch: Partial<LetterText>) => setD((x) => ({ ...x, ...patch, edited: true }));
  const reset = () => {
    if (window.confirm(l.resetConfirm)) setD((x) => ({ ...x, ...letterTemplate(x.kind, x.docLang, x), edited: false }));
  };
  const v = (k: keyof LetterVars, label: string, extra: { placeholder?: string; type?: string; inputMode?: "numeric" } = {}) => (
    <Field label={label} value={d[k] as string} onChange={(val) => set({ [k]: val } as Partial<LetterData>)} {...extra} />
  );

  const gender = (
    <Choice<Gender>
      label={c.gender}
      value={d.gender}
      onChange={(gender) => set({ gender })}
      options={[{ value: "m", label: c.male }, { value: "f", label: c.female }, { value: "", label: c.notSay }]}
    />
  );
  const k = d.kind;

  return (
    <div className="card space-y-4">
      <p className="rounded-xl bg-warn-bg p-3 text-sm text-warn" role="note">{l.notice}</p>
      <label className="block text-sm">
        {l.kind}
        <select className="field mt-1" value={k} onChange={(e) => set({ kind: e.target.value as LetterData["kind"] })}>
          {LETTER_KINDS.map((x) => (
            <option key={x} value={x}>{l.kinds[x]}</option>
          ))}
        </select>
      </label>
      <DocLangChoice value={d.docLang} onChange={(docLang) => set({ docLang })} t={c} />

      <Section title={l.details}>
        {k === "nocParent" && (
          <>
            {v("guardianName", l.guardianName)}
            <Choice<GuardianRelation>
              label={l.guardianRelation}
              value={d.guardianRelation}
              onChange={(guardianRelation) => set({ guardianRelation })}
              options={[{ value: "father", label: l.relFather }, { value: "mother", label: l.relMother }, { value: "guardian", label: l.relGuardian }]}
            />
          </>
        )}
        {k === "nocEmployer" && v("org", l.org)}
        {v("name", k === "nocEmployer" ? l.nameEmployee : l.name)}
        {gender}
        {(k === "application" || k === "selfDecl") && v("fatherName", l.fatherName)}
        {k === "selfDecl" && v("age", l.age, { inputMode: "numeric" })}
        {k === "nocEmployer" ? (
          <>
            {v("designation", l.designation)}
            {v("employeeId", `${l.employeeId} (${c.optional})`)}
            {v("since", `${l.since} (${c.optional})`, { type: "date" })}
          </>
        ) : (
          <Area label={l.address} rows={2} value={d.address} onChange={(address) => set({ address })} />
        )}
        {k === "selfDecl" ? (
          <Area label={l.statement} rows={3} value={d.purpose} placeholder={l.statementPh} onChange={(purpose) => set({ purpose })} />
        ) : (
          v("purpose", l.purpose, { placeholder: k === "application" ? l.purposePhApplication : l.purposePhNoc })
        )}
      </Section>

      <Section title={l.addressing}>
        <Area label={k === "application" ? l.to : `${l.to} (${c.optional})`} rows={3} value={d.to} placeholder={l.toPh} onChange={(to) => set({ to })} />
        <div className="grid grid-cols-2 gap-2">
          <Field label={l.place} value={d.place} onChange={(place) => set({ place })} />
          <Field label={l.date} type="date" value={d.date} onChange={(date) => set({ date })} />
        </div>
        <Field label={l.signName} value={d.signName} placeholder={defaultSigner(d) || l.signNamePh} onChange={(signName) => set({ signName })} />
        <Area label={l.signLines} rows={2} value={d.signLines} onChange={(signLines) => set({ signLines })} />
      </Section>

      <Section title={l.text}>
        {d.edited && (
          <div className="space-y-2 rounded-lg border border-line p-2 text-sm">
            <p className="text-muted">{l.edited}</p>
            <button type="button" className="btn-secondary w-full text-sm" onClick={reset}>↺ {l.reset}</button>
          </div>
        )}
        {k !== "application" && <Field label={l.title} value={d.title} onChange={(title) => setText({ title })} />}
        <Field label={l.subject} value={d.subject} onChange={(subject) => setText({ subject })} />
        <Field label={l.salutation} value={d.salutation} onChange={(salutation) => setText({ salutation })} />
        <Area label={l.body} rows={10} value={d.body} onChange={(body) => setText({ body })} />
        <Field label={l.closing} value={d.closing} onChange={(closing) => setText({ closing })} />
      </Section>

      <DocOutput build={build} photo="" fileName={l.fileName} t={c} onClear={clear} />
    </div>
  );
}
