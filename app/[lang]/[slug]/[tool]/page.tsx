import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fmt, getDict, LOCALES, type Lang } from "@/i18n";
import { getAllExams, getExam } from "@/lib/exams/load";
import { similarExams } from "@/lib/exams/describe";
import { alternates, examPath, examToolParams, examToolPath, homePath, SITE_URL } from "@/lib/routes";
import { examToolFaq, examToolMeta, rejectionKey } from "@/lib/seo/content";
import { TOOLS, toolsForExam, type EnabledToolId } from "@/lib/tools/registry";
import ToolSlot from "@/components/ToolSlot";
import ToolCards from "@/components/ToolCards";
import ExamLinks from "@/components/ExamLinks";
import VerifyBanner from "@/components/VerifyBanner";
import ShareButtons from "@/components/ShareButtons";
import AdSlot from "@/components/AdSlot";
import AffiliateBox from "@/components/AffiliateBox";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import Faq from "@/components/seo/Faq";
import HowTo from "@/components/seo/HowTo";
import { AgeRulesTable, DocRulesTable } from "@/components/seo/RulesTable";

/** Exam × tool × language pages, e.g. /hi/ssc-cgl/photo-resize/. Only generated when the exam has data for the tool. */

type Params = { lang: Lang; slug: string; tool: string };

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => examToolParams().map((p) => ({ lang, slug: p.exam, tool: p.tool })));
}

function load(slug: string, tool: string) {
  const exam = getExam(slug);
  const def = exam && toolsForExam(exam).find((t) => t.id === tool);
  return exam && def ? { exam, toolId: def.id as EnabledToolId } : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug, tool } = await params;
  const p = load(slug, tool);
  if (!p) return {};
  const meta = examToolMeta(p.exam, p.toolId, lang);
  return {
    ...meta,
    alternates: alternates(lang, `${slug}/${tool}/`),
    openGraph: { ...meta, url: `${SITE_URL}/${lang}/${slug}/${tool}/` },
  };
}

export default async function ExamToolPage({ params }: { params: Promise<Params> }) {
  const { lang, slug, tool } = await params;
  const p = load(slug, tool);
  if (!p) notFound();
  const { exam, toolId } = p;
  const d = getDict(lang);
  const name = exam.name[lang];
  const meta = examToolMeta(exam, toolId, lang);
  const kind = TOOLS.find((t) => t.id === toolId)!.doc;
  const otherTools = toolsForExam(exam).filter((t) => t.id !== toolId).map((t) => t.id);
  const similar = similarExams(exam, getAllExams()).filter((e) => toolsForExam(e).some((t) => t.id === toolId));

  return (
    <>
      <Breadcrumbs
        items={[
          { name: d.site.home, href: homePath(lang) },
          { name, href: examPath(lang, slug) },
          { name: d.tools[toolId].name, href: examToolPath(lang, slug, toolId) },
        ]}
      />
      <h1 className="mt-2 text-2xl font-semibold leading-snug">{meta.title}</h1>
      <VerifyBanner exam={exam} lang={lang} />
      <ToolSlot tool={toolId} lang={lang} exam={exam} />
      <HowTo heading={d.seo.howToHeading} name={meta.title} guide={d.guides[toolId]} intro={false} />
      <ShareButtons lang={lang} url={`${SITE_URL}/${lang}/${slug}/${toolId}/`} title={meta.title} />
      <AdSlot position="inline" />

      {kind && <DocRulesTable spec={exam[kind]!} kind={kind} examName={name} lang={lang} nameDate={kind === "photo" && exam.photoWithNameDate} />}
      {toolId === "age-calculator" && <AgeRulesTable age={exam.age!} examName={name} lang={lang} />}
      {rejectionKey(toolId) && (
        <section className="prose-section">
          <h2>{d.seo.rejectionHeading}</h2>
          <ul className="list-disc space-y-1 pl-5">
            {d.seo.rejection[rejectionKey(toolId)!].map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>
      )}
      <Faq heading={d.seo.faqHeading} items={examToolFaq(exam, toolId, lang)} />
      {otherTools.length > 0 && (
        <section className="prose-section">
          <h2>{fmt(d.seo.otherTools, { exam: name })}</h2>
          <ToolCards lang={lang} tools={otherTools} hrefFor={(id) => examToolPath(lang, slug, id)} />
        </section>
      )}
      <ExamLinks heading={d.seo.similarExams} exams={similar} lang={lang} hrefFor={(e) => examToolPath(lang, e.slug, toolId)} />
      <AffiliateBox exam={slug} lang={lang} />
      <AdSlot position="bottom" />
    </>
  );
}
