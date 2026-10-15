"use client";
import { useEffect, useState } from "react";
import { fmt } from "@/i18n/config";
import type { Dict } from "@/i18n/en";
import { createCanvas, cropResize, encodeCanvas, loadImageFile, type Source } from "@/lib/image/canvas";
import { expandToAspect, initialCrop, type Rect } from "@/lib/image/crop";
import { setJpegDpi } from "@/lib/image/jpeg";
import { A4_CM, layoutSheet, PHOTO_SIZES, type PhotoSize } from "@/lib/print/sheet";
import Cropper from "./Cropper";
import { FilePick, pdfBlob, useObjectUrl } from "./shared";

const DPI = 300;
const px = (cm: number) => Math.round((cm / 2.54) * DPI);
const COUNTS = [8, 16, 32];

export default function PassportSheet({ t, tool }: { t: Dict["sheet"]; tool: Dict["tool"] }) {
  const [source, setSource] = useState<Source | null>(null);
  const [preview, setPreview] = useState("");
  const [crop, setCrop] = useState<Rect | null>(null);
  const [count, setCount] = useState(8);
  const [size, setSize] = useState<PhotoSize>("passport");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<{ jpg: Blob; pdf: Blob } | null>(null);
  const jpgUrl = useObjectUrl(out?.jpg ?? null);
  const pdfUrl = useObjectUrl(out?.pdf ?? null);
  const { w, h } = PHOTO_SIZES[size];
  const aspect = w / h;
  const layout = layoutSheet(count, w, h);

  useEffect(() => { if (source) setCrop((c) => (c ? expandToAspect(c, aspect, source.width, source.height) : initialCrop(source.width, source.height, aspect))); }, [aspect, source]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => setOut(null), [crop, count, size]);

  async function onFile(f: File) {
    const s = await loadImageFile(f);
    setSource(s);
    setCrop(initialCrop(s.width, s.height, aspect));
    s.canvas.toBlob((b) => b && setPreview(URL.createObjectURL(b)), "image/jpeg", 0.85);
  }

  async function make() {
    if (!source || !crop || !layout) return;
    setBusy(true);
    try {
      const page = createCanvas(px(A4_CM.width), px(A4_CM.height));
      const ctx = page.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, page.width, page.height);
      const photo = cropResize(source.canvas, crop, px(w), px(h));
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 2;
      for (const c of layout.cells) {
        ctx.drawImage(photo, px(c.x), px(c.y));
        ctx.strokeRect(px(c.x) - 1, px(c.y) - 1, px(w) + 2, px(h) + 2); // cutting guide
      }
      const jpg = setJpegDpi(await encodeCanvas(page, "image/jpeg", 0.92), DPI);
      const { imagesToPdf } = await import("@/lib/pdf/build");
      const pdf = await imagesToPdf([{ bytes: jpg, format: "jpeg", width: page.width, height: page.height }], { pageSize: "fit", ptPerPx: 72 / DPI });
      setOut({ jpg: new Blob([jpg as BlobPart], { type: "image/jpeg" }), pdf: pdfBlob(pdf) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card space-y-4">
      {!source ? (
        <FilePick label={tool.upload} accept="image/*" onFiles={([f]) => onFile(f)} />
      ) : (
        <>
          {preview && crop && <Cropper src={preview} imgW={source.width} imgH={source.height} crop={crop} aspect={aspect} onChange={setCrop} guide="face" label={tool.dragHint} />}
          <FilePick label={tool.change} accept="image/*" primary={false} onFiles={([f]) => onFile(f)} />
        </>
      )}
      <fieldset>
        <legend className="mb-2 text-sm">{t.count}</legend>
        <div className="flex gap-2">
          {COUNTS.map((n) => (
            <button key={n} type="button" aria-pressed={count === n} onClick={() => { setCount(n); if (!layoutSheet(n, PHOTO_SIZES[size].w, PHOTO_SIZES[size].h)) setSize("stamp"); }} className={`min-h-11 flex-1 rounded-full border ${count === n ? "border-brand bg-brand text-brand-ink" : "border-line"}`}>
              {n}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm">{t.size}</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PHOTO_SIZES) as PhotoSize[]).map((s) => (
            <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className={`min-h-11 rounded-full border px-4 text-sm ${size === s ? "border-brand bg-brand text-brand-ink" : "border-line"}`}>
              {t[s]}
            </button>
          ))}
        </div>
      </fieldset>
      {!layout && <p className="text-warn">{fmt(t.tooMany, { count })}</p>}
      <button type="button" className="btn-primary w-full text-lg" disabled={!source || !layout || busy} onClick={make}>{busy ? tool.processing : t.make}</button>
      {out && (
        <div className="space-y-3 rounded-xl border-2 border-ok/50 p-3" aria-live="polite">
          <img src={jpgUrl} alt="" width={px(A4_CM.width)} height={px(A4_CM.height)} className="mx-auto h-auto max-h-80 w-auto rounded border border-line" />
          <p className="font-semibold">{fmt(t.result, { count })} ✅</p>
          <p className="text-sm text-muted">{t.printTip}</p>
          <div className="grid grid-cols-2 gap-2">
            <a className="btn-primary" href={pdfUrl} download={`passport-photos-${count}.pdf`}>⬇️ PDF</a>
            <a className="btn-secondary" href={jpgUrl} download={`passport-photos-${count}.jpg`}>⬇️ JPG</a>
          </div>
        </div>
      )}
    </div>
  );
}
