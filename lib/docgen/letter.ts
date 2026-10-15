/**
 * General letter formats (application, NOC, self-declaration). These are common formats only,
 * not any department's official format; the UI says so and lets the student edit everything.
 */
import { BLANK, Layout, type Font, type Measure, type Page } from "./layout";
import { DOC_LABELS, docDate, has, type DocLang } from "./labels";

export const LETTER_KINDS = ["application", "nocParent", "nocEmployer", "selfDecl"] as const;
export type LetterKind = (typeof LETTER_KINDS)[number];
export type Gender = "" | "m" | "f";
export type GuardianRelation = "father" | "mother" | "guardian";

/** Fields that feed the template text. */
export type LetterVars = {
  name: string;
  gender: Gender;
  fatherName: string;
  address: string;
  purpose: string;
  guardianName: string;
  guardianRelation: GuardianRelation;
  org: string;
  designation: string;
  employeeId: string;
  since: string;
  age: string;
};

/** The editable text a template produces. */
export type LetterText = { title: string; subject: string; salutation: string; body: string; closing: string };

export type LetterData = LetterVars &
  LetterText & {
    docLang: DocLang;
    kind: LetterKind;
    /** Once the student edits the text, field changes stop overwriting it. */
    edited: boolean;
    to: string;
    signName: string;
    signLines: string;
    place: string;
    date: string;
  };

export const emptyVars = (): LetterVars => ({
  name: "",
  gender: "",
  fatherName: "",
  address: "",
  purpose: "",
  guardianName: "",
  guardianRelation: "father",
  org: "",
  designation: "",
  employeeId: "",
  since: "",
  age: "",
});

const v = (s: string) => (has(s) ? s.trim().replace(/\s*\n\s*/g, ", ") : BLANK);

export function letterTemplate(kind: LetterKind, lang: DocLang, x: LetterVars): LetterText {
  const g = x.gender;
  if (lang === "en") {
    const childOf = g === "m" ? "son of" : g === "f" ? "daughter of" : "son/daughter of";
    const ward = g === "m" ? "son" : g === "f" ? "daughter" : "son/daughter";
    const pron = g === "m" ? "him" : g === "f" ? "her" : "him/her";
    const rel = { father: "father", mother: "mother", guardian: "guardian" }[x.guardianRelation];
    switch (kind) {
      case "application":
        return {
          title: "",
          subject: `Application regarding ${v(x.purpose)}`,
          salutation: "Respected Sir/Madam,",
          body: `I, ${v(x.name)}, ${childOf} ${v(x.fatherName)}, resident of ${v(x.address)}, respectfully submit this application regarding ${v(x.purpose)}.\n\n[Write your request here in two or three short sentences.]\n\nKindly consider my request. I shall be grateful to you.`,
          closing: "Yours faithfully,",
        };
      case "nocParent":
        return {
          title: "NO OBJECTION CERTIFICATE",
          subject: "",
          salutation: "",
          body: `I, ${v(x.guardianName)}, ${rel} of ${v(x.name)}, resident of ${v(x.address)}, hereby state that I have no objection to my ${x.guardianRelation === "guardian" ? "ward" : ward} ${v(x.name)} for the following purpose: ${v(x.purpose)}.\n\nI give my full consent for the same. The above information is true to the best of my knowledge.`,
          closing: "",
        };
      case "nocEmployer":
        return {
          title: "NO OBJECTION CERTIFICATE",
          subject: "",
          salutation: "To Whom It May Concern",
          body: `This is to certify that ${v(x.name)}${has(x.designation) ? `, ${x.designation.trim()}` : ""}${has(x.employeeId) ? ` (Employee ID: ${x.employeeId.trim()})` : ""}, is working in ${v(x.org)}${has(x.since) ? ` since ${docDate(x.since)}` : ""}.\n\nThe organisation has no objection to ${pron} for the following purpose: ${v(x.purpose)}.\n\nThis certificate is issued at the request of the employee.`,
          closing: "",
        };
      case "selfDecl":
        return {
          title: "SELF-DECLARATION",
          subject: "",
          salutation: "",
          body: `I, ${v(x.name)}, ${childOf} ${v(x.fatherName)},${has(x.age) ? ` aged ${x.age.trim()} years,` : ""} resident of ${v(x.address)}, hereby declare that:\n\n${has(x.purpose) ? x.purpose.trim() : "[Write the facts you are declaring here.]"}\n\nI declare that the information given above is true and correct to the best of my knowledge and belief. If any of it is found to be false, I shall be solely responsible.`,
          closing: "",
        };
    }
  }
  // Hindi: verbs agree with the writer's gender, so pick the form when we know it.
  const putra = g === "m" ? "पुत्र" : g === "f" ? "पुत्री" : "पुत्र/पुत्री";
  const karta = g === "m" ? "करता" : g === "f" ? "करती" : "करता/करती";
  const aapka = g === "m" ? "आपका" : g === "f" ? "आपकी" : "आपका/आपकी";
  const rahunga = g === "m" ? "रहूँगा" : g === "f" ? "रहूँगी" : "रहूँगा/रहूँगी";
  switch (kind) {
    case "application":
      return {
        title: "",
        subject: `${v(x.purpose)} के संबंध में प्रार्थना पत्र`,
        salutation: "महोदय/महोदया,",
        body: `सविनय निवेदन है कि मैं ${v(x.name)}, ${putra} श्री ${v(x.fatherName)}, निवासी ${v(x.address)}, ${v(x.purpose)} के संबंध में यह प्रार्थना पत्र प्रस्तुत ${karta} हूँ।\n\n[यहाँ अपना अनुरोध दो-तीन छोटे वाक्यों में लिखें।]\n\nअतः आपसे निवेदन है कि मेरे अनुरोध पर विचार करने की कृपा करें। मैं सदा ${aapka} आभारी ${rahunga}।`,
        closing: g === "m" ? "भवदीय," : g === "f" ? "भवदीया," : "भवदीय/भवदीया,",
      };
    case "nocParent": {
      // Here the writer is the parent/guardian, so the verb follows their relation, not the child's gender.
      const rel = { father: "पिता", mother: "माता", guardian: "अभिभावक" }[x.guardianRelation];
      const pk = x.guardianRelation === "father" ? "करता" : x.guardianRelation === "mother" ? "करती" : "करता/करती";
      const meraWard = x.guardianRelation === "guardian" ? "मेरे संरक्षण में रहने वाले/वाली" : g === "m" ? "मेरे पुत्र" : g === "f" ? "मेरी पुत्री" : "मेरे पुत्र/मेरी पुत्री";
      return {
        title: "अनापत्ति प्रमाण पत्र",
        subject: "",
        salutation: "",
        body: `मैं ${v(x.guardianName)}, ${v(x.name)} ${x.guardianRelation === "mother" ? "की" : "के"} ${rel}, निवासी ${v(x.address)}, यह घोषित ${pk} हूँ कि मुझे ${meraWard} ${v(x.name)} को निम्नलिखित उद्देश्य हेतु कोई आपत्ति नहीं है: ${v(x.purpose)}।\n\nइसके लिए मेरी पूर्ण सहमति है। उपरोक्त जानकारी मेरी जानकारी के अनुसार सत्य है।`,
        closing: "",
      };
    }
    case "nocEmployer":
      return {
        title: "अनापत्ति प्रमाण पत्र",
        subject: "",
        salutation: "जिसके लिए भी यह संबंधित हो",
        body: `प्रमाणित किया जाता है कि ${v(x.name)}${has(x.designation) ? `, ${x.designation.trim()}` : ""}${has(x.employeeId) ? ` (कर्मचारी आईडी: ${x.employeeId.trim()})` : ""}, ${v(x.org)} में${has(x.since) ? ` दिनांक ${docDate(x.since)} से` : ""} कार्यरत हैं।\n\nसंस्था को इन्हें निम्नलिखित उद्देश्य हेतु कोई आपत्ति नहीं है: ${v(x.purpose)}।\n\nयह प्रमाण पत्र कर्मचारी के अनुरोध पर जारी किया जाता है।`,
        closing: "",
      };
    case "selfDecl":
      return {
        title: "स्व-घोषणा पत्र",
        subject: "",
        salutation: "",
        body: `मैं ${v(x.name)}, ${putra} श्री ${v(x.fatherName)},${has(x.age) ? ` आयु ${x.age.trim()} वर्ष,` : ""} निवासी ${v(x.address)}, यह घोषणा ${karta} हूँ कि:\n\n${has(x.purpose) ? x.purpose.trim() : "[यहाँ वह बात लिखें जिसकी आप घोषणा कर रहे हैं।]"}\n\nमैं घोषणा ${karta} हूँ कि ऊपर दी गई जानकारी मेरी जानकारी और विश्वास के अनुसार सत्य और सही है। यदि कोई जानकारी गलत पाई जाती है तो इसकी पूरी जिम्मेदारी मेरी होगी।`,
        closing: "",
      };
  }
}

export function emptyLetter(docLang: DocLang = "hi", kind: LetterKind = "application"): LetterData {
  const vars = emptyVars();
  return { ...vars, ...letterTemplate(kind, docLang, vars), docLang, kind, edited: false, to: "", signName: "", signLines: "", place: "", date: "" };
}

/** Who signs when the student leaves the signature name blank. */
export function defaultSigner(d: LetterData): string {
  if (d.kind === "nocParent") return d.guardianName.trim();
  if (d.kind === "nocEmployer") return d.docLang === "hi" ? "(अधिकृत हस्ताक्षरकर्ता)" : "(Authorised Signatory)";
  return d.name.trim();
}

export function buildLetter(d: LetterData, measure: Measure): Page[] {
  const L = DOC_LABELS[d.docLang].letter;
  const hi = d.docLang === "hi";
  const body: Font = { size: 24 };
  const bold: Font = { size: 24, weight: 600 };
  const lay = new Layout({ measure, margin: { top: 130, right: 120, bottom: 120, left: 120 }, lineHeight: hi ? 1.65 : 1.55 });
  const para = { font: body, gapAfter: 0 };

  if (has(d.title)) {
    lay.text(d.title.trim(), { font: { size: 32, weight: 600 }, align: "center" });
    // Underline the title, roughly its own width.
    const w = Math.min(lay.contentWidth, measure(d.title.trim(), { size: 32, weight: 600 }));
    lay.push({ kind: "line", x1: lay.width / 2 - w / 2, y1: lay.y, x2: lay.width / 2 + w / 2, y2: lay.y, width: 2, color: "#111" });
    lay.space(40);
  }

  const application = d.kind === "application";
  if (application || has(d.to)) {
    lay.text(L.to, { font: bold });
    lay.text(has(d.to) ? d.to.trim() : BLANK, { ...para, indent: 40 });
    lay.space(24);
  }
  if (has(d.subject)) {
    lay.kv(L.subject, d.subject.trim(), { font: bold, labelWidth: measure(L.subject, bold) + 8, sep: "", gapAfter: 24 });
  }
  if (has(d.salutation)) {
    lay.text(d.salutation.trim(), { ...para, gapAfter: 16 });
  }
  lay.text(d.body.trim() || BLANK, { ...para, gapAfter: 30 });

  const signer = has(d.signName) ? d.signName.trim() : defaultSigner(d);
  const right = [
    ...(has(d.closing) ? [d.closing.trim(), ""] : []),
    L.signature,
    ...(signer ? [signer] : []),
    ...d.signLines.split(/\n/).map((s) => s.trim()).filter(Boolean),
  ];
  lay.columns([`${L.place}: ${d.place.trim() || BLANK}`, `${L.date}: ${docDate(d.date) || BLANK}`], right, { font: body, topGap: 30 });
  return lay.pages;
}
