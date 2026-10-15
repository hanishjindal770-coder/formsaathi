import { describe, expect, it } from "vitest";
import { articlesA } from "@/lib/articles/content-a";
import { TOOLS } from "@/lib/tools/registry";

const toolIds = new Set(TOOLS.filter((t) => t.enabled).map((t) => t.id));

describe("articles batch A", () => {
  it("has 8 articles with unique slugs", () => {
    expect(articlesA).toHaveLength(8);
    expect(new Set(articlesA.map((a) => a.slug)).size).toBe(articlesA.length);
  });

  for (const a of articlesA) {
    describe(a.slug, () => {
      it("has a kebab-case slug", () => {
        expect(a.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      });

      it("links only to real tools", () => {
        expect(a.tools.length).toBeGreaterThan(0);
        for (const id of a.tools) expect(toolIds.has(id), id).toBe(true);
      });

      it("has an ISO publish date", () => {
        expect(a.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      for (const lang of ["en", "hi"] as const) {
        it(`${lang} body is complete`, () => {
          const b = a[lang];
          expect(b.title.trim()).not.toBe("");
          expect(b.intro.trim()).not.toBe("");
          expect(b.description.length).toBeGreaterThanOrEqual(100);
          expect(b.description.length).toBeLessThanOrEqual(170);
          expect(b.sections.length).toBeGreaterThanOrEqual(5);
          expect(b.faq.length).toBeGreaterThanOrEqual(4);
          for (const s of b.sections) {
            expect(s.h.trim()).not.toBe("");
            expect(s.p.length).toBeGreaterThan(0);
          }
          for (const f of b.faq) {
            expect(f.q.trim()).not.toBe("");
            expect(f.a.trim()).not.toBe("");
          }
        });

        it(`${lang} has no em-dashes or markup`, () => {
          const text = JSON.stringify(a[lang]);
          expect(text).not.toContain("—");
          expect(text).not.toMatch(/<\/?[a-z][^>]*>|\*\*|\]\(/i);
        });
      }
    });
  }
});
