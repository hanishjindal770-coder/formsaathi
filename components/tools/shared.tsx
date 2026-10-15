"use client";
import { useEffect, useMemo } from "react";

/** Small building blocks shared by the file tools. */

export function useObjectUrl(blob: Blob | null): string {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : ""), [blob]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return url;
}

export function FilePick({ label, accept, multiple, onFiles, primary = true }: { label: string; accept: string; multiple?: boolean; onFiles: (f: File[]) => void; primary?: boolean }) {
  return (
    <label className={`${primary ? "btn-primary" : "btn-secondary"} w-full cursor-pointer`}>
      📁 {label}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = ""; // allow picking the same file again
          if (files.length) onFiles(files);
        }}
      />
    </label>
  );
}

export const readBytes = async (f: Blob) => new Uint8Array(await f.arrayBuffer());
export const pdfBlob = (b: Uint8Array) => new Blob([b as BlobPart], { type: "application/pdf" });
export const kb = (bytes: number) => (bytes < 10240 ? (bytes / 1024).toFixed(1) : String(Math.round(bytes / 1024)));

/** Reorderable list of picked files. */
export function FileList<T extends { name: string; size: number }>({ items, onChange, t }: { items: T[]; onChange: (items: T[]) => void; t: { moveUp: string; moveDown: string; remove: string } }) {
  const move = (i: number, d: number) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <ol className="divide-y divide-line rounded-xl border border-line">
      {items.map((f, i) => (
        <li key={`${f.name}-${i}`} className="flex items-center gap-2 p-2 text-sm">
          <span className="w-6 text-center text-muted">{i + 1}</span>
          <span className="min-w-0 flex-1 truncate">{f.name} <span className="text-muted">· {kb(f.size)} KB</span></span>
          <button type="button" aria-label={t.moveUp} disabled={i === 0} onClick={() => move(i, -1)} className="h-10 w-10 rounded-lg border border-line disabled:opacity-30">↑</button>
          <button type="button" aria-label={t.moveDown} disabled={i === items.length - 1} onClick={() => move(i, 1)} className="h-10 w-10 rounded-lg border border-line disabled:opacity-30">↓</button>
          <button type="button" aria-label={t.remove} onClick={() => onChange(items.filter((_, j) => j !== i))} className="h-10 w-10 rounded-lg border border-line">✕</button>
        </li>
      ))}
    </ol>
  );
}
