import { describe, expect, it } from "vitest";
import { allPagePaths, examToolParams, resolveSegment, secondSegmentSlugs, switchLang } from "@/lib/routes";
import { getAllExams } from "@/lib/exams/load";

describe("routes", () => {
  it("exam slugs, tool ids and keyword slugs never collide", () => {
    const slugs = secondSegmentSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("only generates exam tool pages when the exam has data for the tool", () => {
    const exams = Object.fromEntries(getAllExams().map((e) => [e.slug, e]));
    for (const { exam, tool } of examToolParams()) {
      const e = exams[exam];
      if (tool === "photo-resize") expect(e.photo, exam).toBeDefined();
      if (tool === "signature-resize") expect(e.signature, exam).toBeDefined();
      if (tool === "age-calculator") expect(e.age, exam).toBeDefined();
    }
    expect(examToolParams()).not.toContainEqual({ exam: "upsssc-pet", tool: "photo-resize" });
  });
  it("resolves every second-level slug", () => {
    for (const s of secondSegmentSlugs()) expect(resolveSegment(s), s).not.toBeNull();
    expect(resolveSegment("nope")).toBeNull();
  });
  it("paths are unique and end with a slash", () => {
    const paths = allPagePaths();
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of paths) expect(p === "" || p.endsWith("/")).toBe(true);
  });
  it("switches language prefixes", () => {
    expect(switchLang("/hi/ssc-cgl/photo-resize/", "en")).toBe("/en/ssc-cgl/photo-resize/");
    expect(switchLang("/en", "hi")).toBe("/hi");
  });
});
