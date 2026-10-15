import { getDict, type Lang } from "@/i18n";
import { genericToolPath } from "@/lib/routes-client";
import { GROUP_ORDER, listedTools } from "@/lib/tools/registry";
import ToolCards from "./ToolCards";

/** All generic tools, grouped: image tools first, exam form tools last. */
export default function ToolGrid({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <>
      {GROUP_ORDER.map((g) => {
        const tools = listedTools(g).filter((x) => x.generic).map((x) => x.id);
        return (
          <section key={g} className="prose-section" id={`tools-${g}`}>
            <h2>{t.nav.groups[g]}</h2>
            <ToolCards lang={lang} tools={tools} hrefFor={(id) => genericToolPath(lang, id)} />
          </section>
        );
      })}
    </>
  );
}
