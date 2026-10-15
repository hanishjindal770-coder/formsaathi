import { Layout, type Font, type Measure, type Page } from "./layout";
import { DOC_LABELS, docDate, has, type DocLang } from "./labels";

export type SiblingRow = { relation: string; name: string; details: string };

export type BiodataData = {
  docLang: DocLang;
  showHeading: boolean;
  heading: string;
  photo: string;
  name: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  height: string;
  religion: string;
  caste: string;
  gotra: string;
  education: string;
  occupation: string;
  income: string;
  father: string;
  fatherOcc: string;
  mother: string;
  motherOcc: string;
  siblings: SiblingRow[];
  phone: string;
  address: string;
  other: string;
};

export const DEFAULT_HEADING = "॥ श्री गणेशाय नमः ॥";

export const emptySibling = (): SiblingRow => ({ relation: "", name: "", details: "" });

export const emptyBiodata = (docLang: DocLang = "hi"): BiodataData => ({
  docLang,
  showHeading: false,
  heading: DEFAULT_HEADING,
  photo: "",
  name: "",
  dob: "",
  birthTime: "",
  birthPlace: "",
  height: "",
  religion: "",
  caste: "",
  gotra: "",
  education: "",
  occupation: "",
  income: "",
  father: "",
  fatherOcc: "",
  mother: "",
  motherOcc: "",
  siblings: [],
  phone: "",
  address: "",
  other: "",
});

const MAROON = "#7c2d12";
const INK = "#1f1f1f";

/** "Ramesh Kumar" + "Teacher" -> "Ramesh Kumar (Teacher)". */
const withNote = (a: string, b: string) => (has(b) ? (has(a) ? `${a.trim()} (${b.trim()})` : b.trim()) : a.trim());

export function buildBiodata(d: BiodataData, measure: Measure): Page[] {
  const L = DOC_LABELS[d.docLang].biodata;
  const hi = d.docLang === "hi";
  const body: Font = { size: 24 };
  const label: Font = { size: 24, weight: 600 };
  const head: Font = { size: 28, weight: 600 };
  // Light double border on every page: the traditional look without heavy ornament.
  const border = (page: Page) => {
    page.ops.push({ kind: "rect", x: 40, y: 40, w: 1160, h: 1674, stroke: MAROON, width: 4 });
    page.ops.push({ kind: "rect", x: 54, y: 54, w: 1132, h: 1646, stroke: MAROON, width: 1.5 });
  };
  const lay = new Layout({ measure, margin: { top: 100, right: 110, bottom: 100, left: 110 }, lineHeight: hi ? 1.6 : 1.5, onNewPage: border });

  if (d.showHeading && has(d.heading)) lay.text(d.heading.trim(), { font: { size: 26, weight: 600 }, align: "center", color: MAROON, gapAfter: 4 });
  lay.text(L.title, { font: { size: 38, weight: 600 }, align: "center", color: MAROON });
  // Short centred ornament rule under the title.
  lay.push({ kind: "line", x1: lay.width / 2 - 160, y1: lay.y + 4, x2: lay.width / 2 + 160, y2: lay.y + 4, width: 2, color: MAROON });
  lay.space(30);

  if (d.photo) lay.photo("photo", 270, 345, { border: MAROON });

  const section = (t: string) => lay.heading(t, { font: head, color: MAROON, rule: "#d6b8a8", gapBefore: 20 });
  const rows = (pairs: [string, string][]) => {
    for (const [k, v] of pairs) if (has(v)) lay.kv(k, v.trim().replace(/\s*\n\s*/g, ", "), { font: body, labelFont: label, labelWidth: 290, color: INK });
  };

  section(L.personal);
  rows([
    [L.name, d.name],
    [L.dob, docDate(d.dob)],
    [L.birthTime, d.birthTime],
    [L.birthPlace, d.birthPlace],
    [L.height, d.height],
    [L.religion, d.religion],
    [L.caste, d.caste],
    [L.gotra, d.gotra],
    [L.education, d.education],
    [L.occupation, d.occupation],
    [L.income, d.income],
  ]);

  const sibs = d.siblings.filter((s) => has(s.name) || has(s.details));
  const family: [string, string][] = [
    [L.father, withNote(d.father, d.fatherOcc)],
    [L.mother, withNote(d.mother, d.motherOcc)],
    ...sibs.map((s): [string, string] => [s.relation.trim() || L.sibling, withNote(s.name, s.details)]),
  ];
  if (family.some(([, v]) => has(v))) {
    section(L.family);
    rows(family);
  }

  if (has(d.phone) || has(d.address)) {
    section(L.contact);
    rows([
      [L.phone, d.phone],
      [L.address, d.address],
    ]);
  }

  if (has(d.other)) {
    section(L.other);
    lay.text(d.other.trim(), { font: body, color: INK });
  }
  return lay.pages;
}
