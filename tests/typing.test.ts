import { describe, expect, it } from "vitest";
import { krutidevToUnicode as k2u, unicodeToKrutidev as u2k } from "@/lib/typing/krutidev";
import { inscriptChar, unicodeToInscriptKeys, layoutFromFont, chartLabel } from "@/lib/typing/layouts";
import { alignWords, scoreTest, splitWords, normalizeText } from "@/lib/typing/metrics";
import { PASSAGES, passagesFor } from "@/lib/typing/passages";

describe("Krutidev 010 -> Unicode", () => {
  const cases: [string, string][] = [
    ["fgUnh", "हिन्दी"],
    ["Hkkjr", "भारत"],
    ["dk;Z", "कार्य"],
    ["fo|ky;", "विद्यालय"],
    ["eq>s", "मुझे"],
    ["fo|kfFkZ;ksa", "विद्यार्थियों"], // ि after a full letter made of half + bar, then reph
    ["dhfrZ", "कीर्ति"], // reph skips the ि placed before it
    ["/keZ", "धर्म"],
    ['o"kZ', "वर्ष"],
    ["fiz;", "प्रिय"], // ि goes after the whole conjunct प्र
    ["fLFkr", "स्थित"],
    ["O;fDr", "व्यक्ति"],
    ["i=", "पत्र"],
    ["ek=k", "मात्रा"],
    ["{ks=", "क्षेत्र"],
    ["Kku", "ज्ञान"],
    ["J)k", "श्रद्धा"],
    ["cM+k", "बड़ा"], // nukta
    ["t+:j", "ज़रूर"],
    ["[+kcj", "ख़बर"], // nukta on a half letter, then the bar
    ["nzZ", "र्द्र"],
    ["lw;Z", "सूर्य"],
    ["ifjorZu", "परिवर्तन"],
    ["vkSj", "और"],
    ["vksj", "ओर"],
    ["bZ'oj", "ईश्वर"],
    [",slk", "ऐसा"],
    ["_f\"k", "ऋषि"],
    ["fdlh dks ugha", "किसी को नहीं"],
    ["esjk uke jke gSA", "मेरा नाम राम है।"],
    ["iapk;r] xk¡o", "पंचायत, गाँव"],
  ];
  for (const [kd, uni] of cases) it(`${kd} -> ${uni}`, () => expect(k2u(kd)).toBe(uni));

  it("leaves digits, spaces and unknown text alone", () => {
    expect(k2u("2024 esa")).toBe("2024 में");
    expect(k2u("हिन्दी")).toBe("हिन्दी"); // a phone's Hindi keyboard already gives Unicode
  });
  it("does not crash on half-typed input", () => {
    expect(k2u("f")).toBe("ि");
    expect(k2u("Z")).toBe("र्");
    expect(k2u("fF")).toContain("थ");
  });
});

describe("Unicode -> Krutidev keys (typing hint)", () => {
  it("gives the usual key sequences", () => {
    expect(u2k("हिन्दी")).toBe("fgUnh");
    expect(u2k("कार्य")).toBe("dk;Z");
    expect(u2k("विद्यार्थियों")).toBe("fo|kfFkZ;ksa");
    expect(u2k("प्रिय")).toBe("fiz;");
  });
  it("round-trips every Hindi passage using only keys on a normal keyboard", () => {
    for (const p of passagesFor("hindi")) {
      for (const w of splitWords(p.text)) {
        const keys = u2k(w);
        // ¡ (ँ) is the one Alt-code key (Alt+0161) these passages need
        expect(keys, w).toMatch(/^[\x21-\x7e¡]+$/);
        expect(normalizeText(k2u(keys)), `${w} via ${keys}`).toBe(w);
      }
    }
  });
});

describe("Inscript", () => {
  it("maps physical keys", () => {
    expect(inscriptChar("KeyK", false)).toBe("क");
    expect(inscriptChar("KeyK", true)).toBe("ख");
    expect(inscriptChar("KeyF", false)).toBe("ि");
    expect(inscriptChar("Period", true)).toBe("।");
    expect(inscriptChar("Space", false)).toBeNull();
    expect(inscriptChar("Enter", false)).toBeNull();
  });
  it("can type every character of the Hindi passages", () => {
    const shiftOf: Record<string, string> = {};
    for (const p of passagesFor("hindi")) {
      const keys = unicodeToInscriptKeys(p.text);
      expect(keys).not.toMatch(/[ऀ-ॿ]/);
      void shiftOf;
    }
    // typing the keys back gives the word
    const code = (c: string) => (/[a-z]/i.test(c) ? `Key${c.toUpperCase()}` : ({ ".": "Period", ">": "Period", "/": "Slash", "]": "BracketRight", "[": "BracketLeft", "{": "BracketLeft" } as Record<string, string>)[c]);
    const typed = [...unicodeToInscriptKeys("भारत ड़")].map((c) => (c === " " ? " " : inscriptChar(code(c)!, c !== c.toLowerCase() || c === ">" || c === "{"))).join("");
    expect(typed).toBe("भारत ड़".normalize("NFC"));
  });
  it("exam fonts map to layouts", () => {
    expect(layoutFromFont("krutidev")).toBe("krutidev");
    expect(layoutFromFont("mangal-remington")).toBe("remington");
    expect(layoutFromFont("mangal-inscript")).toBe("inscript");
    expect(chartLabel("krutidev", "f", false, "f")).toBe("ि");
    expect(chartLabel("remington", "Z", true, "z")).toBe("र्");
  });
});

describe("word alignment", () => {
  const W = (s: string) => s.split(" ");
  const kinds = (t: string, e: string, partialLast = false) => alignWords(W(t), W(e), { partialLast }).ops.map((o) => o.kind);

  it("one skipped word is one mistake, not a cascade", () => {
    expect(kinds("the quick fox jumps", "the quick brown fox jumps")).toEqual(["match", "match", "omit", "match", "match"]);
  });
  it("one extra word is one mistake", () => {
    expect(kinds("the quick very brown fox", "the quick brown fox")).toEqual(["match", "match", "extra", "match", "match"]);
  });
  it("a wrong word is a full mistake", () => {
    expect(kinds("the quick crown fox", "the quick brown fox")).toEqual(["match", "match", "full", "match"]);
  });
  it("punctuation and capital letters are half mistakes", () => {
    expect(kinds("The end", "the end.")).toEqual(["half", "half"]);
    expect(kinds("घर है", "घर है।")).toEqual(["match", "half"]);
  });
  it("spacing slips are half mistakes", () => {
    expect(kinds("a bluesky day", "a blue sky day")).toEqual(["match", "merge", "match"]);
    expect(kinds("a note book", "a notebook")).toEqual(["match", "split"]);
  });
  it("untyped words at the end are not counted", () => {
    const r = alignWords(W("one two"), W("one two three four"));
    expect(r.ops.map((o) => o.kind)).toEqual(["match", "match"]);
    expect(r.end).toBe(2);
  });
  it("a word cut off by the timer is not judged", () => {
    expect(kinds("one tw", "one two three", true)).toEqual(["match", "partial"]);
    expect(kinds("one tw", "one two three", false)).toEqual(["match", "full"]);
  });
  it("normalises spaces, digits and NFC", () => {
    expect(splitWords("  क़लम \n १२  ")).toEqual(["क़लम".normalize("NFC"), "12"]);
  });
});

describe("scoring", () => {
  it("computes gross, net, accuracy and KDPH", () => {
    // 10 words, 1 full + 1 half mistake, 250 keystrokes in 5 minutes
    const expected = "a b c d e f g h i j";
    const typed = "a b x d e f g h i J";
    const r = scoreTest({ typed, expected, keystrokes: 250, elapsedMs: 5 * 60000 });
    expect(r.fullMistakes).toBe(1);
    expect(r.halfMistakes).toBe(1);
    expect(r.grossWpm).toBeCloseTo(10); // 250/5/5
    expect(r.netWpm).toBeCloseTo(10 - 1.5 / 5);
    expect(r.accuracy).toBeCloseTo(85);
    expect(r.kdph).toBeCloseTo(3000);
    expect(r.correctWords).toBe(8);
  });
  it("net WPM never goes below zero", () => {
    const r = scoreTest({ typed: "x y z", expected: "a b c", keystrokes: 5, elapsedMs: 60000 });
    expect(r.grossWpm).toBeCloseTo(1);
    expect(r.netWpm).toBe(0);
    expect(r.accuracy).toBe(0);
  });
  it("handles an empty attempt", () => {
    const r = scoreTest({ typed: "", expected: "a b", keystrokes: 0, elapsedMs: 0 });
    expect(r.grossWpm).toBe(0);
    expect(r.accuracy).toBe(0);
  });
});

describe("passages", () => {
  it("has about six original passages per language of 150-300 words", () => {
    expect(passagesFor("english").length).toBeGreaterThanOrEqual(6);
    expect(passagesFor("hindi").length).toBeGreaterThanOrEqual(6);
    for (const p of PASSAGES) {
      const n = splitWords(p.text).length;
      expect(n, p.id).toBeGreaterThanOrEqual(150);
      expect(n, p.id).toBeLessThanOrEqual(300);
    }
    expect(new Set(PASSAGES.map((p) => p.id)).size).toBe(PASSAGES.length);
  });
});
