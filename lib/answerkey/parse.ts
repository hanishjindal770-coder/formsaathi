import { clean, closest, findAll, hasClass, parseHtml, textOf, type ANode } from "./html";

export type Question = {
  /** Question ID from the sheet (digialm) or the number the student typed. */
  id: string;
  /** Display number, e.g. "5" from "Q.5". */
  num: string;
  section: string;
  /** Number of options seen (0 when unknown, e.g. the lines format). */
  options: number;
  /** 1-based chosen option, null when not attempted. */
  chosen: number | null;
  /** 1-based correct option(s). Several = multiple correct/bonus; empty = no key (dropped?). */
  correct: number[];
  status: string;
};

export type ParseError = "empty" | "noQuestions" | "textNoKey" | "badLine";
export type ParseResult =
  | { ok: true; source: "digialm" | "lines"; labels: "number" | "letter"; questions: Question[] }
  | { ok: false; error: ParseError; line?: number };

// English and Hindi labels seen on TCS iON sheets; matched loosely.
const RE_QID = /question\s*id|प्रश्न\s*(?:आई\.?\s*डी|आईडी|id|संख्या)/i;
const RE_CHOSEN = /chosen\s*option|chosen\s*ans|चुना\s*गया\s*विकल्प|चयनित\s*विकल्प/i;
const RE_STATUS = /^\s*(?:status|स्थिति)\b/i;
const NOT_ANSWERED = /^(?:--+|-|—|na|n\/a|none|0)?$/i;

/** "2", "B", "b", "(2)", "Option 2" -> 2. Anything else -> null. */
export function optionNumber(s: string): number | null {
  const t = s.trim().replace(/^option\s*/i, "").replace(/^\(|\)$/g, "").replace(/[.)]$/, "");
  if (/^[1-9]$/.test(t)) return Number(t);
  if (/^[a-h]$/i.test(t)) return t.toUpperCase().charCodeAt(0) - 64;
  return null;
}

/**
 * Chrome on Android saves pages as .mhtml: a MIME bundle whose HTML part is usually
 * quoted-printable. Returns the decoded HTML part, or the input unchanged if it isn't MHTML.
 */
export function unwrapMhtml(input: string): string {
  const head = input.slice(0, 3000);
  if (!/^(?:from|mime-version|content-type)\s*:/im.test(head) || !/multipart\/related/i.test(head)) return input;
  const boundary = /boundary\s*=\s*"?([^";\r\n]+)"?/i.exec(head)?.[1];
  const parts = boundary ? input.split(`--${boundary}`) : [input];
  const part = parts.find((p) => /content-type:\s*text\/html/i.test(p.slice(0, 1000)));
  const split = part && /\r?\n\r?\n/.exec(part);
  if (!part || !split) return input;
  const headers = part.slice(0, split.index);
  const body = part.slice(split.index + split[0].length);
  if (/content-transfer-encoding:\s*quoted-printable/i.test(headers)) {
    const raw = body.replace(/=\r?\n/g, "");
    const bytes: number[] = [];
    const enc = new TextEncoder();
    for (let i = 0; i < raw.length; i++) {
      const hex = raw[i] === "=" ? raw.slice(i + 1, i + 3) : "";
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) { bytes.push(parseInt(hex, 16)); i += 2; }
      else bytes.push(...enc.encode(raw[i]));
    }
    return new TextDecoder("utf-8").decode(new Uint8Array(bytes));
  }
  if (/content-transfer-encoding:\s*base64/i.test(headers)) {
    try {
      const bin = atob(body.replace(/\s+/g, ""));
      return new TextDecoder("utf-8").decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
    } catch { return input; }
  }
  return body;
}

/** Saved page (.html/.mhtml) / page source -> HTML parser; anything else -> text format. */
export function parseInput(input: string): ParseResult {
  const s = unwrapMhtml(input.replace(/^\uFEFF/, ""));
  if (!s.trim()) return { ok: false, error: "empty" };
  if (/<\s*(?:html|body|table|div)\b/i.test(s)) return parseResponseSheet(s);
  // Select-all-copied text has the chosen option but loses the green tick that marks the answer.
  if (RE_CHOSEN.test(s) && /Q\.\s*\d+/.test(s)) return { ok: false, error: "textNoKey" };
  return parseLines(s);
}

function sectionName(q: ANode): string {
  const box = closest(q, hasClass(/^section-?cntnr$/i));
  const lbl = box && findAll(box, hasClass(/^section-?lbl$/i))[0];
  if (!lbl) return "";
  return clean(textOf(lbl)).replace(/^(?:section|खंड|भाग)\s*:?\s*/i, "").replace(/\s*:\s*$/, "");
}

function menuFields(q: ANode): Map<string, string> {
  const tbl = findAll(q, hasClass(/^menu-?tbl$/i))[0] ?? (q.parent && findAll(q.parent, hasClass(/^menu-?tbl$/i))[0]);
  const out = new Map<string, string>();
  if (!tbl) return out;
  for (const tr of findAll(tbl, (n) => n.tag === "tr")) {
    const m = /^(.*?)\s*[:：]\s*(.*)$/.exec(clean(textOf(tr)));
    if (m) out.set(m[1], m[2]);
  }
  return out;
}
const field = (f: Map<string, string>, re: RegExp) => {
  for (const [k, v] of f) if (re.test(k)) return v;
  return undefined;
};

export function parseResponseSheet(html: string): ParseResult {
  const doc = parseHtml(html);
  const panels = findAll(doc, hasClass(/^questionpnltbl$/i))
    // A panel nested in another panel would be counted twice.
    .filter((p) => !closest(p, hasClass(/^questionpnltbl$/i)));
  const questions: Question[] = [];
  panels.forEach((p, i) => {
    const f = menuFields(p);
    const cells = findAll(p, hasClass(/^(?:rightans|wrngans|wrongans)$/i))
      .filter((c) => !closest(c, hasClass(/^menu-?tbl$/i)));
    if (!cells.length) return; // non-MCQ (typed answer) questions can't be scored here
    const correct: number[] = [];
    cells.forEach((c, j) => {
      const lead = /^\s*(?:ans\s*)?([1-9])\s*[.)]/i.exec(clean(textOf(c)));
      const n = lead ? Number(lead[1]) : j + 1;
      if (c.cls.includes("rightans")) correct.push(n);
    });
    const chosenRaw = field(f, RE_CHOSEN)?.trim() ?? "";
    const qno = /Q\.?\s*(\d+)/i.exec(clean(textOf(p)));
    questions.push({
      id: field(f, RE_QID)?.trim() || String(i + 1),
      num: qno ? qno[1] : String(i + 1),
      section: sectionName(p),
      options: cells.length,
      chosen: NOT_ANSWERED.test(chosenRaw) ? null : optionNumber(chosenRaw),
      correct: [...new Set(correct)].sort((a, b) => a - b),
      status: field(f, RE_STATUS) ?? "",
    });
  });
  if (!questions.length) return { ok: false, error: "noQuestions" };
  return { ok: true, source: "digialm", labels: "number", questions };
}

/**
 * Plain format for any other exam: one question per line, "question chosen correct", e.g.
 * "1 B C", "2 - A" (not attempted), "3 C B/C" (two correct), separators: space , | ;
 * A line like "# Reasoning" or "Section: Reasoning" starts a new section.
 */
export function parseLines(text: string): ParseResult {
  const questions: Question[] = [];
  let section = "";
  let letters = false;
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const sec = /^(?:#+|section\s*:|खंड\s*:|भाग\s*:)\s*(.+)$/i.exec(line);
    if (sec) { section = sec[1].trim(); continue; }
    const parts = line.replace(/^q\.?\s*/i, "").split(/[\s,|;]+/).filter(Boolean);
    // "1." / "1)" question numbers
    if (parts[0]) parts[0] = parts[0].replace(/[.):]$/, "");
    if (parts.length !== 3 || !/^\d+[a-z]?$/i.test(parts[0])) return { ok: false, error: "badLine", line: i + 1 };
    const [num, ch, co] = parts;
    const chosen = NOT_ANSWERED.test(ch) || /^x$/i.test(ch) ? null : optionNumber(ch);
    const correct = co.split(/[/&+]/).map(optionNumber);
    if ((chosen === null && !(NOT_ANSWERED.test(ch) || /^x$/i.test(ch))) || correct.some((c) => c === null)) {
      return { ok: false, error: "badLine", line: i + 1 };
    }
    if (/[a-h]/i.test(ch + co)) letters = true;
    questions.push({ id: num, num, section, options: 0, chosen, correct: [...new Set(correct as number[])].sort((a, b) => a - b), status: "" });
  }
  if (!questions.length) return { ok: false, error: "noQuestions" };
  return { ok: true, source: "lines", labels: letters ? "letter" : "number", questions };
}

export const optionLabel = (n: number, labels: "number" | "letter") => (labels === "letter" ? String.fromCharCode(64 + n) : String(n));
