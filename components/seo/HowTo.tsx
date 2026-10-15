import JsonLd from "./JsonLd";
import type { Guide } from "@/i18n/parts/guides";

/** Intro + numbered steps for a tool, plus HowTo schema. Exam pages skip the intro (their rules tables say more). */
export default function HowTo({ heading, name, guide, intro = true }: { heading: string; name: string; guide: Guide; intro?: boolean }) {
  return (
    <section className="prose-section">
      {intro && <p className="mb-3 text-muted">{guide.intro}</p>}
      <h2>{heading}</h2>
      <ol className="list-decimal space-y-1 pl-5">
        {guide.steps.map((s) => <li key={s}>{s}</li>)}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name,
          step: guide.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })),
        }}
      />
    </section>
  );
}
