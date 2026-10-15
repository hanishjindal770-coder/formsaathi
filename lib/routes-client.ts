import type { Lang } from "@/i18n/config";

/** Pure URL builders, safe to import from client components. See lib/routes.ts for the full map. */
export const homePath = (lang: Lang) => `/${lang}/`;
export const examPath = (lang: Lang, exam: string) => `/${lang}/${exam}/`;
export const examToolPath = (lang: Lang, exam: string, tool: string) => `/${lang}/${exam}/${tool}/`;
export const genericToolPath = (lang: Lang, tool: string) => `/${lang}/${tool}/`;

/** Swaps the language prefix of a path. */
export const switchLang = (path: string, to: Lang) => path.replace(/^\/(hi|en)(?=\/|$)/, `/${to}`);
