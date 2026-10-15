import { getDict, fmt, type Lang } from "@/i18n";
import type { ExamSpec } from "@/lib/exams/schema";

/** Shown on every exam page. Unverified data gets a second, stronger warning. */
export default function VerifyBanner({ exam, lang }: { exam: ExamSpec; lang: Lang }) {
  const t = getDict(lang).verify;
  return (
    <div role="note" className="my-4 space-y-2 rounded-xl border border-warn/40 bg-warn-bg p-3 text-sm text-warn">
      <p>
        ℹ️ {t.banner}{" "}
        <a href={exam.sourceUrl} target="_blank" rel="noopener" className="font-semibold text-warn underline">
          {t.open} ↗
        </a>
      </p>
      {exam.livePhoto && <p>{t.livePhoto}</p>}
      {exam.verified ? (
        <p>{fmt(t.lastVerified, { date: exam.lastVerified.split("-").reverse().join("/") })}</p>
      ) : (
        <p className="font-semibold">⚠️ {t.unverified}</p>
      )}
    </div>
  );
}
