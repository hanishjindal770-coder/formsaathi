import type { Question } from "./parse";

/** Marks per question. `wrong` is the penalty; either sign is accepted (0.5 and -0.5 both mean −0.5). */
export type Marking = { correct: number; wrong: number; sections?: { name: string; correct?: number; wrong?: number }[] };

export type Tally = {
  name: string;
  /** Marks used for this section. */
  plus: number;
  minus: number;
  total: number;
  attempted: number;
  correct: number;
  wrong: number;
  unattempted: number;
  /** Attempted, but the sheet shows no correct option (dropped/cancelled?) so it isn't scored. */
  noKey: number;
  score: number;
  maxScore: number;
};
export type WrongItem = { id: string; num: string; section: string; chosen: number; correct: number[] };
export type ScoreResult = { sections: Tally[]; total: Tally; wrongList: WrongItem[] };

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
const round2 = (x: number) => Math.round(x * 100) / 100;

/** Finds the section rule whose name matches the sheet's section label (loosely). */
export function sectionMarking(marking: Marking, section: string): { plus: number; minus: number } {
  const key = norm(section);
  const rule = key ? marking.sections?.find((s) => {
    const k = norm(s.name);
    return k && (k === key || key.includes(k) || k.includes(key));
  }) : undefined;
  return { plus: Math.abs(rule?.correct ?? marking.correct), minus: Math.abs(rule?.wrong ?? marking.wrong) };
}

const empty = (name: string, plus: number, minus: number): Tally => ({ name, plus, minus, total: 0, attempted: 0, correct: 0, wrong: 0, unattempted: 0, noKey: 0, score: 0, maxScore: 0 });

export function scoreSheet(questions: Question[], marking: Marking): ScoreResult {
  const bySection = new Map<string, Tally>();
  const wrongList: WrongItem[] = [];
  for (const q of questions) {
    let s = bySection.get(q.section);
    if (!s) {
      const m = sectionMarking(marking, q.section);
      s = empty(q.section, m.plus, m.minus);
      bySection.set(q.section, s);
    }
    s.total++;
    s.maxScore += s.plus;
    if (q.chosen === null) { s.unattempted++; continue; }
    s.attempted++;
    if (!q.correct.length) { s.noKey++; continue; }
    if (q.correct.includes(q.chosen)) { s.correct++; s.score += s.plus; }
    else {
      s.wrong++;
      s.score -= s.minus;
      wrongList.push({ id: q.id, num: q.num, section: q.section, chosen: q.chosen, correct: q.correct });
    }
  }
  const sections = [...bySection.values()].map((s) => ({ ...s, score: round2(s.score), maxScore: round2(s.maxScore) }));
  const total = sections.reduce<Tally>((a, s) => ({
    ...a,
    total: a.total + s.total, attempted: a.attempted + s.attempted, correct: a.correct + s.correct, wrong: a.wrong + s.wrong,
    unattempted: a.unattempted + s.unattempted, noKey: a.noKey + s.noKey, score: round2(a.score + s.score), maxScore: round2(a.maxScore + s.maxScore),
  }), empty("", Math.abs(marking.correct), Math.abs(marking.wrong)));
  return { sections, total, wrongList };
}

export type SummaryLabels = { title: string; total: string; attempted: string; correct: string; wrong: string; unattempted: string; score: string; note: string; section: string };

/** Plain-text summary for copying into WhatsApp/notes. */
export function summaryText(r: ScoreResult, l: SummaryLabels, examName: string): string {
  const line = (s: Tally) => `${l.attempted} ${s.attempted}/${s.total} · ${l.correct} ${s.correct} · ${l.wrong} ${s.wrong} · ${l.unattempted} ${s.unattempted} · ${l.score} ${s.score}/${s.maxScore}`;
  const out = [`${l.title}${examName ? ` – ${examName}` : ""}`];
  if (r.sections.length > 1 || r.sections[0]?.name) {
    for (const s of r.sections) out.push(`${s.name || l.section}: ${line(s)}`);
  }
  out.push(`${l.total}: ${line(r.total)}`, l.note);
  return out.join("\n");
}
