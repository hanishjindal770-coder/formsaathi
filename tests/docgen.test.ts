import { describe, expect, it } from "vitest";
import { coverCrop, Layout, pageTexts, PAGE, wrapText, type Measure } from "@/lib/docgen/layout";
import { buildResume, emptyResume, listItems } from "@/lib/docgen/resume";
import { buildBiodata, DEFAULT_HEADING, emptyBiodata } from "@/lib/docgen/biodata";
import { buildLetter, emptyLetter, emptyVars, LETTER_KINDS, letterTemplate } from "@/lib/docgen/letter";
import { docDate } from "@/lib/docgen/labels";

// Fixed-width stand-in for canvas measureText: 0.5em per code point.
const measure: Measure = (s, f) => Array.from(s).length * f.size * 0.5;
const font = { size: 20 };
const all = (pages: { ops: unknown[] }[]) => pageTexts(pages as never).flat().join("\n");

describe("wrapText", () => {
  it("wraps on spaces within the width", () => {
    const lines = wrapText("aaaa bbbb cccc dddd", 100, font, measure); // 10 chars per line
    expect(lines).toEqual(["aaaa bbbb", "cccc dddd"]);
    for (const l of lines) expect(measure(l, font)).toBeLessThanOrEqual(100);
  });
  it("keeps explicit newlines and blank lines", () => {
    expect(wrapText("one\n\ntwo", 500, font, measure)).toEqual(["one", "", "two"]);
  });
  it("never splits a Devanagari word, even when it is too long", () => {
    const word = "प्रतियोगिताओं";
    const lines = wrapText(`क ${word} ख`, 60, font, measure);
    expect(lines).toContain(word);
    expect(lines.join("")).toBe(`क${word}ख`);
  });
  it("keeps Hindi words whole when wrapping a sentence", () => {
    const text = "मैं घोषणा करता हूँ कि ऊपर दी गई सभी जानकारी सत्य है";
    const words = text.split(" ");
    const lines = wrapText(text, 150, font, measure);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.flatMap((l) => l.split(" "))).toEqual(words);
  });
  it("hard-breaks a long Latin token such as an email", () => {
    const lines = wrapText("averyveryverylongemail@example.com", 100, font, measure);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.join("")).toBe("averyveryverylongemail@example.com");
    for (const l of lines) expect(measure(l, font)).toBeLessThanOrEqual(100);
  });
});

describe("coverCrop", () => {
  it("crops a wide image to a portrait box keeping full height", () => {
    const c = coverCrop(400, 300, 100, 150);
    expect(c.sh).toBeCloseTo(300);
    expect(c.sw).toBeCloseTo(200);
    expect(c.sx).toBeCloseTo(100);
  });
  it("crops a tall image keeping full width, biased to the top", () => {
    const c = coverCrop(300, 900, 300, 400);
    expect(c.sw).toBeCloseTo(300);
    expect(c.sh).toBeCloseTo(400);
    expect(c.sy).toBeCloseTo(150);
  });
});

describe("Layout", () => {
  it("breaks pages automatically and keeps content inside the margins", () => {
    const lay = new Layout({ measure, margin: 100 });
    for (let i = 0; i < 120; i++) lay.text(`line ${i}`, { font: { size: 24 } });
    expect(lay.pages.length).toBeGreaterThan(1);
    for (const p of lay.pages)
      for (const op of p.ops) if (op.kind === "text") {
        expect(op.y).toBeGreaterThan(100);
        expect(op.y).toBeLessThan(PAGE.height - 100);
      }
  });
  it("calls onNewPage for every page", () => {
    let calls = 0;
    const lay = new Layout({ measure, margin: 100, onNewPage: () => calls++ });
    lay.newPage();
    expect(calls).toBe(2);
  });
  it("narrows text beside a floated photo and clears it afterwards", () => {
    const lay = new Layout({ measure, margin: 100 });
    lay.photo("photo", 200, 260);
    expect(lay.rightAt(30)).toBeLessThan(lay.right - 200);
    lay.clearFloat();
    expect(lay.rightAt(30)).toBe(lay.right);
    expect(lay.y).toBeGreaterThanOrEqual(100 + 260);
  });
  it("repeats the table header on a new page", () => {
    const lay = new Layout({ measure, margin: 100 });
    const rows = Array.from({ length: 60 }, (_, i) => [`r${i}`, "x"]);
    lay.table(["H1", "H2"], rows, { widths: [0.5, 0.5], font: { size: 24 } });
    expect(lay.pages.length).toBeGreaterThan(1);
    for (const t of pageTexts(lay.pages)) expect(t).toContain("H1");
  });
  it("keeps a heading with the content that follows", () => {
    const lay = new Layout({ measure, margin: 100 });
    lay.y = lay.bottom - 40;
    lay.heading("Heading", { font: { size: 28, weight: 600 } });
    expect(lay.pages.length).toBe(2);
  });
});

describe("resume", () => {
  const d = {
    ...emptyResume("en"),
    name: "Asha Verma",
    phone: "9876543210",
    education: [{ exam: "12th", board: "CBSE", year: "2022", score: "82%" }, { exam: "", board: "", year: "", score: "" }],
    skills: "MS Office, Typing\nTally",
    dob: "2004-03-09",
    place: "Lucknow",
    date: "2026-10-15",
  };
  it("prints sections that have data and skips empty ones", () => {
    const text = all(buildResume(d, measure));
    expect(text).toContain("Asha Verma");
    expect(text).toContain("CBSE");
    expect(text).toContain("09/03/2004");
    expect(text).toContain("15/10/2026");
    expect(text).not.toContain("WORK EXPERIENCE");
    expect(text).toContain("I hereby declare");
  });
  it("uses Hindi labels when the document language is Hindi, in both templates", () => {
    for (const template of ["classic", "modern"] as const) {
      const text = all(buildResume({ ...d, docLang: "hi", template }, measure));
      expect(text).toContain("शैक्षणिक योग्यता");
      expect(text).toContain("घोषणा");
    }
  });
  it("splits skills on commas and lines", () => {
    expect(listItems("a, b\nc;; ")).toEqual(["a", "b", "c"]);
  });
  it("adds an image op only when a photo is given", () => {
    const has = (p: ReturnType<typeof buildResume>) => p[0].ops.some((o) => o.kind === "image");
    expect(has(buildResume(d, measure))).toBe(false);
    expect(has(buildResume({ ...d, photo: "data:x" }, measure))).toBe(true);
  });
});

describe("biodata", () => {
  it("hides blank optional fields and the heading by default", () => {
    const d = { ...emptyBiodata("hi"), name: "राहुल", father: "सुरेश", fatherOcc: "किसान", siblings: [{ relation: "बहन", name: "नेहा", details: "" }] };
    const text = all(buildBiodata(d, measure));
    expect(text).toContain("राहुल");
    expect(text).toContain("सुरेश (किसान)");
    expect(text).toContain("नेहा");
    expect(text).not.toContain("गोत्र");
    expect(text).not.toContain("आय");
    expect(text).not.toContain(DEFAULT_HEADING);
  });
  it("prints the editable top line when switched on, and a border on every page", () => {
    const d = { ...emptyBiodata("en"), showHeading: true, heading: "|| Shri ||", name: "R", other: "x ".repeat(4000) };
    const pages = buildBiodata(d, measure);
    expect(all(pages)).toContain("|| Shri ||");
    expect(pages.length).toBeGreaterThan(1);
    for (const p of pages) expect(p.ops.filter((o) => o.kind === "rect").length).toBeGreaterThanOrEqual(2);
  });
});

describe("letters", () => {
  it("fills every template in both languages and marks missing fields with blanks", () => {
    for (const kind of LETTER_KINDS)
      for (const lang of ["hi", "en"] as const) {
        const t = letterTemplate(kind, lang, { ...emptyVars(), name: "Asha" });
        expect(t.body).toContain("Asha");
        expect(t.body).toContain("____");
        expect(t.body).not.toMatch(/undefined|\{/);
      }
  });
  it("matches Hindi verbs to the writer's gender", () => {
    const f = letterTemplate("selfDecl", "hi", { ...emptyVars(), gender: "f" });
    expect(f.body).toContain("पुत्री");
    expect(f.body).toContain("करती हूँ");
    const m = letterTemplate("application", "hi", { ...emptyVars(), gender: "m" });
    expect(m.body).toContain("करता हूँ");
    expect(m.closing).toBe("भवदीय,");
  });
  it("leaves out optional employer details when blank", () => {
    const t = letterTemplate("nocEmployer", "en", { ...emptyVars(), name: "A", org: "B" });
    expect(t.body).not.toContain("Employee ID");
    expect(t.body).not.toContain("since");
  });
  it("lays out an application with To, subject and signature", () => {
    const d = { ...emptyLetter("en"), name: "Asha", purpose: "fee waiver", to: "The Principal\nGIC", place: "Agra", date: "2026-10-15" };
    Object.assign(d, letterTemplate(d.kind, d.docLang, d));
    const text = all(buildLetter(d, measure));
    expect(text).toContain("To,");
    expect(text).toContain("The Principal");
    expect(text).toContain("Application regarding fee waiver");
    expect(text).toContain("Yours faithfully,");
    expect(text).toContain("Place: Agra");
    expect(text).toContain("Date: 15/10/2026");
  });
  it("prints the NOC title and the parent as signer", () => {
    const d = { ...emptyLetter("hi", "nocParent"), guardianName: "रमेश", name: "सीता" };
    Object.assign(d, letterTemplate(d.kind, d.docLang, d));
    const text = all(buildLetter(d, measure));
    expect(text).toContain("अनापत्ति प्रमाण पत्र");
    expect(text).toContain("रमेश");
  });
});

describe("docDate", () => {
  it("formats ISO dates and keeps other text", () => {
    expect(docDate("2026-01-05")).toBe("05/01/2026");
    expect(docDate("")).toBe("");
    expect(docDate(" 5 Jan ")).toBe("5 Jan");
  });
});
