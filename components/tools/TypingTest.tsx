"use client";
import { useCallback, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fmt, type Lang } from "@/i18n/config";
import type { typingEn } from "@/i18n/parts/typing";
import { krutidevToUnicode, unicodeToKrutidev } from "@/lib/typing/krutidev";
import {
  KEY_ROWS, LAYOUTS_FOR, chartLabel, inscriptChar, layoutFromFont, unicodeToInscriptKeys, usesKrutidevKeys,
  type ExamFont, type LayoutId, type TypingLanguage,
} from "@/lib/typing/layouts";
import { alignWords, isFull, loadHistory, saveHistory, scoreTest, splitWords, type HistoryEntry, type TypingResult } from "@/lib/typing/metrics";
import { passagesFor } from "@/lib/typing/passages";
import { setLastExam } from "@/lib/prefs";

export type TypingExamMode = {
  slug: string;
  name: string;
  typing: { language: TypingLanguage[]; font?: ExamFont[]; durationMin: number; requiredSpeed?: string };
};

type Props = { lang: Lang; t: typeof typingEn; examModes?: TypingExamMode[]; initialExam?: string };
type Phase = "ready" | "running" | "done";

const DURATIONS = [2, 5, 10, 15];
const CUSTOM = "custom";

const mmss = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const r1 = (n: number) => (Math.round(n * 10) / 10).toString();

export default function TypingTest({ lang, t, examModes = [], initialExam }: Props) {
  const [examSlug, setExamSlug] = useState(() => (examModes.some((e) => e.slug === initialExam) ? initialExam! : ""));
  const exam = examModes.find((e) => e.slug === examSlug);

  const [language, setLanguage] = useState<TypingLanguage>(lang === "hi" ? "hindi" : "english");
  const [layout, setLayout] = useState<LayoutId>(lang === "hi" ? "krutidev" : "qwerty");
  const [durationMin, setDurationMin] = useState(10);
  const [passageId, setPassageId] = useState(() => passagesFor(lang === "hi" ? "hindi" : "english")[0].id);
  const [customText, setCustomText] = useState("");
  const [customKrutidev, setCustomKrutidev] = useState(false);
  const [allowBackspace, setAllowBackspace] = useState(true);
  const [highlight, setHighlight] = useState(true);
  const [showErrors, setShowErrors] = useState(true);
  const [showChart, setShowChart] = useState(false);

  const [phase, setPhase] = useState<Phase>("ready");
  const [raw, setRaw] = useState("");
  const [startAt, setStartAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [result, setResult] = useState<TypingResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const passageBox = useRef<HTMLDivElement>(null);
  const outBox = useRef<HTMLDivElement>(null);
  const caret = useRef<number | null>(null);

  useEffect(() => setHistory(loadHistory()), []);
  useEffect(() => { if (initialExam) setLastExam(initialExam); }, [initialExam]);

  // Exam data decides language, layout and time; the student can still pick among what the exam allows.
  const allowedLanguages: TypingLanguage[] = exam ? exam.typing.language : ["hindi", "english"];
  const allowedLayouts: LayoutId[] =
    language === "hindi" && exam?.typing.font?.length ? [...new Set(exam.typing.font.map(layoutFromFont))] : LAYOUTS_FOR[language];

  const reset = useCallback(() => {
    setPhase("ready");
    setRaw("");
    setStartAt(null);
    setResult(null);
  }, []);

  const pickLanguage = (l: TypingLanguage, lay?: LayoutId) => {
    setLanguage(l);
    setLayout(lay ?? LAYOUTS_FOR[l][l === "hindi" ? 2 : 0]);
    if (passageId !== CUSTOM) setPassageId(passagesFor(l)[0].id);
    reset();
  };

  const pickExam = (slug: string) => {
    setExamSlug(slug);
    const e = examModes.find((x) => x.slug === slug);
    if (e) {
      const l = e.typing.language[0];
      pickLanguage(l, l === "hindi" && e.typing.font?.length ? layoutFromFont(e.typing.font[0]) : undefined);
      setDurationMin(e.typing.durationMin);
    } else reset();
  };
  // apply an exam passed in the URL once
  useEffect(() => { if (examSlug) pickExam(examSlug); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const passages = passagesFor(language);
  const expectedText = useMemo(() => {
    if (passageId === CUSTOM) return customKrutidev ? krutidevToUnicode(customText) : customText;
    return (passages.find((p) => p.id === passageId) ?? passages[0]).text;
  }, [passageId, customText, customKrutidev, passages]);
  const expWords = useMemo(() => splitWords(expectedText), [expectedText]);

  const krutiKeys = usesKrutidevKeys(layout);
  const typed = krutiKeys ? krutidevToUnicode(raw) : raw;
  const keystrokes = krutiKeys ? raw.length : [...raw].length;
  const durationMs = durationMin * 60000;
  const elapsed = startAt ? Math.min(durationMs, now - startAt) : 0;

  // Live comparison is a word-level edit distance; deferring keeps keystrokes snappy on slow phones.
  const deferredTyped = useDeferredValue(typed);
  const live = useMemo(() => {
    const words = splitWords(deferredTyped);
    const endsInSpace = /\s$/.test(deferredTyped);
    const a = alignWords(words, expWords, { partialLast: !endsInSpace });
    const status = new Map<number, "ok" | "bad" | "half">();
    for (const o of a.ops) {
      if (o.kind === "extra" || o.kind === "partial") continue;
      const s = o.kind === "match" ? "ok" : isFull(o.kind) ? "bad" : "half";
      status.set(o.ei, s);
      if (o.kind === "merge") status.set(o.ei + 1, s);
    }
    let current = a.end;
    const last = a.ops[a.ops.length - 1];
    if (!endsInSpace && last && last.kind !== "extra" && last.kind !== "omit") {
      current = last.kind === "merge" ? last.ei + 1 : last.ei;
      status.delete(current);
    }
    const finished = a.end === expWords.length && expWords.length > 0 && !!last && (endsInSpace ? last.kind !== "extra" : last.kind === "match");
    return { status, current, finished, count: words.length };
  }, [deferredTyped, expWords]);

  const latest = useRef({ typed, keystrokes, startAt });
  latest.current = { typed, keystrokes, startAt };

  const finish = useCallback((byTime: boolean) => {
    const { typed: tx, keystrokes: ks, startAt: st } = latest.current;
    if (!st) return;
    const el = Math.min(durationMs, Date.now() - st);
    const res = scoreTest({ typed: tx, expected: expectedText, keystrokes: ks, elapsedMs: el, partialLast: byTime });
    setResult(res);
    setPhase("done");
    setHistory(saveHistory({
      at: new Date().toISOString(), language, layout, durationMin, exam: exam?.slug,
      grossWpm: +r1(res.grossWpm), netWpm: +r1(res.netWpm), accuracy: +r1(res.accuracy), kdph: Math.round(res.kdph),
      full: res.fullMistakes, half: res.halfMistakes,
    }));
  }, [durationMs, expectedText, language, layout, durationMin, exam?.slug]);

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [phase]);
  useEffect(() => {
    if (phase === "running" && startAt && now - startAt >= durationMs) finish(true);
  }, [now, phase, startAt, durationMs, finish]);
  useEffect(() => {
    if (phase === "running" && live.finished && deferredTyped === typed) finish(false);
  }, [live.finished, phase, deferredTyped, typed, finish]);

  // Keep the current word in view inside the passage box without scrolling the page.
  useEffect(() => {
    const box = passageBox.current;
    const el = box?.querySelector<HTMLElement>(`[data-i="${live.current}"]`);
    if (!box || !el) return;
    if (el.offsetTop < box.scrollTop || el.offsetTop + el.offsetHeight > box.scrollTop + box.clientHeight)
      box.scrollTop = Math.max(0, el.offsetTop - box.clientHeight / 3);
  }, [live.current]);
  useEffect(() => { if (outBox.current) outBox.current.scrollTop = outBox.current.scrollHeight; }, [typed]);

  useLayoutEffect(() => {
    if (caret.current !== null && inputRef.current) {
      inputRef.current.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  });

  const begin = () => {
    if (phase === "ready") {
      const n = Date.now();
      setStartAt(n);
      setNow(n);
      setPhase("running");
    }
  };

  const onChange = (v: string) => {
    if (phase === "done") return;
    if (!allowBackspace && v.length < raw.length) return; // blocks deletes that slip past keydown (phones)
    if (v) begin();
    setRaw(v);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (phase === "done") return;
    if (!allowBackspace && (e.key === "Backspace" || e.key === "Delete")) { e.preventDefault(); return; }
    if (layout !== "inscript" || e.ctrlKey || e.metaKey || e.altKey || e.nativeEvent.isComposing) return;
    // Phones with a Hindi keyboard send Unicode (and no usable code), so only physical keys are mapped.
    const ch = inscriptChar(e.code, e.shiftKey);
    if (!ch) return;
    e.preventDefault();
    const el = e.currentTarget;
    const s = el.selectionStart, en = el.selectionEnd;
    caret.current = s + ch.length;
    begin();
    setRaw(raw.slice(0, s) + ch + raw.slice(en));
  };

  // A phone's soft keyboard often reports Backspace only through beforeinput.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const h = (e: InputEvent) => { if (!allowBackspace && e.inputType.startsWith("delete")) e.preventDefault(); };
    el.addEventListener("beforeinput", h);
    return () => el.removeEventListener("beforeinput", h);
  }, [allowBackspace]);

  const nextPassage = () => {
    const i = passages.findIndex((p) => p.id === passageId);
    setPassageId(passages[(i + 1) % passages.length].id);
    reset();
  };

  const currentWord = expWords[Math.min(live.current, expWords.length - 1)] ?? "";
  const wordKeys = language === "hindi" && currentWord
    ? (krutiKeys ? unicodeToKrutidev(currentWord) : layout === "inscript" ? unicodeToInscriptKeys(currentWord) : "")
    : "";
  const liveWpm = elapsed > 3000 ? r1(keystrokes / 5 / (elapsed / 60000)) : "–";
  const best = history.filter((h) => h.layout === layout).reduce((m, h) => Math.max(m, h.netWpm), 0);
  const durations = [...new Set([...DURATIONS, ...(exam ? [exam.typing.durationMin] : [])])].sort((a, b) => a - b);
  const locked = phase === "running";
  const textLang = language === "hindi" ? "hi" : "en";

  const chip = (on: boolean) => `min-h-11 rounded-full border px-4 text-sm ${on ? "border-brand bg-brand text-brand-ink" : "border-line"}`;

  return (
    <div className="space-y-4">
      <fieldset className="card space-y-4" disabled={locked}>
        {examModes.length > 0 && (
          <label className="block">
            <span className="text-sm">{t.exam}</span>
            <select className="field mt-1" value={examSlug} onChange={(e) => pickExam(e.target.value)}>
              <option value="">{t.practice}</option>
              {examModes.map((e) => <option key={e.slug} value={e.slug}>{e.name}</option>)}
            </select>
          </label>
        )}
        {exam && (
          <div className="rounded-xl bg-warn-bg p-3 text-sm">
            {exam.typing.requiredSpeed && <p className="font-semibold">{fmt(t.requiredSpeed, { speed: exam.typing.requiredSpeed })}</p>}
            <p className="text-muted">{t.examNote}</p>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-sm">{t.language}</span>
          <div className="flex flex-wrap gap-2">
            {allowedLanguages.map((l) => (
              <button key={l} type="button" aria-pressed={language === l} className={chip(language === l)} onClick={() => pickLanguage(l, exam && l === "hindi" && exam.typing.font?.length ? layoutFromFont(exam.typing.font[0]) : undefined)}>
                {t.languages[l]}
              </button>
            ))}
          </div>
        </div>

        {language === "hindi" && (
          <label className="block">
            <span className="text-sm">{t.layout}</span>
            <select className="field mt-1" value={layout} onChange={(e) => { setLayout(e.target.value as LayoutId); reset(); }}>
              {allowedLayouts.map((l) => <option key={l} value={l}>{t.layouts[l]}</option>)}
            </select>
          </label>
        )}
        <p className="text-sm text-muted">{t.layoutHelp[layout]}</p>

        <div className="space-y-2">
          <span className="text-sm">{t.duration}</span>
          <div className="flex flex-wrap gap-2">
            {durations.map((d) => (
              <button key={d} type="button" aria-pressed={durationMin === d} className={chip(durationMin === d)} onClick={() => { setDurationMin(d); reset(); }}>
                {fmt(t.minutes, { n: d })}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="text-sm">{t.passage}</span>
          <select className="field mt-1" value={passageId} onChange={(e) => { setPassageId(e.target.value); reset(); }}>
            {passages.map((p) => <option key={p.id} value={p.id}>{p.title[lang]}</option>)}
            <option value={CUSTOM}>{t.custom}</option>
          </select>
        </label>
        {passageId === CUSTOM && (
          <div className="space-y-2">
            <textarea className="field min-h-28 py-2" lang={textLang} value={customText} placeholder={t.customPlaceholder} onChange={(e) => { setCustomText(e.target.value); reset(); }} />
            {language === "hindi" && (
              <label className="flex min-h-11 items-center gap-3 text-sm">
                <input type="checkbox" className="h-5 w-5" checked={customKrutidev} onChange={(e) => { setCustomKrutidev(e.target.checked); reset(); }} />
                {t.customIsKrutidev}
              </label>
            )}
          </div>
        )}

        <fieldset className="space-y-1">
          <legend className="text-sm">{t.options}</legend>
          {([[allowBackspace, setAllowBackspace, t.allowBackspace], [highlight, setHighlight, t.highlight], [showErrors, setShowErrors, t.showErrors]] as const).map(([v, set, label]) => (
            <label key={label} className="flex min-h-11 items-center gap-3">
              <input type="checkbox" className="h-5 w-5" checked={v} onChange={(e) => set(e.target.checked)} />
              {label}
            </label>
          ))}
        </fieldset>
      </fieldset>

      <section className="card space-y-3">
        <div className="flex h-12 items-center justify-between gap-2 tabular-nums" aria-live="off">
          <div><div className="text-xs text-muted">{t.timeLeft}</div><div className="text-lg font-semibold">{mmss(durationMs - elapsed)}</div></div>
          <div className="text-center"><div className="text-xs text-muted">{t.words}</div><div className="text-lg font-semibold">{live.count}</div></div>
          <div className="text-right"><div className="text-xs text-muted">{t.speed}</div><div className="text-lg font-semibold">{liveWpm} <span className="text-xs font-normal">{t.wpm}</span></div></div>
        </div>

        <div ref={passageBox} lang={textLang} className="relative h-44 overflow-y-auto rounded-xl border border-line p-3 text-lg leading-relaxed">
          {expWords.map((w, i) => {
            const st = live.status.get(i);
            const isCur = highlight && phase !== "done" && i === live.current;
            const cls = isCur
              ? "rounded bg-brand text-brand-ink"
              : showErrors && st === "bad" ? "text-bad underline decoration-2"
              : showErrors && st === "half" ? "text-warn underline decoration-dotted"
              : st ? "text-muted" : "";
            return <span key={i}><span data-i={i} className={`px-0.5 ${cls}`}>{w}</span> </span>;
          })}
        </div>

        {language === "hindi" && (
          <div className="space-y-2">
            <div className="flex min-h-11 flex-wrap items-center justify-between gap-2">
              <button type="button" className="min-h-11 text-sm font-semibold text-brand underline" aria-expanded={showChart} onClick={() => setShowChart(!showChart)}>
                {showChart ? t.hideChart : t.showChart}
              </button>
              {showChart && wordKeys && (
                <span className="text-sm">{fmt(t.wordKeys, { word: currentWord })} <kbd className="rounded border border-line px-1.5 font-mono">{wordKeys}</kbd></span>
              )}
            </div>
            {showChart && <KeyChart layout={layout} t={t} />}
          </div>
        )}

        {krutiKeys && (
          <div>
            <div className="text-xs text-muted">{t.yourText}</div>
            <div ref={outBox} lang="hi" className="h-24 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-line bg-bg p-2 text-lg">{typed}</div>
          </div>
        )}

        <label className="block">
          <span className="text-xs text-muted">{krutiKeys ? t.rawKeys : t.typeHere}{!allowBackspace && ` · ${t.backspaceOff}`}</span>
          <textarea
            ref={inputRef}
            lang={krutiKeys ? "en" : textLang}
            rows={4}
            className={`field mt-1 h-28 resize-none py-2 ${krutiKeys ? "font-mono text-base" : "text-lg"}`}
            value={raw}
            readOnly={phase === "done"}
            placeholder={t.startHint}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="btn-primary" disabled={phase !== "running"} onClick={() => finish(false)}>{t.submit}</button>
          <button type="button" className="btn-secondary" onClick={reset}>{t.reset}</button>
        </div>
      </section>

      {result && <ResultCard r={result} t={t} textLang={textLang} onNext={nextPassage} />}

      <section className="card space-y-2">
        <h2 className="font-semibold">{t.history}</h2>
        {history.length === 0 ? <p className="text-sm text-muted">{t.noHistory}</p> : (
          <>
            {best > 0 && <p className="text-sm font-semibold text-ok">{t.layouts[layout]} · {fmt(t.best, { wpm: best })}</p>}
            <ul className="divide-y divide-line text-sm">
              {history.slice(0, 5).map((h) => (
                <li key={h.at} className="flex justify-between gap-2 py-1.5 tabular-nums">
                  <span className="min-w-0 truncate">{new Date(h.at).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN")} · {t.layouts[h.layout as LayoutId] ?? h.layout} · {fmt(t.minutes, { n: h.durationMin })}</span>
                  <span className="shrink-0 font-semibold">{h.netWpm} {t.wpm} · {h.accuracy}%</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="text-xs text-muted">{t.savedLocal}</p>
      </section>
    </div>
  );
}

function KeyChart({ layout, t }: { layout: LayoutId; t: typeof typingEn }) {
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <div className="w-max space-y-1">
          {KEY_ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-1" style={{ paddingLeft: ri * 10 }}>
              {[...row.normal].map((k, i) => {
                const s = row.shift[i];
                return (
                  <div key={k} className="flex h-14 w-10 flex-col items-center justify-between rounded-md border border-line py-0.5 text-center leading-none">
                    <span className="self-start pl-1 font-mono text-[10px] text-muted">{k}</span>
                    <span lang="hi" className="text-base">{chartLabel(layout, k, false, k)}</span>
                    <span lang="hi" className="text-[11px] text-muted">{chartLabel(layout, s, true, k)}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted">{t.chartShift}. {layout === "inscript" ? t.chartNoteInscript : t.chartNoteKrutidev}</p>
    </div>
  );
}

function ResultCard({ r, t, textLang, onNext }: { r: TypingResult; t: typeof typingEn; textLang: string; onNext: () => void }) {
  const wrong = r.ops.filter((o) => o.kind !== "match" && o.kind !== "partial");
  const stat = (label: string, value: string, big = false) => (
    <div className="rounded-xl border border-line p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className={`${big ? "text-2xl" : "text-lg"} font-semibold tabular-nums`}>{value}</div>
    </div>
  );
  return (
    <section className="card space-y-3" aria-live="polite">
      <h2 className="text-lg font-semibold">{t.result}</h2>
      <div className="grid grid-cols-2 gap-2">
        {stat(t.netWpm, `${r1(r.netWpm)} ${t.wpm}`, true)}
        {stat(t.accuracy, `${r1(r.accuracy)}%`, true)}
        {stat(t.grossWpm, `${r1(r.grossWpm)} ${t.wpm}`)}
        {stat(t.kdph, String(Math.round(r.kdph)))}
        {stat(t.fullMistakes, String(r.fullMistakes))}
        {stat(t.halfMistakes, String(r.halfMistakes))}
        {stat(t.keystrokes, String(r.keystrokes))}
        {stat(t.timeTaken, mmss(r.minutes * 60000))}
      </div>
      <details className="rounded-xl border border-line p-3 text-sm">
        <summary className="min-h-8 cursor-pointer font-semibold">{t.how}</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">{t.howLines.map((l) => <li key={l}>{l}</li>)}</ul>
      </details>
      <div className="space-y-2">
        <h3 className="font-semibold">{t.mistakes}</h3>
        {wrong.length === 0 ? <p className="text-ok">{t.noMistakes}</p> : (
          <ul lang={textLang} className="max-h-72 divide-y divide-line overflow-y-auto rounded-xl border border-line text-sm">
            {wrong.map((o, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 p-2">
                <span className={`text-xs ${isFull(o.kind) ? "text-bad" : "text-warn"}`}>{t.kinds[o.kind as keyof typeof t.kinds]}</span>
                {o.expected && <span><span className="text-xs text-muted">{t.expected}: </span>{o.expected}</span>}
                {o.typed && <span><span className="text-xs text-muted">{t.typed}: </span><span className="line-through decoration-bad">{o.typed}</span></span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="button" className="btn-secondary w-full" onClick={onNext}>{t.nextPassage}</button>
    </section>
  );
}
