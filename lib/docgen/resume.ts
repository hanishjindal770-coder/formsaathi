import { Layout, type Font, type Measure, type Page } from "./layout";
import { DOC_LABELS, docDate, has, type DocLang } from "./labels";

export type EduRow = { exam: string; board: string; year: string; score: string };
export type ExpRow = { role: string; org: string; period: string; details: string };

export type ResumeData = {
  docLang: DocLang;
  template: "classic" | "modern";
  photo: string; // data URL, "" for none
  name: string;
  phone: string;
  email: string;
  address: string;
  objective: string;
  education: EduRow[];
  experience: ExpRow[];
  skills: string;
  languages: string;
  dob: string;
  father: string;
  gender: string;
  nationality: string;
  permAddress: string;
  declaration: string; // "" = standard line in the document language
  place: string;
  date: string;
};

export const emptyEdu = (): EduRow => ({ exam: "", board: "", year: "", score: "" });
export const emptyExp = (): ExpRow => ({ role: "", org: "", period: "", details: "" });

export const emptyResume = (docLang: DocLang = "hi"): ResumeData => ({
  docLang,
  template: "classic",
  photo: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  objective: "",
  education: [emptyEdu()],
  experience: [],
  skills: "",
  languages: "",
  dob: "",
  father: "",
  gender: "",
  nationality: "",
  permAddress: "",
  declaration: "",
  place: "",
  date: "",
});

/** Splits a skills box on commas or new lines into list items. */
export const listItems = (s: string) => s.split(/[\n,;]+/).map((x) => x.trim()).filter(Boolean);

const INK = "#111";
const MUTED = "#444";

export function buildResume(d: ResumeData, measure: Measure): Page[] {
  const L = DOC_LABELS[d.docLang].resume;
  const hi = d.docLang === "hi";
  const modern = d.template === "modern";
  const accent = modern ? "#1e3a8a" : INK;
  const body: Font = { size: 23 };
  const small: Font = { size: 21 };
  const bold: Font = { size: 23, weight: 600 };
  const head: Font = { size: 27, weight: 600 };
  const lay = new Layout({ measure, margin: { top: modern ? 60 : 100, right: 100, bottom: 100, left: 100 }, lineHeight: hi ? 1.6 : 1.5 });

  const name = d.name.trim() || "—";
  const contact = [has(d.phone) && `${L.phone}: ${d.phone.trim()}`, has(d.email) && `${L.email}: ${d.email.trim()}`].filter(Boolean).join("   |   ");

  if (modern) {
    // Coloured band across the top with name and contact in white.
    const bandH = 230 + (has(d.address) ? 34 : 0);
    lay.push({ kind: "rect", x: 0, y: 0, w: lay.width, h: bandH, fill: accent });
    lay.y = 50;
    lay.text(name, { font: { size: 48, weight: 600 }, color: "#fff" });
    if (contact) lay.text(contact, { font: small, color: "#fff" });
    if (has(d.address)) lay.text(d.address.replace(/\s*\n\s*/g, ", "), { font: small, color: "#dbe4ff" });
    lay.y = bandH + 40;
    if (d.photo) lay.photo("photo", 210, 270);
  } else {
    lay.text(L.title, { font: { size: 22, weight: 600 }, align: "center", color: MUTED, gapAfter: 6 });
    if (d.photo) lay.photo("photo", 210, 270);
    lay.text(name, { font: { size: 44, weight: 600 }, align: d.photo ? "left" : "center" });
    if (contact) lay.text(contact, { font: small, align: d.photo ? "left" : "center", color: MUTED });
    if (has(d.address)) lay.text(d.address.replace(/\s*\n\s*/g, ", "), { font: small, align: d.photo ? "left" : "center", color: MUTED });
    lay.rule({ color: INK, width: 3, gapBefore: 14, gapAfter: 4 });
  }

  const section = (title: string, keep?: number) =>
    lay.heading(modern ? title : hi ? title : title.toUpperCase(), {
      font: head,
      color: accent,
      rule: modern ? undefined : "#999",
      bar: modern ? accent : undefined,
      gapBefore: 22,
      keep,
    });

  if (has(d.objective)) {
    section(L.objective);
    lay.text(d.objective.trim(), { font: body });
  }

  const edu = d.education.filter((r) => has(r.exam) || has(r.board) || has(r.year) || has(r.score));
  if (edu.length) {
    section(L.education);
    lay.table([...L.eduCols], edu.map((r) => [r.exam.trim(), r.board.trim(), r.year.trim(), r.score.trim()]), {
      widths: [0.3, 0.4, 0.13, 0.17],
      font: small,
      headerFont: { size: 21, weight: 600 },
      headerFill: modern ? "#e8edfb" : "#eeeeee",
      align: ["left", "left", "center", "center"],
    });
  }

  const exp = d.experience.filter((r) => has(r.role) || has(r.org) || has(r.details));
  if (exp.length) {
    section(L.experience);
    for (const r of exp) {
      const title = [r.role.trim(), r.org.trim()].filter(Boolean).join(", ");
      lay.text(has(r.period) ? `${title}  (${r.period.trim()})` : title, { font: bold });
      if (has(r.details)) lay.text(r.details.trim(), { font: body, indent: 0, color: MUTED });
      lay.space(8);
    }
  }

  const skills = listItems(d.skills);
  if (skills.length) {
    section(L.skills);
    for (const s of skills) lay.text(`•  ${s}`, { font: body, indent: 10 });
  }
  if (has(d.languages)) {
    section(L.languages);
    lay.text(listItems(d.languages).join(", "), { font: body });
  }

  const personal: [string, string][] = [
    [L.dob, docDate(d.dob)],
    [L.father, d.father.trim()],
    [L.gender, d.gender.trim()],
    [L.nationality, d.nationality.trim()],
    [L.address, d.permAddress.trim().replace(/\s*\n\s*/g, ", ")],
  ];
  const pRows = personal.filter(([, v]) => has(v));
  if (pRows.length) {
    section(L.personal);
    for (const [k, v] of pRows) lay.kv(k, v, { font: body, labelFont: bold, labelWidth: 280 });
  }

  // Keep the declaration, place/date and signature together on one page.
  section(L.declaration, 260);
  lay.text(has(d.declaration) ? d.declaration.trim() : L.declarationText, { font: body });
  lay.columns(
    [`${L.place}: ${d.place.trim() || "________"}`, `${L.date}: ${docDate(d.date) || "________"}`],
    [L.signature, has(d.name) ? `(${d.name.trim()})` : ""],
    { font: body, topGap: 50 },
  );
  return lay.pages;
}
