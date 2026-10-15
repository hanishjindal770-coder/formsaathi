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
  | "thumb-resize"
  | "declaration-resize"
  | "age-calculator"
  | "pdf-compress"
  | "image-to-pdf"
  | "pdf-merge"
  | "passport-photo-sheet"
  | "image-convert"
  | "typing-test"
  | "answer-key"
  | "my-forms"
  | "countdown"
  | "resume-maker"
  | "biodata-maker"
  | "letter-maker";

export type ToolDef = {
  id: ToolId;
  enabled: boolean;
  icon: string;
  /** Which exam document the tool works on (document tools only). */
  doc?: DocKind;
  /** Whether the tool can be set up for a given exam. */
  availableFor: (exam: ExamSpec) => boolean;
  /** Shown on generic (no exam) routes, e.g. /hi/photo-resize. */
  generic: boolean;
};

export const TOOLS: ToolDef[] = [
  { id: "photo-resize", enabled: true, icon: "🖼️", doc: "photo", generic: true, availableFor: (e) => !!e.photo },
  { id: "signature-resize", enabled: true, icon: "✍️", doc: "signature", generic: true, availableFor: (e) => !!e.signature },
  { id: "thumb-resize", enabled: true, icon: "👍", doc: "thumb", generic: true, availableFor: (e) => !!e.thumb },
  { id: "declaration-resize", enabled: true, icon: "📝", doc: "declaration", generic: true, availableFor: (e) => !!e.declaration },
  { id: "age-calculator", enabled: true, icon: "🎂", generic: true, availableFor: (e) => !!e.age },
  { id: "pdf-compress", enabled: true, icon: "🗜️", generic: true, availableFor: (e) => !!e.pdfDocs?.length },
  { id: "image-to-pdf", enabled: true, icon: "📄", generic: true, availableFor: () => false },
  { id: "pdf-merge", enabled: true, icon: "📚", generic: true, availableFor: () => false },
  { id: "passport-photo-sheet", enabled: true, icon: "🖨️", generic: true, availableFor: () => false },
  { id: "image-convert", enabled: true, icon: "🔄", generic: true, availableFor: () => false },
  { id: "typing-test", enabled: true, icon: "⌨️", generic: true, availableFor: (e) => !!e.typing },
  { id: "answer-key", enabled: true, icon: "✅", generic: true, availableFor: (e) => !!e.marking },
  { id: "my-forms", enabled: true, icon: "🗂️", generic: true, availableFor: () => false },
  { id: "countdown", enabled: true, icon: "⏳", generic: true, availableFor: () => false },
  { id: "resume-maker", enabled: true, icon: "📃", generic: true, availableFor: () => false },
  { id: "biodata-maker", enabled: true, icon: "💍", generic: true, availableFor: () => false },
  { id: "letter-maker", enabled: true, icon: "✉️", generic: true, availableFor: () => false },
];

/** Tools that are live on the site (all of them, now that Phase 2 is built). */
export type EnabledToolId = ToolId;

export const enabledTools = () => TOOLS.filter((t) => t.enabled) as (ToolDef & { id: EnabledToolId })[];
export const getTool = (id: string) => enabledTools().find((t) => t.id === id);
export const toolsForExam = (exam: ExamSpec) => enabledTools().filter((t) => t.availableFor(exam));
export const docOf = (id: EnabledToolId) => TOOLS.find((t) => t.id === id)?.doc;
