import { describe, expect, it } from "vitest";
import { guidesEn, guidesHi, type Guide } from "@/i18n/parts/guides";
import { TOOLS } from "@/lib/tools/registry";

const DEVANAGARI = /[ऀ-ॿ]/;
const langs: [string, Record<string, Guide>][] = [
  ["en", guidesEn],
  ["hi", guidesHi],
];

describe("tool guides", () => {
  for (const [lang, guides] of langs) {
    it(`${lang}: has no guides for unknown tools`, () => {
      const ids = new Set(TOOLS.map((t) => t.id as string));
      expect(Object.keys(guides).filter((k) => !ids.has(k))).toEqual([]);
    });

    for (const { id } of TOOLS) {
      it(`${lang}: ${id} has a complete guide`, () => {
        const g = guides[id];
        expect(g, `missing ${lang} guide for ${id}`).toBeDefined();
        expect(g.intro.trim()).not.toBe("");
        expect(g.steps.length).toBeGreaterThanOrEqual(3);
        expect(g.steps.length).toBeLessThanOrEqual(5);
        expect(g.faq.length).toBeGreaterThanOrEqual(3);
        expect(g.faq.length).toBeLessThanOrEqual(4);
        const texts = [g.intro, ...g.steps, ...g.faq.flatMap((f) => [f.q, f.a])];
        for (const s of texts) expect(s.trim(), `empty string in ${lang} ${id}`).not.toBe("");
        if (lang === "hi") for (const s of texts) expect(s, `no Devanagari in hi ${id}: ${s}`).toMatch(DEVANAGARI);
      });
    }
  }
});
