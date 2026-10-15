import fs from "node:fs";
import path from "node:path";
import { ExamSpec, type DocKind } from "./schema";

/** Server/build-time only: reads and validates every exam file in /data/exams. */

export const EXAMS_DIR = path.join(process.cwd(), "data", "exams");

export type ValidationIssue = { file: string; message: string };

export function loadExamFiles(dir = EXAMS_DIR): { exams: ExamSpec[]; issues: ValidationIssue[] } {
  const exams: ExamSpec[] = [];
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    } catch (e) {
      issues.push({ file, message: `invalid JSON: ${(e as Error).message}` });
      continue;
    }
    const parsed = ExamSpec.safeParse(raw);
    if (!parsed.success) {
      for (const i of parsed.error.issues) issues.push({ file, message: `${i.path.join(".") || "(root)"}: ${i.message}` });
      continue;
    }
    const exam = parsed.data;
    if (file !== `${exam.slug}.json`) issues.push({ file, message: `file name must be ${exam.slug}.json` });
    if (seen.has(exam.slug)) issues.push({ file, message: `duplicate slug ${exam.slug}` });
    seen.add(exam.slug);
    exams.push(exam);
  }
  return { exams, issues };
}

let cache: ExamSpec[] | null = null;

export function getAllExams(): ExamSpec[] {
  if (cache) return cache;
  const { exams, issues } = loadExamFiles();
  if (issues.length) {
    throw new Error("Exam data is invalid:\n" + issues.map((i) => `  ${i.file}: ${i.message}`).join("\n"));
  }
  cache = exams;
  return exams;
}

export function getExam(slug: string): ExamSpec | undefined {
  return getAllExams().find((e) => e.slug === slug);
}

export function examHasDoc(exam: ExamSpec, kind: DocKind): boolean {
  return Boolean(exam[kind]);
}
