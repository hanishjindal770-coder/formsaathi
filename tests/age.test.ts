import { describe, expect, it } from "vitest";
import { ageOn, checkEligibility } from "@/lib/exams/age";
import type { AgeSpec } from "@/lib/exams/schema";
import { parseISODate, type YMD } from "@/lib/date";

const d = (s: string) => parseISODate(s) as YMD;
const spec: AgeSpec = {
  min: 18, max: 32, cutoffDate: "2025-08-01",
  relaxation: { OBC: 3, SC: 5, ST: 5, EWS: 0, PwD: 10, ExSM: 3 },
};

describe("ageOn", () => {
  it("counts completed years, months and days", () => {
    expect(ageOn(d("2000-05-15"), d("2025-08-01"))).toEqual({ years: 25, months: 2, days: 17 });
    expect(ageOn(d("2000-08-01"), d("2025-08-01"))).toEqual({ years: 25, months: 0, days: 0 });
    expect(ageOn(d("2000-08-02"), d("2025-08-01"))).toEqual({ years: 24, months: 11, days: 30 });
  });
  it("borrows days from the previous month correctly", () => {
    expect(ageOn(d("2000-01-31"), d("2025-03-01"))).toEqual({ years: 25, months: 1, days: 1 }); // month completed on 28 Feb
    expect(ageOn(d("2000-01-31"), d("2024-02-29"))).toEqual({ years: 24, months: 1, days: 0 }); // leap year
    expect(ageOn(d("2000-12-15"), d("2025-01-10"))).toEqual({ years: 24, months: 0, days: 26 });
  });
  it("handles 29 February birthdays", () => {
    expect(ageOn(d("2004-02-29"), d("2025-02-27"))).toEqual({ years: 20, months: 11, days: 29 });
    expect(ageOn(d("2004-02-29"), d("2025-02-28"))).toEqual({ years: 21, months: 0, days: 0 });
    expect(ageOn(d("2004-02-29"), d("2025-03-01"))).toEqual({ years: 21, months: 0, days: 1 });
    expect(ageOn(d("2004-02-29"), d("2028-02-29"))).toEqual({ years: 24, months: 0, days: 0 });
  });
  it("returns null for a future date of birth", () => {
    expect(ageOn(d("2026-01-01"), d("2025-08-01"))).toBeNull();
  });
});

describe("checkEligibility", () => {
  const cutoff = d(spec.cutoffDate);
  it("computes the DOB window for 'not exceeding' limits", () => {
    const r = checkEligibility(spec, cutoff, { dob: d("2000-01-01"), category: "GEN" });
    expect(r.latestDob).toEqual(d("2007-08-01"));
    expect(r.earliestDob).toEqual(d("1992-08-02")); // can be 32y 11m 30d
    expect(r.eligible).toBe(true);
  });
  it("is inclusive at both ends", () => {
    expect(checkEligibility(spec, cutoff, { dob: d("2007-08-01"), category: "GEN" }).eligible).toBe(true);
    expect(checkEligibility(spec, cutoff, { dob: d("2007-08-02"), category: "GEN" }).reason).toBe("too-young");
    expect(checkEligibility(spec, cutoff, { dob: d("1992-08-02"), category: "GEN" }).eligible).toBe(true);
    expect(checkEligibility(spec, cutoff, { dob: d("1992-08-01"), category: "GEN" }).reason).toBe("too-old");
  });
  it("applies category relaxation", () => {
    const dob = d("1990-01-01"); // 35y 7m on cutoff
    expect(checkEligibility(spec, cutoff, { dob, category: "GEN" }).eligible).toBe(false);
    expect(checkEligibility(spec, cutoff, { dob, category: "OBC" }).eligible).toBe(true); // up to 35y 11m 30d
    expect(checkEligibility(spec, cutoff, { dob, category: "EWS" }).eligible).toBe(false);
    expect(checkEligibility(spec, cutoff, { dob, category: "SC" }).upperLimit).toBe(37);
  });
  it("stacks PwD (and ExSM) relaxation on the category", () => {
    const r = checkEligibility(spec, cutoff, { dob: d("1980-01-01"), category: "SC", pwd: true });
    expect(r.relaxationYears).toBe(15);
    expect(r.upperLimit).toBe(47);
    expect(r.eligible).toBe(true);
    expect(checkEligibility(spec, cutoff, { dob: d("1990-01-01"), category: "GEN", exServiceman: true }).eligible).toBe(true);
  });
  it("supports UPSC-style 'must not have attained' limits", () => {
    const upsc: AgeSpec = { ...spec, min: 21, max: 32, upperLimitRule: "notAttained" };
    const r = checkEligibility(upsc, cutoff, { dob: d("1993-08-02"), category: "GEN" });
    expect(r.earliestDob).toEqual(d("1993-08-02"));
    expect(r.eligible).toBe(true);
    expect(checkEligibility(upsc, cutoff, { dob: d("1993-08-01"), category: "GEN" }).eligible).toBe(false); // exactly 32
  });
  it("handles a 29 February cutoff date", () => {
    const r = checkEligibility({ ...spec, cutoffDate: "2024-02-29" }, d("2024-02-29"), { dob: d("2006-02-28"), category: "GEN" });
    expect(r.latestDob).toEqual(d("2006-02-28"));
    expect(r.eligible).toBe(true);
  });
});
