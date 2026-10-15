import Link from "next/link";
import { getDict, type Lang } from "@/i18n";
import { TOOLS, type EnabledToolId } from "@/lib/tools/registry";


export default function ToolCards({ lang, tools, hrefFor }: { lang: Lang; tools: EnabledToolId[]; hrefFor: (t: EnabledToolId) => string }) {
  const t = getDict(lang).tools;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {tools.map((id) => (
        <li key={id}>
          <Link href={hrefFor(id)} className="card flex min-h-20 items-start gap-3 text-ink no-underline hover:border-brand">
            <span aria-hidden className="text-3xl">{TOOLS.find((x) => x.id === id)!.icon}</span>
            <span>
              <span className="block font-semibold text-brand">{t[id].name}</span>
              <span className="block text-sm text-muted">{t[id].desc}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
