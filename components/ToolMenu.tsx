import Link from "next/link";
import { getDict, type Lang } from "@/i18n";
import { genericToolPath, homePath } from "@/lib/routes-client";
import { GROUP_ORDER, listedTools, TOOLS } from "@/lib/tools/registry";

/** Header "All tools" menu. A <details> element, so it opens without any JavaScript. */
export default function ToolMenu({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <details className="tool-menu relative">
      <summary className="btn-secondary min-h-11 cursor-pointer list-none px-4 text-sm">☰ {t.nav.menu}</summary>
      <nav className="absolute right-0 z-20 mt-2 max-h-[75vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-line bg-surface p-3 shadow-lg">
        {GROUP_ORDER.map((g) => (
          <div key={g} className="mb-3 last:mb-0">
            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted">{t.nav.groups[g]}</p>
            <ul>
              {listedTools(g).filter((x) => x.generic).map((x) => (
                <li key={x.id}>
                  <Link href={genericToolPath(lang, x.id)} className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-ink no-underline hover:bg-bg">
                    <span aria-hidden>{TOOLS.find((y) => y.id === x.id)!.icon}</span>
                    {t.tools[x.id].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Link href={`${homePath(lang)}#exams`} className="flex min-h-11 items-center gap-2 rounded-lg px-2 font-semibold no-underline hover:bg-bg">🎓 {t.nav.examPresets}</Link>
      </nav>
    </details>
  );
}
