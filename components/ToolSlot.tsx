import { getDict, type Lang } from "@/i18n";
import type { ExamSpec } from "@/lib/exams/schema";
import { getAllExams } from "@/lib/exams/load";
import type { KeywordPage } from "@/lib/keywords";
import { docOf, type EnabledToolId } from "@/lib/tools/registry";
import { genericToolPath } from "@/lib/routes";
import PrivacyNote from "./PrivacyNote";
import ToolLoader, { type ToolComponent } from "./ToolLoader";

const STUDIO_TABS: Partial<Record<EnabledToolId, "resize" | "crop" | "compress" | "convert" | "rotate" | "text" | "blur">> = {
  "resize-image": "resize",
  "crop-image": "crop",
  "compress-image": "compress",
  "convert-image": "convert",
  "rotate-flip-image": "rotate",
  "add-text-to-image": "text",
  "blur-image": "blur",
};

/**
 * Renders the interactive tool for a page, in exam mode (exam given) or generic mode.
 * Only plain data crosses into the client component: the exam's rules for this one tool.
 */
export default function ToolSlot({ tool, lang, exam, preset }: { tool: EnabledToolId; lang: Lang; exam?: ExamSpec; preset?: KeywordPage["preset"] }) {
  const d = getDict(lang);
  const kind = docOf(tool);
  let node: [ToolComponent, Record<string, unknown>];
  if (kind) {
    node = ["DocResizer", { lang, kind, t: d.tool, docName: d.doc[kind], preset, exam: exam && exam[kind] ? { slug: exam.slug, name: exam.name[lang], spec: exam[kind]!, nameDate: exam.photoWithNameDate } : undefined }];
  } else if (tool === "age-calculator") {
    const exams = getAllExams()
      .filter((e) => e.age)
      .map((e) => ({ slug: e.slug, name: e.name[lang], age: e.age! }));
    node = ["AgeCalculator", { lang, t: d.age, exams, initialExam: exam?.slug }];
  } else if (tool === "pdf-compress") node = ["PdfCompress", { t: d.pdf, preset }];
  else if (tool === "image-to-pdf") node = ["ImagesToPdf", { t: d.pdf }];
  else if (tool === "pdf-merge") node = ["PdfMerge", { t: d.pdf }];
  else if (tool === "passport-photo-sheet") node = ["PassportSheet", { t: d.sheet, tool: d.tool }];
  else if (tool in STUDIO_TABS) node = ["ImageStudio", { lang, t: d.studio, initialTab: STUDIO_TABS[tool], preset }];
  else if (tool === "image-to-text") node = ["ImageToText", { lang, t: d.ocr }];
  else if (tool === "bulk-resize") node = ["BulkResize", { lang, t: d.bulk }];
  else if (tool === "image-convert") node = ["ImageConvert", { t: d.convert, preset: preset?.to === "webp" ? undefined : (preset as { to?: "jpeg" | "png" }) }];
  else if (tool === "typing-test") {
    const examModes = getAllExams()
      .filter((e) => e.typing)
      .map((e) => ({ slug: e.slug, name: e.name[lang], typing: e.typing! }));
    node = ["TypingTest", { lang, t: d.typing, examModes, initialExam: exam?.slug }];
  } else if (tool === "answer-key") {
    const exams = getAllExams()
      .filter((e) => e.marking)
      .map((e) => ({ slug: e.slug, name: e.name[lang], marking: e.marking! }));
    node = ["AnswerKey", { lang, t: d.answerKey, exams, initialExam: exam?.slug }];
  } else if (tool === "my-forms") {
    node = ["MyForms", { lang, t: d.myForms, exams: getAllExams().map((e) => ({ slug: e.slug, name: e.name[lang] })) }];
  } else if (tool === "countdown") node = ["Countdown", { lang, t: d.myForms, trackerHref: genericToolPath(lang, "my-forms") }];
  else if (tool === "resume-maker") node = ["ResumeMaker", { lang, t: d.docgen }];
  else if (tool === "biodata-maker") node = ["BiodataMaker", { lang, t: d.docgen }];
  else node = ["LetterMaker", { lang, t: d.docgen }];
  return (
    <section aria-label={d.tools[tool].name}>
      <ToolLoader name={node[0]} props={node[1]} />
      {/* The image editor shows its own privacy line inside the drop zone. */}
      {!(tool in STUDIO_TABS) && <PrivacyNote lang={lang} />}
    </section>
  );
}
