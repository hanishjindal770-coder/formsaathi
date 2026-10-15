"use client";
import { useMemo, useRef, useState } from "react";
import { fmt, type Lang } from "@/i18n/config";
import type { myFormsEn } from "@/i18n/parts/myForms";
import { formatDDMMYYYY, parseISODate, todayYMD } from "@/lib/date";
import { DATE_FIELDS, emptyEntry, exportForms, FORM_STATUSES, mergeForms, sanitize, sortForms, upcomingEvents, type FormEntry, type FormStatus } from "@/lib/forms/store";
import { useForms } from "@/lib/forms/useForms";
import FormChecklist from "./FormChecklist";

type Props = { lang: Lang; t: typeof myFormsEn; exams: { slug: string; name: string }[] };

export function whenLabel(t: typeof myFormsEn, n: number) {
  return n === 0 ? t.today : n === 1 ? t.tomorrow : fmt(t.inDays, { n });
}

export default function MyForms({ t, exams }: Props) {
  const { forms, ready, saveFailed, update } = useForms();
  const [editing, setEditing] = useState<FormEntry | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const today = todayYMD();
  const sorted = useMemo(() => sortForms(forms, today), [forms]); // eslint-disable-line react-hooks/exhaustive-deps
  const nextOf = useMemo(() => {
    const m = new Map<string, ReturnType<typeof upcomingEvents>[number]>();
    for (const e of upcomingEvents(forms, today)) if (!m.has(e.formId)) m.set(e.formId, e);
    return m;
  }, [forms]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = (f: FormEntry) => {
    const entry = { ...f, examName: f.examName.trim(), updatedAt: Date.now() };
    if (!entry.examName) return;
    update(forms.some((x) => x.id === f.id) ? forms.map((x) => (x.id === f.id ? entry : x)) : [...forms, entry]);
    setEditing(null);
  };

  const doExport = () => {
    const blob = new Blob([exportForms(forms)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `formsaathi-my-forms-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const doImport = async (file: File) => {
    try {
      const imported = sanitize(JSON.parse(await file.text()));
      if (!imported.length) throw new Error("empty");
      update(mergeForms(forms, imported));
      setMsg(fmt(t.imported, { n: imported.length }));
    } catch {
      setMsg(t.importFailed);
    }
  };

  if (!ready) return <div className="card min-h-40" aria-busy="true" />;

  if (editing) return <FormEditor entry={editing} t={t} exams={exams} onSave={save} onCancel={() => setEditing(null)} />;

  return (
    <div className="space-y-4">
      <button type="button" className="btn-primary w-full" onClick={() => setEditing(emptyEntry())}>＋ {t.add}</button>
      {saveFailed && <p className="rounded-xl bg-warn-bg p-3 text-sm">{t.saveFailed}</p>}
      {sorted.length === 0 && <p className="card text-muted">{t.empty}</p>}
      <ul className="space-y-3">
        {sorted.map((f) => {
          const next = nextOf.get(f.id);
          const done = f.checklist.filter((c) => c.done).length;
          return (
            <li key={f.id} className="card space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold">{f.examName}</h3>
                  <p className="text-sm text-muted">{t.statuses[f.status]}{f.applicationNo ? ` · ${f.applicationNo}` : ""}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs ${f.feePaid ? "bg-ok text-white" : "bg-warn-bg"}`}>{f.feePaid ? t.feeDone : t.feePending}</span>
              </div>
              {next && (
                <p className={`text-sm ${next.daysLeft <= 3 ? "font-semibold text-bad" : ""}`}>
                  {fmt(t.next, { label: t.dates[next.field], date: formatDDMMYYYY(next.date) })} · {whenLabel(t, next.daysLeft)}
                </p>
              )}
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                {DATE_FIELDS.filter((k) => f[k]).map((k) => (
                  <div key={k}>
                    <dt className="text-xs text-muted">{t.dates[k]}</dt>
                    <dd>{formatDDMMYYYY(parseISODate(f[k]!)!)}</dd>
                  </div>
                ))}
              </dl>
              {f.notes && <p className="whitespace-pre-line text-sm">{f.notes}</p>}
              <details open={open === f.id} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open ? f.id : open === f.id ? null : open)}>
                <summary className="flex min-h-11 cursor-pointer items-center text-sm">
                  {t.checklist}{f.checklist.length ? ` · ${fmt(t.checklistDone, { done, total: f.checklist.length })}` : ""}
                </summary>
                <FormChecklist items={f.checklist} t={t} onChange={(checklist) => update(forms.map((x) => (x.id === f.id ? { ...x, checklist, updatedAt: Date.now() } : x)))} />
              </details>
              <div className="flex gap-2">
                <button type="button" className="btn-secondary flex-1" onClick={() => setEditing(f)}>{t.edit}</button>
                <button type="button" className="btn-secondary flex-1" onClick={() => { if (confirm(t.confirmDelete)) update(forms.filter((x) => x.id !== f.id)); }}>{t.delete}</button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex gap-2">
        <button type="button" className="btn-secondary flex-1" disabled={!forms.length} onClick={doExport}>⬇ {t.exportBtn}</button>
        <button type="button" className="btn-secondary flex-1" onClick={() => fileRef.current?.click()}>⬆ {t.importBtn}</button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) doImport(f); }} />
      </div>
      {msg && <p className="text-sm" aria-live="polite">{msg}</p>}
      <p className="text-xs text-muted">{t.storageNote}</p>
    </div>
  );
}

function FormEditor({ entry, t, exams, onSave, onCancel }: { entry: FormEntry; t: typeof myFormsEn; exams: Props["exams"]; onSave: (f: FormEntry) => void; onCancel: () => void }) {
  const [f, setF] = useState(entry);
  const set = <K extends keyof FormEntry>(k: K, v: FormEntry[K]) => setF((x) => ({ ...x, [k]: v }));
  return (
    <form className="card space-y-3" onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <label className="block text-sm">
        {t.pickExam}
        <select className="field mt-1" value={f.examSlug ?? ""} onChange={(e) => { const ex = exams.find((x) => x.slug === e.target.value); setF((x) => ({ ...x, examSlug: ex?.slug, examName: ex ? ex.name : x.examName })); }}>
          <option value="">—</option>
          {exams.map((e) => <option key={e.slug} value={e.slug}>{e.name}</option>)}
        </select>
      </label>
      <label className="block text-sm">
        {t.exam}
        <input className="field mt-1" required value={f.examName} placeholder={t.examPlaceholder} onChange={(e) => set("examName", e.target.value)} />
      </label>
      <label className="block text-sm">
        {t.status}
        <select className="field mt-1" value={f.status} onChange={(e) => set("status", e.target.value as FormStatus)}>
          {FORM_STATUSES.map((s) => <option key={s} value={s}>{t.statuses[s]}</option>)}
        </select>
      </label>
      <label className="block text-sm">
        {t.applicationNo}
        <input className="field mt-1" value={f.applicationNo ?? ""} onChange={(e) => set("applicationNo", e.target.value || undefined)} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="h-5 w-5" checked={f.feePaid} onChange={(e) => set("feePaid", e.target.checked)} />{t.feePaid}</label>
        <label className="text-sm">{t.feeAmount}<input className="field mt-1" inputMode="numeric" value={f.feeAmount ?? ""} onChange={(e) => set("feeAmount", e.target.value || undefined)} /></label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {DATE_FIELDS.map((k) => (
          <label key={k} className="text-sm">
            {t.dates[k]}
            <input type="date" className="field mt-1" value={f[k] ?? ""} onChange={(e) => set(k, e.target.value || undefined)} />
          </label>
        ))}
      </div>
      <label className="block text-sm">
        {t.notes}
        <textarea className="field mt-1 min-h-20" value={f.notes ?? ""} onChange={(e) => set("notes", e.target.value || undefined)} />
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex-1">{t.save}</button>
        <button type="button" className="btn-secondary flex-1" onClick={onCancel}>{t.cancel}</button>
      </div>
    </form>
  );
}
