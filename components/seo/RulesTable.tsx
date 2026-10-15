import { getDict, fmt, type Lang } from "@/i18n";
import { backgroundLabel, cmLabel, formatLabel, kbRangeLabel, pxLabel } from "@/lib/exams/describe";
import type { AgeSpec, DocKind, DocSpec } from "@/lib/exams/schema";

function Table({ caption, rows, lang }: { caption: string; rows: [string, string | undefined][]; lang: Lang }) {
  const t = getDict(lang).seo;
  return (
    <section className="prose-section">
      <h2>{caption}</h2>
      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full border-collapse bg-surface text-left text-sm">
          <thead className="bg-bg">
            <tr>
              <th scope="col" className="p-3 font-semibold">{t.field}</th>
              <th scope="col" className="p-3 font-semibold">{t.value}</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .filter((r): r is [string, string] => !!r[1])
              .map(([k, v]) => (
                <tr key={k} className="border-t border-line">
                  <th scope="row" className="w-2/5 p-3 align-top font-normal text-muted">{k}</th>
                  <td className="p-3">{v}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function DocRulesTable({ spec, kind, examName, lang, nameDate }: { spec: DocSpec; kind: DocKind; examName: string; lang: Lang; nameDate?: boolean }) {
  const d = getDict(lang);
  const t = d.seo;
  return (
    <Table
      lang={lang}
      caption={fmt(t.rulesHeading, { exam: examName, doc: d.doc[kind] })}
      rows={[
        [t.formatRow, formatLabel(spec)],
        [t.sizeRow, kbRangeLabel(spec.minKB, spec.maxKB, lang)],
        [t.dimsRow, pxLabel(spec)],
        [t.cmRow, cmLabel(spec)],
        [t.bgRow, spec.background && backgroundLabel(spec.background, lang)],
        [t.nameDateRow, nameDate ? t.required : undefined],
        [t.notesRow, spec.notes?.[lang]],
      ]}
    />
  );
}

export function AgeRulesTable({ age, examName, lang }: { age: AgeSpec; examName: string; lang: Lang }) {
  const t = getDict(lang).seo;
  const r = age.relaxation;
  const relax = (Object.keys(r) as (keyof typeof r)[])
    .filter((k) => r[k] > 0)
    .map((k) => `${k} +${r[k]}`)
    .join(", ");
  return (
    <Table
      lang={lang}
      caption={fmt(t.ageRulesHeading, { exam: examName })}
      rows={[
        [t.ageRange, `${age.min}–${age.max}`],
        [t.cutoffRow, age.cutoffDate.split("-").reverse().join("/")],
        [t.relaxRow, relax],
        [t.notesRow, age.notes?.[lang]],
      ]}
    />
  );
}
