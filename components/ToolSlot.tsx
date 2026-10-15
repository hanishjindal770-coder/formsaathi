import dynamic from "next/dynamic";
import { getDict, type Lang } from "@/i18n";
import type { ExamSpec } from "@/lib/exams/schema";
import { getAllExams } from "@/lib/exams/load";
import type { KeywordPage } from "@/lib/keywords";
import { docOf, type EnabledToolId } from "@/lib/tools/registry";
import PrivacyNote from "./PrivacyNote";

// Each tool is its own chunk, so a page only downloads the JavaScript for the tool it shows.
const DocResizer = dynamic(() => import("./tools/DocResizer"));
const AgeCalculator = dynamic(() => import("./tools/AgeCalculator"));
const PdfCompress = dynamic(() => import("./tools/PdfCompress"));
const ImagesToPdf = dynamic(() => import("./tools/ImagesToPdf"));
const PdfMerge = dynamic(() => import("./tools/PdfMerge"));
const PassportSheet = dynamic(() => import("./tools/PassportSheet"));
const ImageConvert = dynamic(() => import("./tools/ImageConvert"));

/**
 * Renders the interactive tool for a page, in exam mode (exam given) or generic mode.
 * Only plain data crosses into the client component: the exam's rules for this one tool.
 */
export default function ToolSlot({ tool, lang, exam, preset }: { tool: EnabledToolId; lang: Lang; exam?: ExamSpec; preset?: KeywordPage["preset"] }) {
  const d = getDict(lang);
  const kind = docOf(tool);
  let node: React.ReactNode;
  if (kind) {
    node = (
      <DocResizer
        lang={lang}
        kind={kind}
        t={d.tool}
        docName={d.doc[kind]}
        preset={preset}
        exam={exam && exam[kind] ? { slug: exam.slug, name: exam.name[lang], spec: exam[kind]!, nameDate: exam.photoWithNameDate } : undefined}
      />
    );
  } else if (tool === "age-calculator") {
    const exams = getAllExams()
      .filter((e) => e.age)
      .map((e) => ({ slug: e.slug, name: e.name[lang], age: e.age! }));
    node = <AgeCalculator lang={lang} t={d.age} exams={exams} initialExam={exam?.slug} />;
  } else if (tool === "pdf-compress") node = <PdfCompress t={d.pdf} preset={preset} />;
  else if (tool === "image-to-pdf") node = <ImagesToPdf t={d.pdf} />;
  else if (tool === "pdf-merge") node = <PdfMerge t={d.pdf} />;
  else if (tool === "passport-photo-sheet") node = <PassportSheet t={d.sheet} tool={d.tool} />;
  else node = <ImageConvert t={d.convert} preset={preset} />;
  return (
    <section aria-label={d.tools[tool].name}>
      {node}
      <PrivacyNote lang={lang} />
    </section>
  );
}
