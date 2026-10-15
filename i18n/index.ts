import en, { type Dict } from "./en";
import hi from "./hi";
import type { Lang } from "./config";

export type { Dict };
export * from "./config";

const dicts: Record<Lang, Dict> = { en, hi };
export const getDict = (lang: Lang): Dict => dicts[lang];
