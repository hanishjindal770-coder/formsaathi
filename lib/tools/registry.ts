import type { DocKind, ExamSpec } from "@/lib/exams/schema";

/**
 * Every tool the site knows about. Pages, links and the sitemap are generated from this list,
 * so adding a tool here (with `enabled: true`) is what puts it on the site.
 *
 * A tool is either a document tool (reads exam[doc]) or a data tool (reads another part of the
 * exam, e.g. `age`). `availableFor` decides whether an exam page is generated: no data, no page.
 */
export type ToolId =
  | "resize-image"
  | "crop-image"
  | "compress-image"
  | "convert-image"
  | "rotate-flip-image"
  | "bulk-resize"
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

/** Where a tool is listed: the home grid and menu show image tools first, exam tools last. */
export type ToolGroup = "image" | "pdf" | "documents" | "exam";

export type ToolDef = {
  id: ToolId;
  enabled: boolean;
  icon: string;
  group: ToolGroup;
  /** Kept as a page (old links, keyword pages) but not shown in the grid or menu. */
  unlisted?: boolean;
  /** Which exam document the tool works on (document tools only). */
  doc?: DocKind;
  /** Whether the tool can be set up for a given exam. */
  availableFor: (exam: ExamSpec) => boolean;
  /** Shown on generic (no exam) routes, e.g. /hi/photo-resize. */
  generic: boolean;
};

export const TOOLS: ToolDef[] = [
  { id: "resize-image", group: "image", enabled: true, icon: "↔️", generic: true, availableFor: () => false },
  { id: "crop-image", group: "image", enabled: true, icon: "✂️", generic: true, availableFor: () => false },
  { id: "compress-image", group: "image", enabled: true, icon: "🗜️", generic: true, availableFor: () => false },
  { id: "convert-image", group: "image", enabled: true, icon: "🔄", generic: true, availableFor: () => false },
  { id: "rotate-flip-image", group: "image", enabled: true, icon: "🔃", generic: true, availableFor: () => false },
  { id: "bulk-resize", group: "image", enabled: true, icon: "📦", generic: true, availableFor: () => false },
  { id: "photo-resize", group: "exam", enabled: true, icon: "🖼️", doc: "photo", generic: true, availableFor: (e) => !!e.photo },
  { id: "signature-resize", group: "exam", enabled: true, icon: "✍️", doc: "signature", generic: true, availableFor: (e) => !!e.signature },
  { id: "thumb-resize", group: "exam", enabled: true, icon: "👍", doc: "thumb", generic: true, availableFor: (e) => !!e.thumb },
  { id: "declaration-resize", group: "exam", enabled: true, icon: "📝", doc: "declaration", generic: true, availableFor: (e) => !!e.declaration },
  { id: "age-calculator", group: "exam", enabled: true, icon: "🎂", generic: true, availableFor: (e) => !!e.age },
  { id: "pdf-compress", group: "pdf", enabled: true, icon: "🗜️", generic: true, availableFor: (e) => !!e.pdfDocs?.length },
  { id: "image-to-pdf", group: "pdf", enabled: true, icon: "📄", generic: true, availableFor: () => false },
  { id: "pdf-merge", group: "pdf", enabled: true, icon: "📚", generic: true, availableFor: () => false },
  { id: "passport-photo-sheet", group: "image", enabled: true, icon: "🖨️", generic: true, availableFor: () => false },
  { id: "image-convert", group: "image", unlisted: true, enabled: true, icon: "🔄", generic: true, availableFor: () => false },
  { id: "typing-test", group: "exam", enabled: true, icon: "⌨️", generic: true, availableFor: (e) => !!e.typing },
  { id: "answer-key", group: "exam", enabled: true, icon: "✅", generic: true, availableFor: (e) => !!e.marking },
  { id: "my-forms", group: "documents", enabled: true, icon: "🗂️", generic: true, availableFor: () => false },
  { id: "countdown", group: "documents", enabled: true, icon: "⏳", generic: true, availableFor: () => false },
  { id: "resume-maker", group: "documents", enabled: true, icon: "📃", generic: true, availableFor: () => false },
  { id: "biodata-maker", group: "documents", enabled: true, icon: "💍", generic: true, availableFor: () => false },
  { id: "letter-maker", group: "documents", enabled: true, icon: "✉️", generic: true, availableFor: () => false },
];

/** Tools that are live on the site (all of them, now that Phase 2 is built). */
export type EnabledToolId = ToolId;

export const enabledTools = () => TOOLS.filter((t) => t.enabled) as (ToolDef & { id: EnabledToolId })[];
export const GROUP_ORDER: ToolGroup[] = ["image", "pdf", "documents", "exam"];
export const listedTools = (group?: ToolGroup) => enabledTools().filter((t) => !t.unlisted && (!group || t.group === group));
export const getTool = (id: string) => enabledTools().find((t) => t.id === id);
export const toolsForExam = (exam: ExamSpec) => enabledTools().filter((t) => t.availableFor(exam));
export const docOf = (id: EnabledToolId) => TOOLS.find((t) => t.id === id)?.doc;
