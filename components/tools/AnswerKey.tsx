"use client";
import { useEffect, useMemo, useState } from "react";
import { fmt, type Lang } from "@/i18n/config";
import type { answerKeyEn } from "@/i18n/parts/answerKey";
import { optionLabel, parseInput, type ParseResult } from "@/lib/answerkey/parse";
import { scoreSheet, summaryText, type Marking, type Tally } from "@/lib/answerkey/score";
import { setLastExam } from "@/lib/prefs";
import { FilePick } from "./shared";

export type AnswerKeyExam = { slug: string; name: string; marking: Marking };

type Props = { lang: Lang; t: typeof answerKeyEn; exams: AnswerKeyExam[]; initialExam?: string };

const CUSTOM = "custom";
const validMarking = (m: Marking | undefined): m is Marking =>
  !!m && Number.isFinite(m.correct) && m.correct !== 0 && Number.isFinite(m.wrong);

export default function AnswerKey({ lang, t, exams: allExams, initialExam }: Props) {
  // Only exams that actually carry marking data are offered; otherwise custom is the only choice.
  const exams = useMemo(() => allExams.filter((e) => validMarking(e.marking)), [allExams]);
  const [slug, setSlug] = useState(() =>
    initialExam && exams.some((e) => e.slug === initialExam) ? initialExam : exams.length ? "" : CUSTOM,
  );
  const [plus, setPlus] = useState("");
  const [minus, setMinus] = useState("");
  const [text, setText] = useState("");
  const [source, setSource] = useState(""); // file name, for the "read from" line
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [readError, setReadError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (initialExam) setLastExam(initialExam); }, [initialExam]);

  const exam = exams.find((e) => e.slug === slug);
  const marking: Marking | null = useMemo(() => {
    if (exam) return exam.marking;
    if (slug !== CUSTOM) return null;
    const c = Number(plus.replace(",", "."));
    const w = Number((minus || "0").replace(",", "."));
    return plus && c > 0 && Number.isFinite(w) ? { correct: c, wrong: w } : null;
  }, [exam, slug, plus, minus]);

  const result = useMemo(
    () => (parsed?.ok && marking ? scoreSheet(parsed.questions, marking) : null),
    [parsed, marking],
  );
  // Counts don't depend on marks, so show them even before a marking scheme is picked.
  const counts = useMemo(
    () => (parsed?.ok ? scoreSheet(parsed.questions, { correct: 1, wrong: 0 }) : null),
    [parsed],
  );
  const view = result ?? counts;
  const labels = parsed?.ok ? parsed.labels : "number";

  async function onFile(files: File[]) {
    setReadError(false);
    setCopied(false);
    try {
      const content = await files[0].text();
      setSource(files[0].name);
      setText("");
      setParsed(parseInput(content));
    } catch {
      setReadError(true);
      setParsed(null);
    }
  }

  function check() {
    setReadError(false);
    setCopied(false);
    setSource("");
    setParsed(parseInput(text));
  }

  function clear() {
    setText("");
    setSource("");
    setParsed(null);
    setReadError(false);
    setCopied(false);
  }

  async function copy() {
    if (!result) return;
    const s = summaryText(result, { title: t.summaryTitle, total: t.total, attempted: t.attempted, correct: t.correct, wrong: t.wrong, unattempted: t.unattempted, score: t.score, note: t.estimate, section: t.section }, exam?.name ?? "");
    try {
      await navigator.clipboard.writeText(s);
      setCopied(true);
    } catch {}
  }

  const error = parsed && !parsed.ok
    ? parsed.error === "badLine" ? fmt(t.errors.badLine, { line: parsed.line ?? "?" }) : t.errors[parsed.error]
    : readError ? t.errors.read : "";

  return (
    <div className="space-y-4" lang={lang}>
      <p className="text-sm text-muted">🔒 {t.privacy}</p>

      <div className="card space-y-3">
        <label className="block">
          <span className="text-sm">{t.exam}</span>
          <select className="field mt-1" value={slug} onChange={(e) => setSlug(e.target.value)}>
            {exams.length > 0 && <option value="" disabled>{t.chooseExam}</option>}
            {exams.map((e) => <option key={e.slug} value={e.slug}>{e.name}</option>)}
            <option value={CUSTOM}>{t.custom}</option>
          </select>
        </label>
        {exam && (
          <p className="text-sm text-muted">
            {fmt(t.marksLine, { plus: Math.abs(exam.marking.correct), minus: Math.abs(exam.marking.wrong) })}
            {exam.marking.sections?.length ? <> · {t.sectionRules}</> : null}
          </p>
        )}
        {slug === CUSTOM && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label>{t.plusMarks}<input className="field mt-1" inputMode="decimal" value={plus} onChange={(e) => setPlus(e.target.value)} placeholder="2" /></label>
            <label>{t.minusMarks}<input className="field mt-1" inputMode="decimal" value={minus} onChange={(e) => setMinus(e.target.value)} placeholder="0.5" /></label>
          </div>
        )}
      </div>

      <div className="card space-y-3">
        <details>
          <summary className="min-h-11 cursor-pointer py-2 font-medium">{t.howTitle}</summary>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {t.how.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </details>
        <FilePick label={t.upload} accept=".html,.htm,.mhtml,.mht,text/html,multipart/related,message/rfc822" onFiles={onFile} />
        <label className="block">
          <span className="text-sm">{t.orPaste}</span>
          <textarea className="field mt-1 min-h-32 font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder={t.pastePlaceholder} spellCheck={false} autoCapitalize="off" autoCorrect="off" />
        </label>
        <p className="text-xs text-muted">{t.linesHelp}</p>
        <div className="flex gap-2">
          <button type="button" className="btn-primary min-h-11 flex-1" onClick={check} disabled={!text.trim()}>{t.check}</button>
          <button type="button" className="btn-secondary min-h-11" onClick={clear}>{t.clear}</button>
        </div>
      </div>

      {error && <p className="rounded-xl bg-warn-bg p-3 text-sm text-bad" role="alert">{error}</p>}

      {view && parsed?.ok && (
        <div className="space-y-3" aria-live="polite">
          {source && <p className="text-sm text-muted">{fmt(t.readFrom, { n: parsed.questions.length, name: source })}</p>}
          {!result && <p className="text-sm text-warn">{t.pickMarking}</p>}

          <TallyCard t={t} tally={view.total} title={t.total} showScore={!!result} big />
          {(view.sections.length > 1 || view.sections[0]?.name) &&
            view.sections.map((s) => <TallyCard key={s.name} t={t} tally={s} title={s.name || t.section} showScore={!!result} />)}

          {view.total.noKey > 0 && <p className="text-sm text-warn">{fmt(t.noKeyNote, { n: view.total.noKey })}</p>}

          {view.wrongList.length > 0 && (
            <details className="card">
              <summary className="min-h-11 cursor-pointer py-2 font-medium">{fmt(t.wrongList, { n: view.wrongList.length })}</summary>
              <ul className="divide-y divide-line text-sm">
                {view.wrongList.map((w) => (
                  <li key={`${w.section}-${w.id}`} className="flex flex-wrap items-baseline gap-x-3 py-2">
                    <span className="font-medium">
                      {t.qid} {w.num}
                      {w.id !== w.num && <span className="break-all text-muted"> · ID {w.id}</span>}
                    </span>
                    <span>{t.yourAns}: <b className="text-bad">{optionLabel(w.chosen, labels)}</b></span>
                    <span>{t.rightAns}: <b className="text-ok">{w.correct.map((c) => optionLabel(c, labels)).join(" / ")}</b></span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {result && (
            <button type="button" className="btn-secondary min-h-11 w-full" onClick={copy}>{copied ? `✓ ${t.copied}` : t.copy}</button>
          )}
        </div>
      )}

      <p className="rounded-xl bg-warn-bg p-3 text-sm text-warn">⚠️ {t.estimate}</p>
    </div>
  );
}

function TallyCard({ t, tally, title, showScore, big }: { t: Props["t"]; tally: Tally; title: string; showScore: boolean; big?: boolean }) {
  const cells: [string, number, string][] = [
    [t.attempted, tally.attempted, ""],
    [t.correct, tally.correct, "text-ok"],
    [t.wrong, tally.wrong, "text-bad"],
    [t.unattempted, tally.unattempted, "text-muted"],
  ];
  return (
    <div className={`card space-y-2 ${big ? "border-2 border-line" : ""}`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className={`min-w-0 font-semibold ${big ? "text-lg" : ""}`}>{title}</h3>
        {showScore && (
          <p className="shrink-0 text-right">
            <span className={`${big ? "text-2xl" : "text-xl"} font-semibold`}>{tally.score}</span>
            <span className="text-sm text-muted"> {fmt(t.outOf, { max: tally.maxScore })}</span>
          </p>
        )}
      </div>
      <dl className="grid grid-cols-4 gap-1 text-center">
        {cells.map(([label, n, cls]) => (
          <div key={label}>
            <dt className="text-xs text-muted">{label}</dt>
            <dd className={`text-lg font-semibold ${cls}`}>{n}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
