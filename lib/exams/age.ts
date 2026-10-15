import { addDays, addYears, compareYMD, daysInMonth, type YMD } from "@/lib/date";
import type { AgeSpec } from "./schema";

export type AgeParts = { years: number; months: number; days: number };

/**
 * Exact age on a date in completed years, months and days. Month anniversaries that don't
 * exist are clamped to the month's last day, so someone born on 31 January completes a month
 * on 28/29 February, and someone born on 29 February completes a year on 28 February in
 * non-leap years (matching addYears, which the eligibility window uses).
 * Returns null when `on` is before `dob`.
 */
export function ageOn(dob: YMD, on: YMD): AgeParts | null {
  if (compareYMD(on, dob) < 0) return null;
  let total = (on.y - dob.y) * 12 + (on.m - dob.m);
  if (Math.min(dob.d, daysInMonth(on.y, on.m)) > on.d) total--;
  const anchor = addMonths(dob, total);
  const days = Math.round((Date.UTC(on.y, on.m - 1, on.d) - Date.UTC(anchor.y, anchor.m - 1, anchor.d)) / 86400000);
  return { years: Math.floor(total / 12), months: total % 12, days };
}

function addMonths(a: YMD, months: number): YMD {
  const idx = a.y * 12 + (a.m - 1) + months;
  const y = Math.floor(idx / 12);
  const m = (idx % 12) + 1;
  return { y, m, d: Math.min(a.d, daysInMonth(y, m)) };
}

export const SOCIAL_CATEGORIES = ["GEN", "OBC", "SC", "ST", "EWS"] as const;
export type SocialCategory = (typeof SOCIAL_CATEGORIES)[number];

export type EligibilityInput = { dob: YMD; category: SocialCategory; pwd?: boolean; exServiceman?: boolean };

export type Eligibility = {
  age: AgeParts | null;
  eligible: boolean;
  reason: "too-young" | "too-old" | null;
  /** Upper limit after relaxation, in years. */
  upperLimit: number;
  relaxationYears: number;
  /** Allowed date-of-birth window (inclusive). */
  earliestDob: YMD;
  latestDob: YMD;
  cutoff: YMD;
};

export function relaxationFor(spec: AgeSpec, input: Omit<EligibilityInput, "dob">): number {
  const r = spec.relaxation;
  let years = input.category === "GEN" ? 0 : r[input.category];
  if (input.pwd) years += r.PwD;
  if (input.exServiceman) years += r.ExSM;
  return years;
}

/**
 * Applies an exam's age rule. Eligibility is decided on the date-of-birth window (the way
 * notifications phrase it: "born not before X and not after Y"), so leap years and month
 * lengths are handled the same way the commission does.
 */
export function checkEligibility(spec: AgeSpec, cutoff: YMD, input: EligibilityInput): Eligibility {
  const relaxationYears = relaxationFor(spec, input);
  const upperLimit = spec.max + relaxationYears;
  const latestDob = addYears(cutoff, -spec.min);
  const earliestDob =
    spec.upperLimitRule === "notAttained"
      ? addDays(addYears(cutoff, -upperLimit), 1)
      : addDays(addYears(cutoff, -(upperLimit + 1)), 1);
  const age = ageOn(input.dob, cutoff);
  const reason = compareYMD(input.dob, latestDob) > 0 ? "too-young" : compareYMD(input.dob, earliestDob) < 0 ? "too-old" : null;
  return { age, eligible: reason === null, reason, upperLimit, relaxationYears, earliestDob, latestDob, cutoff };
}
