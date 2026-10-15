import type { Metadata } from "next";
import { asset } from "@/lib/base";

const hi = asset("/hi/");
const en = asset("/en/");

export const metadata: Metadata = {
  title: "FormSaathi",
  robots: { index: false },
  alternates: { canonical: hi },
};

/** "/" has no content of its own: send people to their saved language, Hindi by default. */
const script = `try{var l=localStorage.getItem("fs:lang");location.replace(l==="en"?"${en}":"${hi}")}catch(e){location.replace("${hi}")}`;

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`1; url=${hi}`} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <p style={{ padding: 16, fontFamily: "sans-serif" }}>
        <a href={hi}>हिंदी</a> · <a href={en}>English</a>
      </p>
    </>
  );
}
