import type { DocKind, ExamSpec } from "@/lib/exams/schema";

/**
 * Every tool the site knows about. Pages, links and the sitemap are generated from this list,
 * so adding a tool here (with `enabled: true`) is what puts it on the site.
 *
 * A tool is either a document tool (reads exam[doc]) or a data tool (reads another part of the
 * exam, e.g. `age`). `availableFor` decides whether an exam page is generated: no data, no page.
 */
export type ToolId =
  | "photo-resize"
  | "signature-resize"
  | "age-calculator"
  // Phase 1, later sessions:
  | "thumb-resize"
  | "declaration-resize"
  | "photo-name-date"
  | "pdf-compress"
  | "image-to-pdf"
  | "pdf-merge"
  // Phase 2:
  | "answer-key"
  | "typing-test"
  | "my-forms"
  | "countdown";

export type ToolDef = {
  id: ToolId;
  enabled: boolean;
  /** Which exam document the tool works on (document tools only). */
  doc?: DocKind;
  /** Whether the tool can be set up for a given exam. */
  availableFor: (exam: ExamSpec) => boolean;
  /** Shown on generic (no exam) routes, e.g. /hi/photo-resize. */
  generic: boolean;
};

export const TOOLS: ToolDef[] = [
  { id: "photo-resize", enabled: true, doc: "photo", generic: true, availableFor: (e) => !!e.photo },
  { id: "signature-resize", enabled: true, doc: "signature", generic: true, availableFor: (e) => !!e.signature },
  { id: "age-calculator", enabled: true, generic: true, availableFor: (e) => !!e.age },
  { id: "thumb-resize", enabled: false, doc: "thumb", generic: true, availableFor: (e) => !!e.thumb },
  { id: "declaration-resize", enabled: false, doc: "declaration", generic: true, availableFor: (e) => !!e.declaration },
  { id: "photo-name-date", enabled: false, doc: "photo", generic: true, availableFor: (e) => !!e.photo && !!e.photoWithNameDate },
  { id: "pdf-compress", enabled: false, generic: true, availableFor: (e) => !!e.pdfDocs?.length },
  { id: "image-to-pdf", enabled: false, generic: true, availableFor: () => false },
  { id: "pdf-merge", enabled: false, generic: true, availableFor: () => false },
  { id: "answer-key", enabled: false, generic: false, availableFor: () => false },
  { id: "typing-test", enabled: false, generic: true, availableFor: (e) => !!e.typing },
  { id: "my-forms", enabled: false, generic: true, availableFor: () => false },
  { id: "countdown", enabled: false, generic: false, availableFor: () => false },
];

export type EnabledToolId = "photo-resize" | "signature-resize" | "age-calculator";

export const enabledTools = () => TOOLS.filter((t) => t.enabled) as (ToolDef & { id: EnabledToolId })[];
export const getTool = (id: string) => enabledTools().find((t) => t.id === id);
export const toolsForExam = (exam: ExamSpec) => enabledTools().filter((t) => t.availableFor(exam));
