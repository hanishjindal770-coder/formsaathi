import Link from "next/link";
import { getDict, type Lang } from "@/i18n";
import { homePath } from "@/lib/routes";
import LangToggle from "./LangToggle";

export default function SiteHeader({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2">
        <Link href={homePath(lang)} className="flex min-h-11 items-center gap-2 text-lg font-semibold text-ink no-underline">
          <img src="/icons/icon.svg" alt="" width={28} height={28} />
          {t.site.name}
        </Link>
        <LangToggle lang={lang} label={t.site.switchTo} aria={t.site.switchToLabel} />
      </div>
    </header>
  );
}
