/**
 * Ad placeholder. Renders nothing until ads are configured (NEXT_PUBLIC_ADS_ENABLED=1).
 * Placement rules: never above a tool's main button, never between the result and its
 * download button. Use "inline" after the tool, "bottom" at the end of the article.
 */
export type AdPosition = "top" | "inline" | "sidebar" | "bottom";

export default function AdSlot({ position }: { position: AdPosition }) {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "1") return null;
  // Reserve height up front so a late ad never shifts the layout (CLS).
  return <div data-ad-slot={position} className="my-6 min-h-[100px] rounded-xl border border-dashed border-line" aria-hidden />;
}
