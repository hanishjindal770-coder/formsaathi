"use client";
import { useCallback } from "react";
import type { Lang } from "@/i18n/config";
import type { docgenEn } from "@/i18n/parts/docgen";
import type { Measure } from "@/lib/docgen/layout";
import { buildBiodata, emptyBiodata, emptySibling, type BiodataData } from "@/lib/docgen/biodata";
import { Area, DocLangChoice, DocOutput, Field, PhotoField, Rows, Section, useAutosave } from "./docgen-shared";

type Props = { lang: Lang; t: typeof docgenEn };

export default function BiodataMaker({ lang, t }: Props) {
  const b = t.biodata;
  const c = t.common;
  const [d, setD, clear] = useAutosave<BiodataData>("fs:docgen:biodata", () => emptyBiodata(lang));
  const set = (patch: Partial<BiodataData>) => setD((x) => ({ ...x, ...patch }));
  const build = useCallback((m: Measure) => buildBiodata(d, m), [d]);

  return (
    <div className="card space-y-4">
      <DocLangChoice value={d.docLang} onChange={(docLang) => set({ docLang })} t={c} />
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" className="h-5 w-5" checked={d.showHeading} onChange={(e) => set({ showHeading: e.target.checked })} />
        {b.showHeading}
      </label>
      {d.showHeading && <Field label={b.heading} value={d.heading} onChange={(heading) => set({ heading })} />}
      <p className="text-sm text-muted">{b.blankHidden}</p>

      <Section title={b.personal}>
        <PhotoField value={d.photo} onChange={(photo) => set({ photo })} t={c} />
        <Field label={b.name} value={d.name} onChange={(name) => set({ name })} />
        <Field label={b.dob} type="date" value={d.dob} onChange={(dob) => set({ dob })} />
        <div className="grid grid-cols-2 gap-2">
          <Field label={b.birthTime} type="time" value={d.birthTime} onChange={(birthTime) => set({ birthTime })} />
          <Field label={b.height} value={d.height} placeholder={b.heightPh} onChange={(height) => set({ height })} />
        </div>
        <Field label={b.birthPlace} value={d.birthPlace} onChange={(birthPlace) => set({ birthPlace })} />
        <div className="grid grid-cols-2 gap-2">
          <Field label={b.religion} value={d.religion} onChange={(religion) => set({ religion })} />
          <Field label={b.caste} value={d.caste} onChange={(caste) => set({ caste })} />
        </div>
        <Field label={b.gotra} value={d.gotra} onChange={(gotra) => set({ gotra })} />
        <Field label={b.education} value={d.education} onChange={(education) => set({ education })} />
        <Field label={b.occupation} value={d.occupation} onChange={(occupation) => set({ occupation })} />
        <Field label={`${b.income} (${c.optional})`} value={d.income} placeholder={b.incomePh} onChange={(income) => set({ income })} />
      </Section>

      <Section title={b.family}>
        <Field label={b.father} value={d.father} onChange={(father) => set({ father })} />
        <Field label={b.fatherOcc} value={d.fatherOcc} onChange={(fatherOcc) => set({ fatherOcc })} />
        <Field label={b.mother} value={d.mother} onChange={(mother) => set({ mother })} />
        <Field label={b.motherOcc} value={d.motherOcc} onChange={(motherOcc) => set({ motherOcc })} />
        <p className="pt-2 text-sm font-semibold">{b.siblings}</p>
        <Rows
          rows={d.siblings}
          onChange={(siblings) => set({ siblings })}
          fresh={emptySibling}
          addLabel={b.addSibling}
          t={c}
          render={(row, upd) => (
            <>
              <Field label={b.relation} value={row.relation} placeholder={b.relationPh} onChange={(relation) => upd({ relation })} />
              <Field label={b.sibName} value={row.name} onChange={(name) => upd({ name })} />
              <Field label={b.sibDetails} value={row.details} placeholder={b.sibDetailsPh} onChange={(details) => upd({ details })} />
            </>
          )}
        />
      </Section>

      <Section title={b.contact}>
        <Field label={b.phone} type="tel" inputMode="tel" value={d.phone} onChange={(phone) => set({ phone })} />
        <Area label={b.address} rows={2} value={d.address} onChange={(address) => set({ address })} />
        <Area label={b.other} rows={3} value={d.other} onChange={(other) => set({ other })} />
      </Section>

      <DocOutput build={build} photo={d.photo} fileName={b.fileName} t={c} onClear={clear} />
    </div>
  );
}
