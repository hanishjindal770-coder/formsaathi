/**
 * Words printed INSIDE the generated documents. The document language is picked separately
 * from the site language, so both sets live here rather than in the UI dictionaries.
 */
import { formatDDMMYYYY, parseISODate } from "@/lib/date";

export type DocLang = "hi" | "en";

export const DOC_LABELS = {
  en: {
    resume: {
      title: "RESUME",
      phone: "Mobile",
      email: "Email",
      objective: "Career Objective",
      education: "Educational Qualification",
      eduCols: ["Exam / Degree", "Board / University", "Year", "% / CGPA"],
      experience: "Work Experience",
      skills: "Skills",
      languages: "Languages Known",
      personal: "Personal Details",
      dob: "Date of Birth",
      father: "Father's Name",
      gender: "Gender",
      nationality: "Nationality",
      address: "Address",
      declaration: "Declaration",
      declarationText: "I hereby declare that all the information given above is true and correct to the best of my knowledge and belief.",
      place: "Place",
      date: "Date",
      signature: "Signature",
    },
    biodata: {
      title: "BIODATA",
      personal: "Personal Details",
      name: "Name",
      dob: "Date of Birth",
      birthTime: "Time of Birth",
      birthPlace: "Place of Birth",
      height: "Height",
      religion: "Religion",
      caste: "Caste",
      gotra: "Gotra",
      education: "Education",
      occupation: "Occupation",
      income: "Income",
      family: "Family Details",
      father: "Father",
      mother: "Mother",
      sibling: "Sibling",
      contact: "Contact Details",
      phone: "Mobile",
      address: "Address",
      other: "Other Details",
      photo: "Photo",
    },
    letter: {
      to: "To,",
      subject: "Subject:",
      place: "Place",
      date: "Date",
      signature: "Signature",
    },
  },
  hi: {
    resume: {
      title: "रिज़्यूमे",
      phone: "मोबाइल",
      email: "ईमेल",
      objective: "उद्देश्य",
      education: "शैक्षणिक योग्यता",
      eduCols: ["परीक्षा / डिग्री", "बोर्ड / विश्वविद्यालय", "वर्ष", "प्रतिशत / CGPA"],
      experience: "कार्य अनुभव",
      skills: "कौशल",
      languages: "भाषा ज्ञान",
      personal: "व्यक्तिगत विवरण",
      dob: "जन्म तिथि",
      father: "पिता का नाम",
      gender: "लिंग",
      nationality: "राष्ट्रीयता",
      address: "पता",
      declaration: "घोषणा",
      declarationText: "मैं घोषणा करता/करती हूँ कि ऊपर दी गई सभी जानकारी मेरी जानकारी और विश्वास के अनुसार सत्य और सही है।",
      place: "स्थान",
      date: "दिनांक",
      signature: "हस्ताक्षर",
    },
    biodata: {
      title: "बायोडाटा",
      personal: "व्यक्तिगत विवरण",
      name: "नाम",
      dob: "जन्म तिथि",
      birthTime: "जन्म समय",
      birthPlace: "जन्म स्थान",
      height: "कद",
      religion: "धर्म",
      caste: "जाति",
      gotra: "गोत्र",
      education: "शिक्षा",
      occupation: "व्यवसाय",
      income: "आय",
      family: "पारिवारिक विवरण",
      father: "पिता",
      mother: "माता",
      sibling: "भाई/बहन",
      contact: "संपर्क विवरण",
      phone: "मोबाइल",
      address: "पता",
      other: "अन्य जानकारी",
      photo: "फोटो",
    },
    letter: {
      to: "सेवा में,",
      subject: "विषय:",
      place: "स्थान",
      date: "दिनांक",
      signature: "हस्ताक्षर",
    },
  },
} as const;

/** "2026-10-15" -> "15/10/2026"; anything unparseable is returned as typed. */
export function docDate(iso: string): string {
  const d = parseISODate(iso);
  return d ? formatDDMMYYYY(d) : iso.trim();
}

export const has = (s: string | undefined | null): s is string => !!s && s.trim().length > 0;
