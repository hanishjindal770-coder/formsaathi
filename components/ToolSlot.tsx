import { getDict, type Lang } from "@/i18n";
import type { ExamSpec } from "@/lib/exams/schema";
import { getAllExams } from "@/lib/exams/load";
import type { EnabledToolId } from "@/lib/tools/registry";
import { TOOLS } from "@/lib/tools/registry";
import DocResizer from "./tools/DocResizer";
import AgeCalculator from "./tools/AgeCalculator";
import PrivacyNote from "./PrivacyNote";

/**
 * Renders the interactive tool for a page, in exam mode (exam given) or generic mode.
 * Only plain data crosses into the client component: the exam's rules for this one tool.
 */
export default function ToolSlot({ tool, lang, exam, preset }: { tool: EnabledToolId; lang: Lang; exam?: ExamSpec; preset?: { maxKB?: number } }) {
  const d = getDict(lang);
  let node: React.ReactNode;
  if (tool === "age-calculator") {
    const exams = getAllExams()
      .filter((e) => e.age)
      .map((e) => ({ slug: e.slug, name: e.name[lang], age: e.age! }));
    node = <AgeCalculator lang={lang} t={d.age} exams={exams} initialExam={exam?.slug} />;
  } else {
    const kind = TOOLS.find((t) => t.id === tool)!.doc!;
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
  }
  return (
    <section aria-label={d.tools[tool].name}>
      {node}
      <PrivacyNote lang={lang} />
    </section>
  );
}
