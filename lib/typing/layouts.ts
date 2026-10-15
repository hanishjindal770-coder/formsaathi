/** Keyboard layouts for the typing test. */
import { krutidevKeyLabel } from "./krutidev";

export type TypingLanguage = "english" | "hindi";
export type LayoutId = "qwerty" | "inscript" | "remington" | "krutidev";
export type ExamFont = "krutidev" | "mangal-inscript" | "mangal-remington";

export const LAYOUTS_FOR: Record<TypingLanguage, LayoutId[]> = {
  english: ["qwerty"],
  hindi: ["inscript", "remington", "krutidev"],
};

export const layoutFromFont = (f: ExamFont): LayoutId =>
  f === "krutidev" ? "krutidev" : f === "mangal-remington" ? "remington" : "inscript";

/** Remington (GAIL) and Krutidev share key positions: the student types Krutidev ASCII keys. */
export const usesKrutidevKeys = (l: LayoutId) => l === "remington" || l === "krutidev";

/** US keyboard rows, unshifted and shifted, used to draw the charts. */
export const KEY_ROWS: { normal: string; shift: string }[] = [
  { normal: "`1234567890-=", shift: "~!@#$%^&*()_+" },
  { normal: "qwertyuiop[]\\", shift: "QWERTYUIOP{}|" },
  { normal: "asdfghjkl;'", shift: 'ASDFGHJKL:"' },
  { normal: "zxcvbnm,./", shift: "ZXCVBNM<>?" },
];

/** Standard Inscript (Devanagari), keyed by the unshifted US key: [normal, shift]. */
const INSCRIPT: Record<string, [string, string]> = {
  "`": ["ॊ", "ऒ"], "1": ["१", "ऍ"], "2": ["२", "ॅ"], "3": ["३", "्र"], "4": ["४", "र्"], "5": ["५", "ज्ञ"],
  "6": ["६", "त्र"], "7": ["७", "क्ष"], "8": ["८", "श्र"], "9": ["९", "("], "0": ["०", ")"], "-": ["-", "ः"], "=": ["ृ", "ऋ"],
  q: ["ौ", "औ"], w: ["ै", "ऐ"], e: ["ा", "आ"], r: ["ी", "ई"], t: ["ू", "ऊ"], y: ["ब", "भ"], u: ["ह", "ङ"],
  i: ["ग", "घ"], o: ["द", "ध"], p: ["ज", "झ"], "[": ["ड", "ढ"], "]": ["़", "ञ"], "\\": ["ॉ", "ऑ"],
  a: ["ो", "ओ"], s: ["े", "ए"], d: ["्", "अ"], f: ["ि", "इ"], g: ["ु", "उ"], h: ["प", "फ"], j: ["र", "ऱ"],
  k: ["क", "ख"], l: ["त", "थ"], ";": ["च", "छ"], "'": ["ट", "ठ"],
  z: ["ॆ", "ऎ"], x: ["ं", "ँ"], c: ["म", "ण"], v: ["न", "ऩ"], b: ["व", "ऴ"], n: ["ल", "ळ"], m: ["स", "श"],
  ",": [",", "ष"], ".": [".", "।"], "/": ["य", "य़"],
};

const CODE_TO_KEY: Record<string, string> = {
  Backquote: "`", Minus: "-", Equal: "=", BracketLeft: "[", BracketRight: "]", Backslash: "\\",
  Semicolon: ";", Quote: "'", Comma: ",", Period: ".", Slash: "/",
};

/** Unicode text for a physical key press in Inscript, or null to let the browser handle it. */
export function inscriptChar(code: string, shift: boolean): string | null {
  let key: string | undefined = CODE_TO_KEY[code];
  if (!key && /^Key[A-Z]$/.test(code)) key = code.slice(3).toLowerCase();
  if (!key && /^Digit\d$/.test(code)) key = code.slice(5);
  const pair = key ? INSCRIPT[key] : undefined;
  return pair ? pair[shift ? 1 : 0] : null;
}

/** What a key produces in a layout, for the on-screen chart. */
export function chartLabel(layout: LayoutId, key: string, shifted: boolean, normalKey: string): string {
  if (layout === "inscript") return INSCRIPT[normalKey]?.[shifted ? 1 : 0] ?? "";
  if (usesKrutidevKeys(layout)) {
    const v = krutidevKeyLabel(key);
    return v === key && !/^[0-9!]$/.test(key) ? "" : v;
  }
  return key;
}

const INSCRIPT_REVERSE: Map<string, string> = (() => {
  const m = new Map<string, string>();
  const shiftOf = new Map<string, string>();
  for (const row of KEY_ROWS) [...row.normal].forEach((k, i) => shiftOf.set(k, row.shift[i]));
  // single characters first so multi-char shortcuts (क्ष, त्र…) never shadow them
  for (const [k, [n, s]] of Object.entries(INSCRIPT)) {
    if (n.length === 1 && !m.has(n)) m.set(n, k);
    if (s.length === 1 && !m.has(s)) m.set(s, shiftOf.get(k) ?? k.toUpperCase());
  }
  return m;
})();

/** The Inscript keys for a Unicode word, e.g. "भारत" -> "Yejl" (upper case / symbol = with Shift). */
export function unicodeToInscriptKeys(word: string): string {
  return [...word.normalize("NFC")].map((c) => INSCRIPT_REVERSE.get(c) ?? c).join("");
}
