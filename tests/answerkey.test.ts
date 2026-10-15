import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseHtmlString, textOf, clean } from "@/lib/answerkey/html";
import { optionNumber, parseInput, parseLines, parseResponseSheet } from "@/lib/answerkey/parse";
import { scoreSheet, sectionMarking, summaryText } from "@/lib/answerkey/score";

const fixture = (f: string) => readFileSync(path.join(__dirname, "fixtures/answerkey", f), "utf8");
const ok = <T extends { ok: boolean }>(r: T) => {
  if (!r.ok) throw new Error(`parse failed: ${JSON.stringify(r)}`);
  return r as Extract<T, { ok: true }>;
};

describe("mini html parser", () => {
  it("handles entities, void tags, unclosed cells and skips scripts", () => {
    const root = parseHtmlString(`<script>var s="<td>";</script><table><tr><td>a&amp;b<td>c<img alt="pic"><br>d</table>`);
    expect(clean(textOf(root))).toBe("a&b c pic d");
    const tds: string[] = [];
    const walk = (n: typeof root) => { if (n.tag === "td") tds.push(clean(textOf(n))); n.children.forEach(walk); };
    walk(root);
    expect(tds).toEqual(["a&b", "c pic d"]);
  });
});

describe("digialm response sheet", () => {
  const r = ok(parseInput(fixture("ssc-sample.html")));

  it("reads every question with sections, ids and chosen options", () => {
    expect(r.source).toBe("digialm");
    expect(r.questions).toHaveLength(10);
    expect(r.questions.map((q) => q.section)).toEqual([
      ...Array(4).fill("General Intelligence and Reasoning"),
      ...Array(4).fill("General Awareness"),
      ...Array(2).fill("Quantitative Aptitude"),
    ]);
    expect(r.questions[0]).toMatchObject({ id: "6306801001", num: "1", options: 4, chosen: 2, correct: [2], status: "Answered" });
    expect(r.questions[2]).toMatchObject({ chosen: null, correct: [4] }); // "--", image options
    expect(r.questions[4].correct).toEqual([1, 3]); // two rightAns cells
    expect(r.questions[5]).toMatchObject({ chosen: 4, status: "Marked For Review" });
    expect(r.questions[7].correct).toEqual([]);
  });

  it("scores with negative marking and per-section rules", () => {
    const res = scoreSheet(r.questions, { correct: 2, wrong: 0.5, sections: [{ name: "Quantitative aptitude", correct: 3, wrong: -1 }] });
    const [gi, ga, qa] = res.sections;
    expect(gi).toMatchObject({ attempted: 3, correct: 2, wrong: 1, unattempted: 1, score: 3.5, maxScore: 8 });
    expect(ga).toMatchObject({ attempted: 3, correct: 1, wrong: 1, unattempted: 1, noKey: 1, score: 1.5 });
    expect(qa).toMatchObject({ plus: 3, minus: 1, correct: 1, wrong: 1, score: 2, maxScore: 6 });
    expect(res.total).toMatchObject({ total: 10, attempted: 8, correct: 4, wrong: 3, unattempted: 2, noKey: 1, score: 7, maxScore: 22 });
    expect(res.wrongList.map((w) => [w.id, w.chosen, w.correct])).toEqual([
      ["6306801002", 1, [3]],
      ["6306802002", 4, [2]],
      ["6306803001", 3, [1]],
    ]);
  });

  it("is tolerant of Hindi labels, odd class casing and missing sections", () => {
    const h = ok(parseResponseSheet(fixture("hindi-sample.html")));
    expect(h.questions.map((q) => [q.id, q.chosen, q.correct, q.section])).toEqual([
      ["9001", 2, [2], ""],
      ["9002", 1, [3], ""],
      ["9003", null, [1], ""],
    ]);
    expect(scoreSheet(h.questions, { correct: 1, wrong: 1 / 3 }).total.score).toBe(0.67);
  });

  it("unwraps an Android .mhtml save (quoted-printable)", () => {
    const html = fixture("hindi-sample.html");
    const qp = Buffer.from(html, "utf8").toString("latin1").replace(/[=\x80-\xff]/g, (c) => "=" + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"))
      .replace(/(.{70})/g, "$1=\r\n");
    const mhtml = `From: <Saved by Blink>\r\nSubject: Response\r\nMIME-Version: 1.0\r\nContent-Type: multipart/related;\r\n\ttype="text/html";\r\n\tboundary="----MultipartBoundary--abc----"\r\n\r\n------MultipartBoundary--abc----\r\nContent-Type: text/html\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\n${qp}\r\n------MultipartBoundary--abc------\r\n`;
    const r = ok(parseInput(mhtml));
    expect(r.questions.map((q) => q.id)).toEqual(["9001", "9002", "9003"]);
  });

  it("explains that copied page text has no answer key", () => {
    expect(parseInput("Q.1 Which ... Question ID : 123 Status : Answered Chosen Option : 2")).toEqual({ ok: false, error: "textNoKey" });
    expect(parseInput("<html><body><p>Hello</p></body></html>")).toEqual({ ok: false, error: "noQuestions" });
    expect(parseInput("  ")).toEqual({ ok: false, error: "empty" });
  });
});

describe("plain lines format", () => {
  it("parses letters, numbers, unattempted, multiple correct and sections", () => {
    const r = ok(parseLines("# Reasoning\n1 B C\n2. a a\nQ3 - D\n\nSection: Maths\n4,2,2\n5 | x | 1/3\n6 C b&c"));
    expect(r.labels).toBe("letter");
    expect(r.questions.map((q) => [q.num, q.section, q.chosen, q.correct])).toEqual([
      ["1", "Reasoning", 2, [3]],
      ["2", "Reasoning", 1, [1]],
      ["3", "Reasoning", null, [4]],
      ["4", "Maths", 2, [2]],
      ["5", "Maths", null, [1, 3]],
      ["6", "Maths", 3, [2, 3]],
    ]);
    const s = scoreSheet(r.questions, { correct: 1, wrong: 0.25 });
    expect(s.total).toMatchObject({ correct: 3, wrong: 1, unattempted: 2, score: 2.75 });
  });

  it("reports the first bad line", () => {
    expect(parseLines("1 A B\n2 A")).toEqual({ ok: false, error: "badLine", line: 2 });
    expect(parseLines("1 Z B")).toEqual({ ok: false, error: "badLine", line: 1 });
  });

  it("maps option labels", () => {
    expect([optionNumber("B"), optionNumber("(3)"), optionNumber("Option 4"), optionNumber("--")]).toEqual([2, 3, 4, null]);
  });
});

describe("marking + summary", () => {
  it("falls back to exam-wide marks when no section matches", () => {
    expect(sectionMarking({ correct: 2, wrong: -0.5, sections: [{ name: "English", wrong: 0 }] }, "Reasoning")).toEqual({ plus: 2, minus: 0.5 });
    expect(sectionMarking({ correct: 2, wrong: -0.5, sections: [{ name: "English", wrong: 0 }] }, "English Language")).toEqual({ plus: 2, minus: 0 });
  });

  it("builds a copyable summary", () => {
    const r = ok(parseLines("1 A A\n2 B A\n3 - C"));
    const txt = summaryText(scoreSheet(r.questions, { correct: 2, wrong: 0.5 }), { title: "Score", total: "Total", attempted: "Att", correct: "R", wrong: "W", unattempted: "NA", score: "Marks", note: "Estimate", section: "Section" }, "SSC CGL");
    expect(txt).toBe("Score – SSC CGL\nTotal: Att 2/3 · R 1 · W 1 · NA 1 · Marks 1.5/6\nEstimate");
  });
});
