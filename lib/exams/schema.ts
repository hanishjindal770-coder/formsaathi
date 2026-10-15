import { z } from "zod";

/**
 * Exam data schema. Every tool and every SEO page reads exam rules through
 * this schema, so a file that fails validation never reaches the site.
 * See README "Adding a new exam".
 */

export const Bilingual = z.object({ en: z.string().min(1), hi: z.string().min(1) });
export type Bilingual = z.infer<typeof Bilingual>;

/** A pixel value, or an allowed range (e.g. UPSC: 350–1000 px). */
export const PxValue = z.union([
  z.number().int().positive(),
  z.object({ min: z.number().int().positive(), max: z.number().int().positive() }).refine((r) => r.min <= r.max, "min must be <= max"),
]);
export type PxValue = z.infer<typeof PxValue>;

export const DocSpec = z
  .object({
    format: z.array(z.enum(["jpg", "jpeg", "png", "pdf"])).min(1),
    minKB: z.number().positive().optional(),
    maxKB: z.number().positive(),
    widthPx: PxValue.optional(),
    heightPx: PxValue.optional(),
    widthCm: z.number().positive().optional(),
    heightCm: z.number().positive().optional(),
    dpi: z.number().int().positive().optional(),
    background: z.enum(["white", "light", "any"]).optional(),
    notes: Bilingual.optional(),
  })
  .strict()
  .refine((d) => d.minKB === undefined || d.minKB < d.maxKB, { message: "minKB must be less than maxKB" });
export type DocSpec = z.infer<typeof DocSpec>;

export const RELAXATION_KEYS = ["OBC", "SC", "ST", "EWS", "PwD", "ExSM"] as const;
export type RelaxationKey = (typeof RELAXATION_KEYS)[number];

export const AgeSpec = z
  .object({
    min: z.number().int().nonnegative(),
    max: z.number().int().positive(),
    cutoffDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "cutoffDate must be YYYY-MM-DD"),
    relaxation: z.object({
      OBC: z.number().nonnegative(),
      SC: z.number().nonnegative(),
      ST: z.number().nonnegative(),
      EWS: z.number().nonnegative(),
      PwD: z.number().nonnegative(),
      ExSM: z.number().nonnegative(),
    }),
    /**
     * How the upper limit is worded in the notification (extension to the base schema):
     * - "notExceeding" (default): "not more than 32 years" → eligible while completed years <= max,
     *   i.e. until the day before the (max+1)th birthday.
     * - "notAttained": "must not have attained 32 years" (UPSC style) → eligible only while completed years < max.
     */
    upperLimitRule: z.enum(["notExceeding", "notAttained"]).optional(),
    notes: Bilingual.optional(),
  })
  .strict()
  .refine((a) => a.min < a.max, { message: "age.min must be less than age.max" });
export type AgeSpec = z.infer<typeof AgeSpec>;

export const CATEGORIES = ["ssc", "railway", "upsc", "banking", "state", "defence", "teaching", "police", "other"] as const;
export type ExamCategory = (typeof CATEGORIES)[number];

export const ExamSpec = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
    name: Bilingual,
    body: z.string().min(1),
    state: z.string().optional(),
    category: z.enum(CATEGORIES),
    officialSite: z.url(),
    photo: DocSpec.optional(),
    signature: DocSpec.optional(),
    thumb: DocSpec.optional(),
    declaration: DocSpec.optional(),
    photoWithNameDate: z.boolean().optional(),
    combinedPhotoSign: DocSpec.optional(),
    pdfDocs: z
      .array(z.object({ label: Bilingual, minKB: z.number().positive().optional(), maxKB: z.number().positive() }).strict())
      .optional(),
    age: AgeSpec.optional(),
    typing: z
      .object({
        language: z.array(z.enum(["hindi", "english"])).min(1),
        font: z.array(z.enum(["krutidev", "mangal-inscript", "mangal-remington"])).optional(),
        durationMin: z.number().positive(),
        requiredSpeed: z.string().optional(),
      })
      .strict()
      .optional(),
    sourceUrl: z.url(),
    lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "lastVerified must be YYYY-MM-DD"),
    verified: z.boolean(),
    /** Extension: what still needs checking against the official notification. Shown to editors, not users. */
    todo: z.array(z.string()).optional(),
  })
  .strict();
export type ExamSpec = z.infer<typeof ExamSpec>;

export type DocKind = "photo" | "signature" | "thumb" | "declaration";
