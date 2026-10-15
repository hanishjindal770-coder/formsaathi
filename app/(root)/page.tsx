import type { Metadata } from "next";
import { asset } from "@/lib/base";

const hi = asset("/hi/");
const en = asset("/en/");

export const metadata: Metadata = {
  title: "FormSaathi",
  robots: { index: false },
  alternates: { canonical: en },
};

/** "/" has no content of its own: send people to their saved language, English by default. */
const script = `try{var l=localStorage.getItem("fs:lang");location.replace(l==="hi"?"${hi}":"${en}")}catch(e){location.replace("${en}")}`;

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`1; url=${en}`} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <p style={{ padding: 16, fontFamily: "sans-serif" }}>
        <a href={en}>English</a> · <a href={hi}>हिंदी</a>
      </p>
    </>
  );
}
