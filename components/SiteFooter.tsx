import Link from "next/link";
import { getDict, type Lang } from "@/i18n";
import { genericToolPath, homePath } from "@/lib/routes-client";
import { listedTools } from "@/lib/tools/registry";

export default function SiteFooter({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-3xl space-y-3 px-4 py-6 text-sm text-muted">
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href={homePath(lang)} className="py-2">{t.site.home}</Link>
          {listedTools().map((tool) => (
            <Link key={tool.id} href={genericToolPath(lang, tool.id)} className="py-2">
              {t.tools[tool.id].name}
            </Link>
          ))}
        </nav>
        <p>🔒 {t.site.privacy} {t.site.offlineReady}</p>
        <p>{t.site.footer}</p>
        {/* Future: paid "complete document kit (ZIP)" upsell and about/contact links go here. */}
      </div>
    </footer>
  );
}
