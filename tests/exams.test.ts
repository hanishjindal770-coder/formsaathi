import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadExamFiles } from "@/lib/exams/load";
import { ExamSpec } from "@/lib/exams/schema";

describe("exam data", () => {
  const { exams, issues } = loadExamFiles();

  it("every file in data/exams passes the schema", () => {
    expect(issues).toEqual([]);
    expect(exams.length).toBeGreaterThanOrEqual(15);
  });

  it("unverified exams carry a todo list so editors know what to check", () => {
    for (const e of exams.filter((x) => !x.verified)) expect(e.todo?.length, e.slug).toBeGreaterThan(0);
  });

  it("KB ranges and dimensions are sane", () => {
    for (const e of exams) {
      for (const doc of [e.photo, e.signature, e.thumb, e.declaration]) {
        if (!doc) continue;
        expect(doc.maxKB).toBeLessThanOrEqual(5000);
        const hasPx = doc.widthPx !== undefined && doc.heightPx !== undefined;
        const hasCm = doc.widthCm !== undefined && doc.heightCm !== undefined;
        expect(hasPx || hasCm, `${e.slug} needs px or cm dimensions`).toBe(true);
      }
    }
  });
});

describe("schema validation", () => {
  const valid = {
    slug: "test-exam", name: { en: "Test", hi: "टेस्ट" }, body: "X", category: "ssc",
    officialSite: "https://example.gov.in", sourceUrl: "https://example.gov.in/n.pdf", lastVerified: "2026-01-01", verified: false,
  };
  it("accepts a minimal exam", () => {
    expect(ExamSpec.safeParse(valid).success).toBe(true);
  });
  it("rejects unknown keys, bad slugs and inverted ranges", () => {
    expect(ExamSpec.safeParse({ ...valid, colour: "red" }).success).toBe(false);
    expect(ExamSpec.safeParse({ ...valid, slug: "SSC CGL" }).success).toBe(false);
    expect(ExamSpec.safeParse({ ...valid, photo: { format: ["jpg"], minKB: 50, maxKB: 20 } }).success).toBe(false);
    expect(ExamSpec.safeParse({ ...valid, photo: { format: ["jpg"], maxKB: 20, widthPx: { min: 500, max: 100 } } }).success).toBe(false);
    expect(ExamSpec.safeParse({ ...valid, age: { min: 18, max: 30, cutoffDate: "1/8/2025", relaxation: {} } }).success).toBe(false);
  });
  it("reports file-level problems from the loader", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "exams-"));
    fs.writeFileSync(path.join(dir, "wrong-name.json"), JSON.stringify(valid));
    fs.writeFileSync(path.join(dir, "broken.json"), "{");
    const { issues } = loadExamFiles(dir);
    expect(issues.map((i) => i.file).sort()).toEqual(["broken.json", "wrong-name.json"]);
  });
});
