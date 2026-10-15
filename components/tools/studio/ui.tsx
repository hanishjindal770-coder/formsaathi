"use client";
import type { ReactNode } from "react";

/** Toggle chip with a 44px touch target. */
export function Chip({ on, onClick, children, disabled }: { on: boolean; onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
      className={`min-h-11 rounded-full border px-4 text-sm disabled:opacity-40 ${on ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"}`}
    >
      {children}
    </button>
  );
}

/** Two-way segmented switch (e.g. "By percentage" / "By size"). */
export function Segment<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="grid grid-flow-col auto-cols-fr rounded-xl border border-line p-1" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`min-h-11 rounded-lg px-2 text-sm font-medium ${value === o.id ? "bg-brand text-brand-ink" : ""}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Numeric input that keeps its own text so people can clear it while typing. */
export function NumField({ label, value, onChange, step, min, id }: { label: string; value: string; onChange: (v: string) => void; step?: number; min?: number; id: string }) {
  return (
    <label className="block min-w-0 text-sm" htmlFor={id}>
      {label}
      <input id={id} type="number" inputMode="decimal" className="field mt-1" value={value} step={step} min={min} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
