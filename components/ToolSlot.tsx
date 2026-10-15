import dynamic from "next/dynamic";
import { getDict, type Lang } from "@/i18n";
import type { ExamSpec } from "@/lib/exams/schema";
import { getAllExams } from "@/lib/exams/load";
import type { KeywordPage } from "@/lib/keywords";
import { docOf, type EnabledToolId } from "@/lib/tools/registry";
import { genericToolPath } from "@/lib/routes";
import PrivacyNote from "./PrivacyNote";

// Each tool is its own chunk, so a page only downloads the JavaScript for the tool it shows.
const DocResizer = dynamic(() => import("./tools/DocResizer"));
const AgeCalculator = dynamic(() => import("./tools/AgeCalculator"));
const PdfCompress = dynamic(() => import("./tools/PdfCompress"));
const ImagesToPdf = dynamic(() => import("./tools/ImagesToPdf"));
const PdfMerge = dynamic(() => import("./tools/PdfMerge"));
const PassportSheet = dynamic(() => import("./tools/PassportSheet"));
const ImageConvert = dynamic(() => import("./tools/ImageConvert"));
const TypingTest = dynamic(() => import("./tools/TypingTest"));
const AnswerKey = dynamic(() => import("./tools/AnswerKey"));
const MyForms = dynamic(() => import("./tools/MyForms"));
const Countdown = dynamic(() => import("./tools/Countdown"));
const ResumeMaker = dynamic(() => import("./tools/ResumeMaker"));
const BiodataMaker = dynamic(() => import("./tools/BiodataMaker"));
const LetterMaker = dynamic(() => import("./tools/LetterMaker"));

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
  else if (tool === "image-convert") node = <ImageConvert t={d.convert} preset={preset} />;
  else if (tool === "typing-test") {
    const examModes = getAllExams()
      .filter((e) => e.typing)
      .map((e) => ({ slug: e.slug, name: e.name[lang], typing: e.typing! }));
    node = <TypingTest lang={lang} t={d.typing} examModes={examModes} initialExam={exam?.slug} />;
  } else if (tool === "answer-key") {
    const exams = getAllExams()
      .filter((e) => e.marking)
      .map((e) => ({ slug: e.slug, name: e.name[lang], marking: e.marking! }));
    node = <AnswerKey lang={lang} t={d.answerKey} exams={exams} initialExam={exam?.slug} />;
  } else if (tool === "my-forms") {
    node = <MyForms lang={lang} t={d.myForms} exams={getAllExams().map((e) => ({ slug: e.slug, name: e.name[lang] }))} />;
  } else if (tool === "countdown") node = <Countdown lang={lang} t={d.myForms} trackerHref={genericToolPath(lang, "my-forms")} />;
  else if (tool === "resume-maker") node = <ResumeMaker lang={lang} t={d.docgen} />;
  else if (tool === "biodata-maker") node = <BiodataMaker lang={lang} t={d.docgen} />;
  else node = <LetterMaker lang={lang} t={d.docgen} />;
  return (
    <section aria-label={d.tools[tool].name}>
      {node}
      <PrivacyNote lang={lang} />
    </section>
  );
}
