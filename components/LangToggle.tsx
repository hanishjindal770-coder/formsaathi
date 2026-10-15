"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/i18n/config";
import { switchLang } from "@/lib/routes-client";

export default function LangToggle({ lang, label, aria }: { lang: Lang; label: string; aria: string }) {
  const path = usePathname() || `/${lang}/`;
  const other: Lang = lang === "hi" ? "en" : "hi";
  return (
    <Link
      href={switchLang(path, other)}
      hrefLang={other}
      aria-label={aria}
      className="btn-secondary min-h-11 px-4 text-sm"
      onClick={() => {
        try {
          localStorage.setItem("fs:lang", other);
        } catch {}
      }}
    >
      {label}
    </Link>
  );
}
