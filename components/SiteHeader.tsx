import Link from "next/link";
import { getDict, type Lang } from "@/i18n";
import { homePath } from "@/lib/routes";
import LangToggle from "./LangToggle";
import ToolMenu from "./ToolMenu";
import { asset } from "@/lib/base";

export default function SiteHeader({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2">
        <Link href={homePath(lang)} className="flex min-h-11 items-center gap-2 text-lg font-semibold text-ink no-underline">
          <img src={asset("/icons/icon.svg")} alt="" width={28} height={28} />
          {t.site.name}
        </Link>
        <div className="flex items-center gap-2">
          <ToolMenu lang={lang} />
          <LangToggle lang={lang} label={t.site.switchTo} aria={t.site.switchToLabel} />
        </div>
      </div>
    </header>
  );
}
