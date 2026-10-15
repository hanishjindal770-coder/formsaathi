import { fmt, getDict, type Lang } from "@/i18n";
import { docRulesSummary } from "@/lib/exams/describe";
import type { ExamSpec } from "@/lib/exams/schema";
import type { FaqItem } from "@/components/seo/Faq";
import type { EnabledToolId } from "@/lib/tools/registry";
import { docOf } from "@/lib/tools/registry";

/** Titles, descriptions and FAQs for programmatic pages, generated from exam data. */

export function examToolRules(exam: ExamSpec, tool: EnabledToolId, lang: Lang): string {
  if (tool === "age-calculator") {
    const a = exam.age!;
    return lang === "hi" ? `${a.min}–${a.max} वर्ष` : `${a.min}–${a.max} years`;
  }
  if (tool === "pdf-compress") return (exam.pdfDocs ?? []).map((p) => `${p.label[lang]}: ≤ ${p.maxKB} KB`).join(", ");
  const doc = docOf(tool);
  return doc && exam[doc] ? docRulesSummary(exam[doc]!, lang) : "";
}

export function examToolMeta(exam: ExamSpec, tool: EnabledToolId, lang: Lang) {
  const t = getDict(lang).tools[tool];
  // Titles use the English exam name in both languages: that's what students type ("SSC CGL फोटो साइज़").
  return {
    title: fmt(t.examTitle, { exam: exam.name.en }),
    description: fmt(t.examDesc, { exam: exam.name[lang], rules: examToolRules(exam, tool, lang) }),
  };
}

export function examToolFaq(exam: ExamSpec, tool: EnabledToolId, lang: Lang): FaqItem[] {
  const d = getDict(lang);
  const f = d.seo.faq;
  const examName = exam.name[lang];
  const items: FaqItem[] = [];
  if (tool === "age-calculator") {
    const a = exam.age!;
    const r = a.relaxation;
    items.push({
      q: fmt(f.ageLimit.q, { exam: examName }),
      a: fmt(f.ageLimit.a, { min: a.min, max: a.max, cutoff: a.cutoffDate.split("-").reverse().join("/"), obc: r.OBC, sc: r.SC, pwd: r.PwD }),
    });
    items.push({ q: fmt(f.ageHow.q, { exam: examName }), a: fmt(f.ageHow.a, { exam: examName }) });
    return items;
  }
  const kind = docOf(tool);
  if (!kind) return [{ q: f.privacy.q, a: f.privacy.a }];
  const doc = d.doc[kind];
  const spec = exam[kind]!;
  items.push({ q: fmt(f.docSize.q, { exam: examName, doc }), a: fmt(f.docSize.a, { doc, rules: docRulesSummary(spec, lang) }) + (spec.notes ? ` ${spec.notes[lang]}` : "") });
  items.push({ q: fmt(f.docTool.q, { exam: examName, doc }), a: fmt(f.docTool.a, { exam: examName }) });
  items.push({ q: f.privacy.q, a: f.privacy.a });
  return items;
}

/** Which "common rejection reasons" list a tool page shows, if any. */
export function rejectionKey(tool: EnabledToolId): "photo" | "signature" | "thumb" | "declaration" | "age" | "pdf" | null {
  if (tool === "age-calculator") return "age";
  if (tool === "pdf-compress") return "pdf";
  return docOf(tool) ?? null;
}
