"use client";
import { useEffect, useState } from "react";
import type { Dict } from "@/i18n/en";
import { kb, FilePick } from "./shared";

type Out = { name: string; url: string; size: number };

/** JPG ↔ PNG (also reads WEBP/GIF/BMP). PNG output keeps transparency; JPG gets a white background. */
async function convert(file: File, to: "jpeg" | "png"): Promise<Blob> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const c = document.createElement("canvas");
  c.width = bmp.width;
  c.height = bmp.height;
  const ctx = c.getContext("2d")!;
  if (to === "jpeg") {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
  }
  ctx.drawImage(bmp, 0, 0);
  bmp.close();
  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), `image/${to}`, 0.92));
}

export default function ImageConvert({ t, preset }: { t: Dict["convert"]; preset?: { to?: "jpeg" | "png" } }) {
  const [to, setTo] = useState<"jpeg" | "png">(preset?.to ?? "png");
  const [files, setFiles] = useState<File[]>([]);
  const [outs, setOuts] = useState<Out[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => outs.forEach((o) => URL.revokeObjectURL(o.url)), [outs]);

  async function run() {
    setBusy(true);
    const next: Out[] = [];
    for (const f of files) {
      try {
        const b = await convert(f, to);
        next.push({ name: f.name.replace(/\.[^.]+$/, "") + (to === "png" ? ".png" : ".jpg"), url: URL.createObjectURL(b), size: b.size });
      } catch {
        next.push({ name: f.name, url: "", size: 0 });
      }
    }
    setOuts(next);
    setBusy(false);
  }

  return (
    <div className="card space-y-4">
      <FilePick label={files.length ? `${files.length} ✓` : t.choose} accept="image/*" multiple primary={!files.length} onFiles={(f) => { setOuts([]); setFiles(f); }} />
      <div className="flex items-center gap-2 text-sm">
        <span>{t.to}:</span>
        {(["png", "jpeg"] as const).map((f) => (
          <button key={f} type="button" aria-pressed={to === f} onClick={() => { setTo(f); setOuts([]); }} className={`min-h-11 rounded-full border px-5 ${to === f ? "border-brand bg-brand text-brand-ink" : "border-line"}`}>
            {f === "png" ? "PNG" : "JPG"}
          </button>
        ))}
      </div>
      {to === "jpeg" && <p className="text-sm text-muted">{t.note}</p>}
      <button type="button" className="btn-primary w-full text-lg" disabled={!files.length || busy} onClick={run}>{busy ? "…" : t.convert}</button>
      {outs.length > 0 && (
        <ul className="space-y-2" aria-live="polite">
          {outs.map((o) => (
            <li key={o.name} className="flex items-center justify-between gap-2 rounded-xl border border-line p-2 text-sm">
              <span className="min-w-0 truncate">{o.url ? "✅" : "⚠️"} {o.name} {o.url && <span className="text-muted">· {kb(o.size)} KB</span>}</span>
              {o.url && <a className="btn-primary min-h-10 shrink-0 px-4 text-sm" href={o.url} download={o.name}>⬇️ {t.downloadAll}</a>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
