/**
 * Krutidev 010 (also the Remington/GAIL key positions) <-> Unicode Devanagari.
 *
 * Krutidev is a "glyph" font: the bytes are ASCII and the font draws Devanagari shapes, in
 * visual order. So the i-matra (f) is typed BEFORE its consonant and the reph (Z) AFTER its
 * syllable, and half letters + the "k" bar make full letters (e.g. H + k = भ). Conversion is the
 * well-known Rajbhasha-style approach: map glyph tokens (longest first), then reorder ि and र्.
 */

const I_MARK = ""; // placeholder for f (ि typed before the consonant)
const REPH = ""; // placeholder for Z (र् typed after the syllable)
const HALANT = "्";
const NUKTA = "़";

/** Krutidev key/glyph -> Unicode. Multi-char entries are matched first. */
const FWD: Record<string, string> = {
  // independent vowels
  "v‚": "ऑ", vks: "ओ", vkS: "औ", vk: "आ", v: "अ", "b±": "ईं", bZ: "ई", "Ã": "ई", b: "इ",
  mw: "ऊ", "Å": "ऊ", m: "उ", ",s": "ऐ", ",": "ए", _: "ऋ",
  // consonants: lower-case/most keys are full letters, many upper-case keys are half letters
  d: "क", D: "क्", "[": "ख्", x: "ग", X: "ग्", "Ä": "घ", "?": "घ्", "³": "ङ",
  p: "च", P: "च्", N: "छ", t: "ज", T: "ज्", ">": "झ", "÷": "झ्", "Ö": "झ्", "¥": "ञ",
  V: "ट", B: "ठ", M: "ड", "<": "ढ", ".": "ण्",
  r: "त", R: "त्", F: "थ्", n: "द", "/": "ध्", "è": "ध्", "Ë": "ध्", u: "न", U: "न्",
  i: "प", I: "प्", Q: "फ", "¶": "फ्", c: "ब", C: "ब्", H: "भ्", "Ò": "भ", e: "म", E: "म्",
  ";": "य", "¸": "य्", j: "र", y: "ल", Y: "ल्", G: "ळ", o: "व", O: "व्",
  "'": "श्", "Ü": "श्", '"': "ष्", l: "स", L: "स्", g: "ह", "º": "ह्",
  // ready-made conjuncts
  "{": "क्ष्", "=": "त्र", "«": "त्र्", K: "ज्ञ", J: "श्र", "|": "द्य", "}": "द्व", ")": "द्ध",
  "#": "रु", ":": "रू", "ä": "क्त", "Ø": "क्र", "Ý": "फ्र", "æ": "द्र", "ç": "प्र", "Á": "प्र",
  "Ù": "त्त्", "é": "न्न", "™": "न्न्", "–": "दृ", "—": "कृ", "Ñ": "कृ", "à": "ह्न", "á": "ह्य",
  "â": "हृ", "ã": "ह्म", "í": "द्द", "Ì": "द्द", "ê": "ट्ट", "Í": "ट्ट", "ë": "ट्ठ", "Î": "ट्ठ",
  "ì": "ड्ड", "Ï": "ड्ड", "ï": "ड्ढ", "Ô": "ड्ढ", "ª": "्र", "î": "्य", "Ó": "्य",
  // matras and signs
  "‚": "ॉ", ks: "ो", kS: "ौ", k: "ा", h: "ी", q: "ु", w: "ू", "`": "ृ", s: "े", S: "ै",
  a: "ं", "¡": "ँ", "%": "ः", W: "ॅ", "~": HALANT, z: "्र", "+": NUKTA,
  f: I_MARK, Z: REPH, "±": REPH + "ं",
  // punctuation that the font draws differently from the ASCII key
  A: "।", "]": ",", "-": ".", "&": "-", "\\": "?", "(": ";", "¼": "(", "½": ")", "¿": "{", "À": "}",
  "¾": "=", $: "+", "@": "/", "^": "‘", "*": "’", "Þ": "“", "ß": "”", "•": "ऽ", "·": "ऽ", "Œ": "॰", "ñ": "॰",
  "å": "०", "ƒ": "१", "„": "२", "…": "३", "†": "४", "‡": "५", "ˆ": "६", "‰": "७", "Š": "८", "‹": "९",
};
const MAX_KEY = 3;

const isConsonant = (ch: string | undefined) =>
  !!ch && ((ch >= "क" && ch <= "ह") || (ch >= "क़" && ch <= "य़"));
/** Signs that sit after a consonant: skipped when looking back for the reph's syllable. */
const AFTER_SIGNS = new Set([..."ािीुूृॄेैोौंँःॅॉॆॊ़ॢॣ"]);

export function krutidevToUnicode(input: string): string {
  let out = "";
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    // A half letter followed by the "k" bar becomes the full letter (H + k = भ).
    if (ch === "k" && out.endsWith(HALANT)) {
      out = out.slice(0, -1);
      i++;
      continue;
    }
    // Nukta typed after a half letter belongs before the halant (T + "+" = ज़्).
    if (ch === "+" && out.endsWith(HALANT)) {
      out = out.slice(0, -1) + NUKTA + HALANT;
      i++;
      continue;
    }
    let matched = false;
    for (let len = Math.min(MAX_KEY, input.length - i); len > 0; len--) {
      const key = input.slice(i, i + len);
      const val = FWD[key];
      if (val !== undefined) {
        out += val;
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out += ch;
      i++;
    }
  }
  return placeReph(placeIMatra(out));
}

/** End index (exclusive) of the consonant cluster starting at `start`, or start if none. */
function clusterEnd(s: string, start: number): number {
  if (!isConsonant(s[start])) return start;
  let k = start + 1;
  if (s[k] === NUKTA) k++;
  while (s[k] === HALANT && isConsonant(s[k + 1])) {
    k += 2;
    if (s[k] === NUKTA) k++;
  }
  return k;
}

function placeIMatra(s: string): string {
  let idx = s.indexOf(I_MARK);
  while (idx !== -1) {
    const end = clusterEnd(s, idx + 1);
    s = end > idx + 1 ? s.slice(0, idx) + s.slice(idx + 1, end) + "ि" + s.slice(end) : s.slice(0, idx) + "ि" + s.slice(idx + 1);
    idx = s.indexOf(I_MARK);
  }
  return s;
}

function placeReph(s: string): string {
  let idx = s.indexOf(REPH);
  while (idx !== -1) {
    let p = idx - 1;
    while (p >= 0 && AFTER_SIGNS.has(s[p])) p--;
    let at = idx; // no syllable found: leave र् where it was typed
    if (p >= 0 && isConsonant(s[p])) {
      // walk back over half letters so र् goes before the whole conjunct (र्द्र, र्त्स)
      while (s[p - 1] === HALANT) {
        let q = p - 2;
        if (s[q] === NUKTA) q--;
        if (!isConsonant(s[q])) break;
        p = q;
      }
      at = p;
    }
    s = s.slice(0, at) + "र्" + s.slice(at, idx) + s.slice(idx + 1);
    idx = s.indexOf(REPH);
  }
  return s;
}

/* ---------- Unicode -> Krutidev keys (used to show "how to type this word") ---------- */

const FULL: Record<string, string> = {
  क: "d", ख: "[k", ग: "x", घ: "?k", ङ: "³", च: "p", छ: "N", ज: "t", झ: ">", ञ: "¥", ट: "V", ठ: "B",
  ड: "M", ढ: "<", ण: ".k", त: "r", थ: "Fk", द: "n", ध: "/k", न: "u", प: "i", फ: "Q", ब: "c", भ: "Hk",
  म: "e", य: ";", र: "j", ल: "y", ळ: "G", व: "o", श: "'k", ष: '"k', स: "l", ह: "g",
};
const HALF: Record<string, string> = {
  क: "D", ख: "[", ग: "X", घ: "?", च: "P", ज: "T", झ: "÷", ण: ".", त: "R", थ: "F", ध: "/", न: "U",
  प: "I", फ: "¶", ब: "C", भ: "H", म: "E", य: "¸", ल: "Y", व: "O", श: "'", ष: '"', स: "L", ह: "º",
};
/** Two-consonant conjuncts that have their own key. */
const CONJ: Record<string, { full: string; half?: string }> = {
  "क्ष": { full: "{k", half: "{" }, "त्र": { full: "=", half: "«" }, "ज्ञ": { full: "K" }, "श्र": { full: "J" },
  "द्य": { full: "|" }, "द्व": { full: "}" }, "द्ध": { full: ")" },
};
const VOWELS: Record<string, string> = {
  अ: "v", आ: "vk", इ: "b", ई: "bZ", उ: "m", ऊ: "mw", ऋ: "_", ए: ",", ऐ: ",s", ओ: "vks", औ: "vkS", ऑ: "v‚",
};
const MATRAS: Record<string, string> = {
  "ा": "k", "ी": "h", "ु": "q", "ू": "w", "ृ": "`", "े": "s", "ै": "S", "ो": "ks", "ौ": "kS", "ॅ": "W", "ॉ": "‚",
};
const SIGNS: Record<string, string> = { "ं": "a", "ँ": "¡", "ः": "%" };
const PUNCT: Record<string, string> = {
  "।": "A", ",": "]", ".": "-", "-": "&", "?": "\\", ";": "(", "/": "@", "+": "$", "(": "¼", ")": "½",
  "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
};

const fullKey = (c: string) => (FULL[c[0]] ?? c[0]) + (c.length > 1 ? "+" : "");
const halfKey = (c: string) => (HALF[c[0]] ? HALF[c[0]] + (c.length > 1 ? "+" : "") : fullKey(c) + "~");

function clusterKeys(cons: string[], dead: boolean): string {
  let keys = "";
  const tail = dead ? "~" : "";
  for (let i = 0; i < cons.length; ) {
    const lastPair = i + 1 === cons.length - 1;
    const conj = i + 1 < cons.length ? CONJ[cons[i] + HALANT + cons[i + 1]] : undefined;
    if (conj && (lastPair || conj.half)) {
      keys += lastPair ? conj.full + tail : conj.half;
      i += 2;
    } else if (lastPair && cons[i + 1] === "र") {
      keys += fullKey(cons[i]) + "z" + tail; // प्र = i + z
      i += 2;
    } else if (i === cons.length - 1) {
      keys += fullKey(cons[i]) + tail;
      i++;
    } else {
      keys += halfKey(cons[i]);
      i++;
    }
  }
  return keys;
}

/** The Krutidev/Remington keys a student presses for a Unicode text (best effort). */
export function unicodeToKrutidev(input: string): string {
  const s = input.normalize("NFC").replace(/[‌‍]/g, "");
  let out = "";
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (isConsonant(ch)) {
      const cons: string[] = [];
      let j = i;
      for (;;) {
        const c = s[j + 1] === NUKTA ? s[j] + NUKTA : s[j];
        cons.push(c);
        j += c.length;
        if (s[j] === HALANT && isConsonant(s[j + 1])) j++;
        else break;
      }
      let dead = false;
      if (s[j] === HALANT) { dead = true; j++; }
      const signs: string[] = [];
      while (j < s.length && (AFTER_SIGNS.has(s[j]) || s[j] === NUKTA)) signs.push(s[j++]);
      const reph = cons.length > 1 && cons[0] === "र";
      if (reph) cons.shift();
      let body: string;
      if (!reph && cons.length === 1 && cons[0] === "र" && (signs[0] === "ु" || signs[0] === "ू")) {
        body = signs.shift() === "ु" ? "#" : ":";
      } else body = clusterKeys(cons, dead);
      const pre = signs.includes("ि") ? "f" : "";
      const vowelPart = signs.filter((m) => m !== "ि" && !SIGNS[m]).map((m) => MATRAS[m] ?? (m === NUKTA ? "+" : m)).join("");
      const signPart = signs.filter((m) => SIGNS[m]).map((m) => SIGNS[m]).join("");
      out += pre + body + vowelPart + (reph ? "Z" : "") + signPart;
      i = j;
    } else if (VOWELS[ch]) {
      out += VOWELS[ch];
      i++;
    } else {
      out += MATRAS[ch] ?? SIGNS[ch] ?? PUNCT[ch] ?? (ch === HALANT ? "~" : ch);
      i++;
    }
  }
  return out;
}

/** Single key -> what it produces, for the on-screen chart. */
export function krutidevKeyLabel(key: string): string {
  const v = FWD[key];
  if (v === undefined) return key;
  return v.replace(I_MARK, "ि").replace(REPH, "र्");
}
