import JsonLd from "./JsonLd";

export type FaqItem = { q: string; a: string };

/** FAQ as native <details> (no JS) plus FAQPage schema. */
export default function Faq({ heading, items }: { heading: string; items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <section className="prose-section">
      <h2>{heading}</h2>
      <div className="space-y-2">
        {items.map((f) => (
          <details key={f.q} className="card">
            <summary className="cursor-pointer font-semibold">{f.q}</summary>
            <p className="mt-2 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </section>
  );
}
