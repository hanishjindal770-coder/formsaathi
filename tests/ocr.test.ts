import { describe, expect, it } from "vitest";
import { cleanOcrText, defaultOcrLang, firstRunMB, txtName } from "@/lib/ocr/clean";

describe("cleanOcrText", () => {
  it("joins English words hyphenated across lines", () => {
    expect(cleanOcrText("The exam-\nination is on Monday")).toBe("The examination is on Monday");
    expect(cleanOcrText("appli-  \r\n  cation")).toBe("application");
  });
  it("keeps hyphens that are not word breaks", () => {
    expect(cleanOcrText("Covid-\n19")).toBe("Covid-\n19");
    expect(cleanOcrText("Part A -\nPart B")).toBe("Part A -\nPart B");
    expect(cleanOcrText("SSC-\nCGL")).toBe("SSC-\nCGL");
    expect(cleanOcrText("well-known")).toBe("well-known");
  });
  it("does not touch Hindi line ends", () => {
    expect(cleanOcrText("परीक्षा-\nकेंद्र")).toBe("परीक्षा-\nकेंद्र");
  });
  it("turns a bar after Hindi into a danda", () => {
    expect(cleanOcrText("यह मेरा नाम है |\nअगली")).toBe("यह मेरा नाम है।\nअगली");
    expect(cleanOcrText("a | b")).toBe("a | b");
  });
  it("trims trailing spaces and collapses blank lines", () => {
    expect(cleanOcrText("line one   \n\n\n\n\nline two\t\n")).toBe("line one\n\nline two");
    expect(cleanOcrText("\n\na\n\nb\n\n\n")).toBe("a\n\nb");
  });
  it("handles form feeds, NBSP and empty input", () => {
    expect(cleanOcrText("a b\f")).toBe("a b");
    expect(cleanOcrText("   \n \n")).toBe("");
  });
});

describe("helpers", () => {
  it("defaults by site language", () => {
    expect(defaultOcrLang("hi")).toBe("hin+eng");
    expect(defaultOcrLang("en")).toBe("eng");
  });
  it("estimates first-run size", () => {
    expect(firstRunMB("eng")).toBe(3.5);
    expect(firstRunMB("hin")).toBe(2.4);
    expect(firstRunMB("hin+eng")).toBe(4.4);
  });
  it("names the text file", () => {
    expect(txtName("IMG_2024.jpeg")).toBe("IMG_2024.txt");
    expect(txtName(undefined)).toBe("text.txt");
    expect(txtName("a:b.png")).toBe("a_b.txt");
  });
});
