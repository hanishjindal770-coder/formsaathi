import { compareYMD, parseISODate, type YMD } from "@/lib/date";

/**
 * "My Forms" tracker data. Lives only in this browser (localStorage), so it works offline and
 * nothing about a student's applications ever leaves the phone. Export/import covers phone changes.
 */

export const FORM_STATUSES = ["planned", "applied", "admitCard", "examDone", "result"] as const;
export type FormStatus = (typeof FORM_STATUSES)[number];

export type ChecklistItem = { id: string; text: string; done: boolean };

export type FormEntry = {
  id: string;
  examName: string;
  examSlug?: string;
  status: FormStatus;
  applicationNo?: string;
  feePaid: boolean;
  feeAmount?: string;
  lastDate?: string;
  admitCardDate?: string;
  examDate?: string;
  resultDate?: string;
  notes?: string;
  checklist: ChecklistItem[];
  updatedAt: number;
};

export const DATE_FIELDS = ["lastDate", "admitCardDate", "examDate", "resultDate"] as const;
export type DateField = (typeof DATE_FIELDS)[number];

const KEY = "fs:myForms";
const VERSION = 1;

export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function emptyEntry(examName = "", examSlug?: string): FormEntry {
  return { id: newId(), examName, examSlug, status: "planned", feePaid: false, checklist: [], updatedAt: Date.now() };
}

/** Accepts anything (old versions, hand-edited exports) and keeps only well-formed entries. */
export function sanitize(raw: unknown): FormEntry[] {
  const list = Array.isArray(raw) ? raw : raw && typeof raw === "object" && Array.isArray((raw as { forms?: unknown }).forms) ? (raw as { forms: unknown[] }).forms : [];
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 500) : undefined);
  const date = (v: unknown) => (typeof v === "string" && parseISODate(v) ? v : undefined);
  const out: FormEntry[] = [];
  for (const r of list) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    const examName = str(o.examName);
    if (!examName) continue;
    out.push({
      id: str(o.id) ?? newId(),
      examName,
      examSlug: str(o.examSlug),
      status: FORM_STATUSES.includes(o.status as FormStatus) ? (o.status as FormStatus) : "planned",
      applicationNo: str(o.applicationNo),
      feePaid: o.feePaid === true,
      feeAmount: str(o.feeAmount),
      lastDate: date(o.lastDate),
      admitCardDate: date(o.admitCardDate),
      examDate: date(o.examDate),
      resultDate: date(o.resultDate),
      notes: str(o.notes),
      checklist: Array.isArray(o.checklist)
        ? (o.checklist as unknown[]).flatMap((c) => {
            const ci = c as Record<string, unknown>;
            const text = str(ci?.text);
            return text ? [{ id: str(ci.id) ?? newId(), text, done: ci.done === true }] : [];
          })
        : [],
      updatedAt: typeof o.updatedAt === "number" ? o.updatedAt : Date.now(),
    });
  }
  return out;
}

export function loadForms(): FormEntry[] {
  try {
    const s = localStorage.getItem(KEY);
    return s ? sanitize(JSON.parse(s)) : [];
  } catch {
    return [];
  }
}

export function saveForms(forms: FormEntry[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, forms }));
    return true;
  } catch {
    return false;
  }
}

export const exportForms = (forms: FormEntry[]) => JSON.stringify({ app: "FormSaathi", v: VERSION, forms }, null, 2);

/** Merges imported entries into the current list; an imported entry with the same id replaces the old one. */
export function mergeForms(current: FormEntry[], imported: FormEntry[]): FormEntry[] {
  const byId = new Map(current.map((f) => [f.id, f]));
  for (const f of imported) byId.set(f.id, f);
  return [...byId.values()];
}

export function daysBetween(from: YMD, to: YMD): number {
  return Math.round((Date.UTC(to.y, to.m - 1, to.d) - Date.UTC(from.y, from.m - 1, from.d)) / 86400000);
}

export type UpcomingEvent = { formId: string; examName: string; field: DateField; date: YMD; daysLeft: number };

/** Every dated event from today on, soonest first. Past events are dropped. */
export function upcomingEvents(forms: FormEntry[], today: YMD): UpcomingEvent[] {
  const out: UpcomingEvent[] = [];
  for (const f of forms) {
    for (const field of DATE_FIELDS) {
      const d = f[field] ? parseISODate(f[field]!) : null;
      if (d && compareYMD(d, today) >= 0) out.push({ formId: f.id, examName: f.examName, field, date: d, daysLeft: daysBetween(today, d) });
    }
  }
  return out.sort((a, b) => a.daysLeft - b.daysLeft || a.examName.localeCompare(b.examName));
}

/** Sort for the tracker list: the form with the nearest upcoming date first, undated ones last. */
export function sortForms(forms: FormEntry[], today: YMD): FormEntry[] {
  const next = new Map<string, number>();
  for (const e of upcomingEvents(forms, today)) if (!next.has(e.formId)) next.set(e.formId, e.daysLeft);
  return [...forms].sort((a, b) => (next.get(a.id) ?? 1e9) - (next.get(b.id) ?? 1e9) || b.updatedAt - a.updatedAt);
}

/** One topic per line; blank lines and duplicates of existing topics are skipped. */
export function addTopics(list: ChecklistItem[], text: string): ChecklistItem[] {
  const have = new Set(list.map((c) => c.text.toLowerCase()));
  const added: ChecklistItem[] = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.replace(/^[\s\-•*\d.)]+/, "").trim().slice(0, 200);
    if (t && !have.has(t.toLowerCase())) {
      have.add(t.toLowerCase());
      added.push({ id: newId(), text: t, done: false });
    }
  }
  return [...list, ...added];
}
