/** Date helpers that work on calendar dates (YYYY-MM-DD) without timezone surprises. */

export type YMD = { y: number; m: number; d: number };

export function parseISODate(s: string): YMD | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const v = { y: +m[1], m: +m[2], d: +m[3] };
  if (v.m < 1 || v.m > 12 || v.d < 1 || v.d > daysInMonth(v.y, v.m)) return null;
  return v;
}

export const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

export function daysInMonth(y: number, m: number): number {
  return [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

export const toISO = ({ y, m, d }: YMD) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export const formatDDMMYYYY = ({ y, m, d }: YMD, sep = "/") =>
  `${String(d).padStart(2, "0")}${sep}${String(m).padStart(2, "0")}${sep}${y}`;

export function compareYMD(a: YMD, b: YMD): number {
  return a.y - b.y || a.m - b.m || a.d - b.d;
}

/** Adds whole years, clamping 29 Feb to 28 Feb in non-leap years. */
export function addYears(a: YMD, years: number): YMD {
  const y = a.y + years;
  return { y, m: a.m, d: Math.min(a.d, daysInMonth(y, a.m)) };
}

export function addDays(a: YMD, days: number): YMD {
  const t = Date.UTC(a.y, a.m - 1, a.d) + days * 86400000;
  const dt = new Date(t);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

export function todayYMD(): YMD {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() };
}
