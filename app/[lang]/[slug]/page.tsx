import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fmt, getDict, LOCALES, type Lang } from "@/i18n";
import { getAllExams, getExam } from "@/lib/exams/load";
import { similarExams } from "@/lib/exams/describe";
import { getKeywordPage, KEYWORD_PAGES, keywordVars } from "@/lib/keywords";
import { rejectionKey } from "@/lib/seo/content";
import { alternates, examPath, examToolPath, genericToolPath, homePath, resolveSegment, secondSegmentSlugs, SITE_URL } from "@/lib/routes";
import { getTool, toolsForExam, type EnabledToolId } from "@/lib/tools/registry";
import ToolSlot from "@/components/ToolSlot";
import ToolCards from "@/components/ToolCards";
import ExamLinks from "@/components/ExamLinks";
import VerifyBanner from "@/components/VerifyBanner";
import ShareButtons from "@/components/ShareButtons";
import AdSlot from "@/components/AdSlot";
import AffiliateBox from "@/components/AffiliateBox";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import Faq from "@/components/seo/Faq";
import { AgeRulesTable, DocRulesTable } from "@/components/seo/RulesTable";

/**
 * Second-level pages. One dynamic segment serves three page types (see lib/routes.ts):
 * exam hubs (/hi/ssc-cgl/), generic tools (/hi/photo-resize/) and keyword pages
 * (/hi/resize-image-to-20kb/).
 */

type Params = { lang: Lang; slug: string };

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => secondSegmentSlugs().map((slug) => ({ lang, slug })));
}

function pageInfo(lang: Lang, slug: string) {
  const seg = resolveSegment(slug);
  const d = getDict(lang);
  if (!seg) return null;
  if (seg.type === "exam") {
    const exam = getExam(slug)!;
    const name = exam.name[lang];
    return { seg, title: `${exam.name.en} — ${d.tools["photo-resize"].name}, ${d.tools["signature-resize"].name}, ${d.tools["age-calculator"].name}`, h1: name, description: fmt(d.seo.examTools, { exam: name }) + ". " + d.site.tagline };
  }
  if (seg.type === "tool") {
    const tool = getTool(slug)!;
    return { seg, title: d.tools[tool.id].name, h1: d.tools[tool.id].name, description: d.tools[tool.id].desc + " " + d.site.privacy };
  }
  const k = getKeywordPage(slug)!;
  const kt = d.keyword[k.kind];
  const vars = keywordVars(k);
  return { seg, title: fmt(kt.title, vars), h1: fmt(kt.title, vars), description: fmt(kt.desc, vars) };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const info = pageInfo(lang, slug);
  if (!info) return {};
  return {
    title: info.title,
    description: info.description,
    alternates: alternates(lang, `${slug}/`),
    openGraph: { title: info.title, description: info.description, url: `${SITE_URL}/${lang}/${slug}/` },
  };
}

export default async function SecondLevelPage({ params }: { params: Promise<Params> }) {
  const { lang, slug } = await params;
  const info = pageInfo(lang, slug);
  if (!info) notFound();
  const d = getDict(lang);
  const url = `${SITE_URL}/${lang}/${slug}/`;
  const home = { name: d.site.home, href: homePath(lang) };

  if (info.seg.type === "exam") {
    const exam = getExam(slug)!;
    const tools = toolsForExam(exam).map((t) => t.id);
    const name = exam.name[lang];
    return (
      <>
        <Breadcrumbs items={[home, { name, href: examPath(lang, slug) }]} />
        <h1 className="mt-2 text-2xl font-semibold">{name}</h1>
        <VerifyBanner exam={exam} lang={lang} />
        <ToolCards lang={lang} tools={tools} hrefFor={(id) => examToolPath(lang, slug, id)} />
        {exam.photo && <DocRulesTable spec={exam.photo} kind="photo" examName={name} lang={lang} nameDate={exam.photoWithNameDate} />}
        {exam.signature && <DocRulesTable spec={exam.signature} kind="signature" examName={name} lang={lang} />}
        {exam.thumb && <DocRulesTable spec={exam.thumb} kind="thumb" examName={name} lang={lang} />}
        {exam.declaration && <DocRulesTable spec={exam.declaration} kind="declaration" examName={name} lang={lang} />}
        {exam.age && <AgeRulesTable age={exam.age} examName={name} lang={lang} />}
        <AdSlot position="inline" />
        <ExamLinks heading={d.seo.similarExams} exams={similarExams(exam, getAllExams())} lang={lang} hrefFor={(e) => examPath(lang, e.slug)} />
        <AffiliateBox exam={slug} lang={lang} />
        <ShareButtons lang={lang} url={url} title={info.title} />
      </>
    );
  }

  const toolId = (info.seg.type === "tool" ? slug : getKeywordPage(slug)!.tool) as EnabledToolId;
  const keyword = info.seg.type === "keyword" ? getKeywordPage(slug)! : null;
  const examsWithTool = getAllExams().filter((e) => toolsForExam(e).some((t) => t.id === toolId));
  return (
    <>
      <Breadcrumbs items={[home, { name: info.h1, href: genericToolPath(lang, slug) }]} />
      <h1 className="mt-2 text-2xl font-semibold">{info.h1}</h1>
      <p className="mb-4 text-muted">{info.description}</p>
      <ToolSlot tool={toolId} lang={lang} preset={keyword?.preset} />
      <ShareButtons lang={lang} url={url} title={info.h1} />
      <AdSlot position="inline" />
      <ExamLinks heading={d.seo.popularExams} exams={examsWithTool} lang={lang} hrefFor={(e) => examToolPath(lang, e.slug, toolId)} />
      {keyword && (
        <section className="prose-section">
          <h2>{d.keyword.otherSizes}</h2>
          <ul className="flex flex-wrap gap-2">
            {KEYWORD_PAGES.filter((k) => k.kind === keyword.kind && k.slug !== slug).map((k) => (
              <li key={k.slug}>
                <Link href={genericToolPath(lang, k.slug)} className="btn-secondary min-h-10 px-3 text-sm">{fmt(d.keyword[k.kind].title, keywordVars(k))}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {rejectionKey(toolId) && rejectionKey(toolId) !== "age" && (
        <section className="prose-section">
          <h2>{d.seo.rejectionHeading}</h2>
          <ul className="list-disc space-y-1 pl-5">
            {d.seo.rejection[rejectionKey(toolId)!].map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>
      )}
      <Faq heading={d.seo.faqHeading} items={[{ q: d.seo.faq.privacy.q, a: d.seo.faq.privacy.a }]} />
      <AdSlot position="bottom" />
    </>
  );
}
