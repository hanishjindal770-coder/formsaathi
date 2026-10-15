import { describe, expect, it } from "vitest";
import { articlesB } from "@/lib/articles/content-b";
import { TOOLS } from "@/lib/tools/registry";

const ids = new Set<string>(TOOLS.map((t) => t.id));
const DEVANAGARI = /[ऀ-ॿ]/;

describe("articles B", () => {
  it("has 8 articles with unique slugs", () => {
    expect(articlesB).toHaveLength(8);
    expect(new Set(articlesB.map((a) => a.slug)).size).toBe(8);
  });

  for (const a of articlesB) {
    describe(a.slug, () => {
      it("slug is kebab-case", () => {
        expect(a.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      });
      it("links only valid tools", () => {
        expect(a.tools.length).toBeGreaterThan(0);
        for (const t of a.tools) expect(ids.has(t), t).toBe(true);
      });
      it("has an ISO publish date", () => {
        expect(a.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
      for (const lang of ["en", "hi"] as const) {
        const b = a[lang];
        it(`${lang}: complete body`, () => {
          expect(b.title.trim().length).toBeGreaterThan(0);
          expect(b.intro.trim().length).toBeGreaterThan(0);
          expect(b.description.length, b.description).toBeGreaterThanOrEqual(100);
          expect(b.description.length, b.description).toBeLessThanOrEqual(170);
          expect(b.sections.length).toBeGreaterThanOrEqual(5);
          expect(b.faq.length).toBeGreaterThanOrEqual(4);
          for (const s of b.sections) {
            expect(s.h.trim().length).toBeGreaterThan(0);
            expect(s.p.length).toBeGreaterThanOrEqual(1);
          }
          if (lang === "hi") expect(b.title).toMatch(DEVANAGARI);
        });
        it(`${lang}: no em-dash`, () => {
          expect(JSON.stringify(b)).not.toContain("—");
        });
      }
    });
  }
});
