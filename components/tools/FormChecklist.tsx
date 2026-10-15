"use client";
import { useState } from "react";
import { fmt } from "@/i18n/config";
import type { myFormsEn } from "@/i18n/parts/myForms";
import { addTopics, type ChecklistItem } from "@/lib/forms/store";

/** Syllabus checklist for one form. Topics come from the student, never from us. */
export default function FormChecklist({ items, onChange, t }: { items: ChecklistItem[]; onChange: (items: ChecklistItem[]) => void; t: typeof myFormsEn }) {
  const [text, setText] = useState("");
  const done = items.filter((c) => c.done).length;
  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <>
          <p className="text-sm text-muted">{fmt(t.checklistDone, { done, total: items.length })}</p>
          <div className="h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
            <div className="h-full bg-ok" style={{ width: `${(done / items.length) * 100}%` }} />
          </div>
          <ul className="divide-y divide-line rounded-xl border border-line">
            {items.map((c) => (
              <li key={c.id} className="flex items-center gap-2 px-2">
                <label className="flex min-h-11 flex-1 items-center gap-3">
                  <input type="checkbox" className="h-5 w-5" checked={c.done} onChange={(e) => onChange(items.map((x) => (x.id === c.id ? { ...x, done: e.target.checked } : x)))} />
                  <span className={c.done ? "text-muted line-through" : ""}>{c.text}</span>
                </label>
                <button type="button" aria-label={t.removeTopic} onClick={() => onChange(items.filter((x) => x.id !== c.id))} className="h-10 w-10 rounded-lg text-muted">✕</button>
              </li>
            ))}
          </ul>
        </>
      )}
      <label className="block text-sm">
        {t.addTopics}
        <textarea className="field mt-1 min-h-24" value={text} placeholder={t.topicsPlaceholder} onChange={(e) => setText(e.target.value)} />
      </label>
      <button type="button" className="btn-secondary w-full" disabled={!text.trim()} onClick={() => { onChange(addTopics(items, text)); setText(""); }}>
        {t.addTopicsBtn}
      </button>
      <p className="text-xs text-muted">{t.syllabusNote}</p>
    </div>
  );
}
