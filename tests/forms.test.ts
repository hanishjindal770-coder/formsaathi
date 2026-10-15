import { describe, expect, it } from "vitest";
import { addTopics, emptyEntry, mergeForms, sanitize, sortForms, upcomingEvents } from "@/lib/forms/store";

const today = { y: 2026, m: 10, d: 15 };

describe("my forms store", () => {
  it("sanitizes imports and drops junk", () => {
    const out = sanitize({ forms: [{ examName: " SSC CGL ", status: "applied", feePaid: true, examDate: "2026-11-02", lastDate: "2026-02-30" }, { status: "x" }, null, 5] });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ examName: "SSC CGL", status: "applied", feePaid: true, examDate: "2026-11-02" });
    expect(out[0].lastDate).toBeUndefined();
    expect(sanitize("nope")).toEqual([]);
  });

  it("lists upcoming events soonest first and skips past ones", () => {
    const a = { ...emptyEntry("A"), examDate: "2026-12-01", lastDate: "2026-10-01" };
    const b = { ...emptyEntry("B"), admitCardDate: "2026-10-15" };
    const ev = upcomingEvents([a, b], today);
    expect(ev.map((e) => [e.examName, e.field, e.daysLeft])).toEqual([["B", "admitCardDate", 0], ["A", "examDate", 47]]);
    expect(sortForms([a, b, emptyEntry("C")], today).map((f) => f.examName)).toEqual(["B", "A", "C"]);
  });

  it("merges by id and adds topics without duplicates", () => {
    const a = emptyEntry("A");
    expect(mergeForms([a], [{ ...a, examName: "A2" }, emptyEntry("B")]).map((f) => f.examName)).toEqual(["A2", "B"]);
    const list = addTopics([], "1. Algebra\n- Geometry\n\nalgebra\n");
    expect(list.map((c) => c.text)).toEqual(["Algebra", "Geometry"]);
  });
});
