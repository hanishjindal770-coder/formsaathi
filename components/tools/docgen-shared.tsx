"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { fmt } from "@/i18n/config";
import type { docgenEn } from "@/i18n/parts/docgen";
import type { Measure, Page } from "@/lib/docgen/layout";
import type { DocLang } from "@/lib/docgen/labels";

/** Form pieces shared by ResumeMaker, BiodataMaker and LetterMaker. */

export type Common = (typeof docgenEn)["common"];

/**
 * Form state mirrored to localStorage. Loaded after mount (not during render) so the static
 * HTML and the first client render match; missing keys fall back to the fresh form.
 */
export function useAutosave<T extends object>(key: string, fresh: () => T, onLoad?: (v: T) => T) {
  const [value, setValue] = useState<T>(fresh);
  const loaded = useRef(false);
  useEffect(() => {
    let v = fresh();
    try {
      const raw = localStorage.getItem(key);
      if (raw) v = { ...v, ...(JSON.parse(raw) as Partial<T>) };
    } catch {}
    setValue(onLoad ? onLoad(v) : v);
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (!loaded.current) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Probably over quota because of the photo: keep the text at least.
        try {
          localStorage.setItem(key, JSON.stringify({ ...value, photo: "" }));
        } catch {}
      }
    }, 400);
    return () => clearTimeout(id);
  }, [key, value]);
  const clear = () => {
    try {
      localStorage.removeItem(key);
    } catch {}
    setValue(onLoad ? onLoad(fresh()) : fresh());
  };
  return [value, setValue, clear] as const;
}

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function Section({ title, children, open = true }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="group rounded-xl border border-line" open={open}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-3 font-semibold">
        {title}
        <span aria-hidden className="text-muted transition group-open:rotate-180">▾</span>
      </summary>
      <div className="space-y-3 px-3 pb-3">{children}</div>
    </details>
  );
}

type FieldProps = { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; inputMode?: "text" | "numeric" | "tel" | "email" | "decimal"; hint?: string };

export function Field({ label, value, onChange, placeholder, type = "text", inputMode, hint }: FieldProps) {
  return (
    <label className="block text-sm">
      {label}
      <input className="field mt-1" type={type} inputMode={inputMode} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Area({ label, value, onChange, placeholder, rows = 3, hint }: Omit<FieldProps, "type" | "inputMode"> & { rows?: number }) {
  return (
    <label className="block text-sm">
      {label}
      <textarea className="field mt-1 py-2" rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Choice<V extends string>({ label, value, options, onChange }: { label: string; value: V; options: { value: V; label: string }[]; onChange: (v: V) => void }) {
  return (
    <fieldset className="text-sm">
      <legend>{label}</legend>
      <div className="mt-1 flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)} className={`min-h-11 rounded-full border px-4 ${value === o.value ? "border-brand bg-brand text-brand-ink" : "border-line"}`}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function DocLangChoice({ value, onChange, t }: { value: DocLang; onChange: (v: DocLang) => void; t: Common }) {
  return <Choice label={t.docLang} value={value} onChange={onChange} options={[{ value: "hi", label: t.docLangHi }, { value: "en", label: t.docLangEn }]} />;
}

/** Repeatable rows (education, experience, siblings) with add/remove. */
export function Rows<R>({ rows, onChange, fresh, addLabel, t, render }: { rows: R[]; onChange: (r: R[]) => void; fresh: () => R; addLabel: string; t: Common; render: (row: R, set: (patch: Partial<R>) => void, i: number) => ReactNode }) {
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-line p-2">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>#{i + 1}</span>
            <button type="button" className="min-h-11 rounded-lg border border-line px-3" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
              ✕ {t.remove}
            </button>
          </div>
          {render(row, (patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r))), i)}
        </div>
      ))}
      <button type="button" className="btn-secondary w-full" onClick={() => onChange([...rows, fresh()])}>
        + {addLabel}
      </button>
    </div>
  );
}

/** Picks a photo and keeps a small JPEG data URL (small enough to autosave). */
export function PhotoField({ value, onChange, t }: { value: string; onChange: (v: string) => void; t: Common }) {
  const [err, setErr] = useState(false);
  return (
    <div className="flex items-center gap-3">
      {value ? <img src={value} alt="" className="h-24 w-20 rounded border border-line object-cover" /> : <div className="flex h-24 w-20 items-center justify-center rounded border border-dashed border-line text-xs text-muted">{t.photo}</div>}
      <div className="flex flex-1 flex-col gap-2">
        <label className="btn-secondary cursor-pointer text-sm">
          📷 {value ? t.changePhoto : t.choosePhoto}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              setErr(false);
              try {
                const { loadImageFile } = await import("@/lib/image/canvas");
                const src = await loadImageFile(f, 700);
                onChange(src.canvas.toDataURL("image/jpeg", 0.85));
              } catch {
                setErr(true);
              }
            }}
          />
        </label>
        {value && (
          <button type="button" className="min-h-11 rounded-lg border border-line text-sm" onClick={() => onChange("")}>
            {t.removePhoto}
          </button>
        )}
        {err && <p role="alert" className="text-sm text-bad">{t.photoError}</p>}
      </div>
    </div>
  );
}

const PREVIEW_SCALE = 0.5;

/**
 * Live preview of page 1 plus Download / Print / Clear. `build` must be memoised by the caller
 * (it changes whenever the form data changes); rendering is debounced so typing stays smooth.
 */
export function DocOutput({ build, photo, fileName, t, onClear }: { build: (m: Measure) => Page[]; photo: string; fileName: string; t: Common; onClear: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const latest = useRef<{ pages: Page[]; images: Record<string, HTMLImageElement | undefined> } | null>(null);
  const [pages, setPages] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(async () => {
      const r = await import("@/lib/docgen/render");
      await r.loadFonts();
      const img = await r.loadImage(photo);
      if (cancelled) return;
      const out = build(r.canvasMeasure());
      const images = { photo: img };
      latest.current = { pages: out, images };
      setPages(out.length);
      const c = canvasRef.current;
      const ctx = c?.getContext("2d");
      if (ctx && out[0]) r.paintPage(ctx, out[0], images, PREVIEW_SCALE);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [build, photo]);

  async function download() {
    if (!latest.current) return;
    setBusy(true);
    setError(false);
    try {
      const r = await import("@/lib/docgen/render");
      const bytes = await r.renderPdf(latest.current.pages, latest.current.images, fileName);
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  async function print() {
    if (!latest.current) return;
    const r = await import("@/lib/docgen/render");
    r.printPages(latest.current.pages, latest.current.images);
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{t.preview}</h3>
      <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <canvas ref={canvasRef} width={Math.round(1240 * PREVIEW_SCALE)} height={Math.round(1754 * PREVIEW_SCALE)} className="block h-auto w-full" aria-label={t.preview} />
      </div>
      <p className="text-center text-sm text-muted" aria-live="polite">{pages ? fmt(t.pageOf, { pages }) : t.previewLoading}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <button type="button" className="btn-primary w-full text-lg" disabled={!pages || busy} onClick={download}>
          {busy ? t.making : `⬇️ ${t.download}`}
        </button>
        <button type="button" className="btn-secondary w-full" disabled={!pages} onClick={print}>
          🖨️ {t.print}
        </button>
      </div>
      {error && <p role="alert" className="text-bad">{t.error}</p>}
      <p className="text-xs text-muted">{t.saved}</p>
      <button
        type="button"
        className="min-h-11 w-full rounded-xl border border-line text-sm text-bad"
        onClick={() => {
          if (window.confirm(t.clearConfirm)) onClear();
        }}
      >
        {t.clear}
      </button>
    </div>
  );
}
