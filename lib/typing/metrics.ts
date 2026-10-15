/**
 * Typing test scoring. Word-level comparison in the style used by Indian govt typing tests:
 * a word is a full mistake unless typed exactly; punctuation / capitalisation / spacing slips are
 * half mistakes. Words are aligned (edit distance on words) so one skipped or extra word is a
 * single mistake instead of shifting every word after it.
 */

export type OpKind = "match" | "half" | "full" | "omit" | "extra" | "merge" | "split" | "partial";
export type AlignOp = {
  kind: OpKind;
  /** typed word(s) as written ("" for omit) */
  typed: string;
  /** expected word(s) ("" for extra) */
  expected: string;
  /** index of the first expected word this op covers (for extra: the next expected word) */
  ei: number;
};

const DEV_DIGITS = "०१२३४५६७८९";

/** Unicode NFC, no zero-width joiners, Devanagari digits as ASCII, single spaces. */
export function normalizeText(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[​-‍﻿]/g, "")
    .replace(/[०-९]/g, (d) => String(DEV_DIGITS.indexOf(d)))
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export const splitWords = (s: string): string[] => {
  const n = normalizeText(s);
  return n ? n.split(" ") : [];
};

/** A word with case and punctuation removed: equal "loose" forms make a half mistake. */
export const looseWord = (w: string) => w.toLowerCase().replace(/[\p{P}\p{S}।॥]/gu, "");

// Costs are doubled so a half mistake is an integer.
const C_HALF = 1, C_FULL = 2;

export function alignWords(typed: string[], expected: string[], opts: { partialLast?: boolean } = {}): { ops: AlignOp[]; end: number } {
  const n = typed.length, m = expected.length;
  const W = m + 1;
  const cost = new Float64Array((n + 1) * W);
  const from = new Uint8Array((n + 1) * W); // 1 diag, 2 extra, 3 omit, 4 merge, 5 split
  const L = typed.map(looseWord), E = expected.map(looseWord);
  const sub = (i: number, j: number) => {
    const a = typed[i], b = expected[j];
    if (a === b) return 0;
    if (opts.partialLast && i === n - 1 && b.startsWith(a)) return 0;
    if (L[i] === E[j] && L[i] !== "") return C_HALF;
    return C_FULL;
  };
  for (let j = 1; j <= m; j++) { cost[j] = j * C_FULL; from[j] = 3; }
  for (let i = 1; i <= n; i++) {
    cost[i * W] = i * C_FULL; from[i * W] = 2;
    for (let j = 1; j <= m; j++) {
      let best = cost[(i - 1) * W + j - 1] + sub(i - 1, j - 1), via = 1;
      const ex = cost[(i - 1) * W + j] + C_FULL;
      if (ex < best) { best = ex; via = 2; }
      const om = cost[i * W + j - 1] + C_FULL;
      if (om < best) { best = om; via = 3; }
      // spacing slips: two words run together, or one word split in two
      if (j >= 2 && L[i - 1] !== "" && L[i - 1] === E[j - 2] + E[j - 1]) {
        const c = cost[(i - 1) * W + j - 2] + C_HALF;
        if (c < best) { best = c; via = 4; }
      }
      if (i >= 2 && E[j - 1] !== "" && L[i - 2] + L[i - 1] === E[j - 1]) {
        const c = cost[(i - 2) * W + j - 1] + C_HALF;
        if (c < best) { best = c; via = 5; }
      }
      cost[i * W + j] = best; from[i * W + j] = via;
    }
  }
  // The student rarely finishes the passage: untyped words at the end are free.
  let end = 0;
  // On a tie prefer the later end, so a wrong last word counts as one substitution, not an extra word.
  for (let j = 1; j <= m; j++) if (cost[n * W + j] <= cost[n * W + end]) end = j;

  const ops: AlignOp[] = [];
  let i = n, j = end;
  while (i > 0 || j > 0) {
    const via = from[i * W + j];
    if (via === 1) {
      const c = sub(i - 1, j - 1);
      const kind: OpKind = c === 0 ? (typed[i - 1] === expected[j - 1] ? "match" : "partial") : c === C_HALF ? "half" : "full";
      ops.push({ kind, typed: typed[i - 1], expected: expected[j - 1], ei: j - 1 });
      i--; j--;
    } else if (via === 2) { ops.push({ kind: "extra", typed: typed[i - 1], expected: "", ei: j }); i--; }
    else if (via === 3) { ops.push({ kind: "omit", typed: "", expected: expected[j - 1], ei: j - 1 }); j--; }
    else if (via === 4) { ops.push({ kind: "merge", typed: typed[i - 1], expected: `${expected[j - 2]} ${expected[j - 1]}`, ei: j - 2 }); i--; j -= 2; }
    else { ops.push({ kind: "split", typed: `${typed[i - 2]} ${typed[i - 1]}`, expected: expected[j - 1], ei: j - 1 }); i -= 2; j--; }
  }
  ops.reverse();
  return { ops, end };
}

export type TypingResult = {
  minutes: number;
  keystrokes: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  kdph: number;
  fullMistakes: number;
  halfMistakes: number;
  /** expected words covered + extra words: the base for accuracy */
  wordsCompared: number;
  correctWords: number;
  ops: AlignOp[];
};

export const isFull = (k: OpKind) => k === "full" || k === "omit" || k === "extra";
export const isHalf = (k: OpKind) => k === "half" || k === "merge" || k === "split";

/**
 * gross WPM = (keystrokes / 5) / minutes
 * net WPM   = gross − (full + half/2) / minutes, never below 0
 * accuracy  = (words compared − full − half/2) / words compared × 100
 * KDPH      = keystrokes × 60 / minutes
 */
export function scoreTest(p: { typed: string; expected: string; keystrokes: number; elapsedMs: number; partialLast?: boolean }): TypingResult {
  const minutes = Math.max(p.elapsedMs, 1000) / 60000;
  const { ops } = alignWords(splitWords(p.typed), splitWords(p.expected), { partialLast: p.partialLast });
  let full = 0, half = 0, compared = 0, correct = 0;
  for (const o of ops) {
    if (o.kind === "partial") continue; // cut off by the timer mid-word: not judged
    compared += o.kind === "merge" ? 2 : 1;
    if (o.kind === "match") correct++;
    else if (isFull(o.kind)) full++;
    else half++;
  }
  const mistakes = full + half / 2;
  const grossWpm = p.keystrokes / 5 / minutes;
  return {
    minutes,
    keystrokes: p.keystrokes,
    grossWpm,
    netWpm: Math.max(0, grossWpm - mistakes / minutes),
    accuracy: compared ? Math.max(0, ((compared - mistakes) / compared) * 100) : 0,
    kdph: (p.keystrokes * 60) / minutes,
    fullMistakes: full,
    halfMistakes: half,
    wordsCompared: compared,
    correctWords: correct,
    ops,
  };
}

/* ---------- local history ---------- */

export const HISTORY_KEY = "fs:typing:history";
export type HistoryEntry = {
  at: string;
  language: "english" | "hindi";
  layout: string;
  durationMin: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  kdph: number;
  full: number;
  half: number;
  exam?: string;
};

export function loadHistory(): HistoryEntry[] {
  try {
    const v = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(v) ? v.slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function saveHistory(e: HistoryEntry): HistoryEntry[] {
  const list = [e, ...loadHistory()].slice(0, 20);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {}
  return list;
}
