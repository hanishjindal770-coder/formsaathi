"use client";
import { useEffect, useRef, useState } from "react";
import { fmt } from "@/i18n/config";
import type { studioEn } from "@/i18n/parts/studio";
import type { Source } from "@/lib/image/canvas";
import { anchorCenter, ANCHORS, clampCenter, textLines, type Anchor } from "@/lib/image/annotate";
import { drawText, loadTextFont, measureText, type TextOpts } from "./annotateDraw";
import { pointerFraction, previewStyle, usePreview } from "./usePreview";

type Props = { t: typeof studioEn; src: Source; onApply: (o: TextOpts) => void };

const SWATCHES = ["#ffffff", "#000000", "#e11d48", "#facc15", "#2563eb", "#16a34a"];
const ARROWS: Record<Anchor, string> = { tl: "↖", tc: "↑", tr: "↗", ml: "←", mc: "•", mr: "→", bl: "↙", bc: "↓", br: "↘" };
const STORE = "fs-studio-text";

const DEFAULTS: TextOpts = { text: "", size: 8, color: "#ffffff", bold: true, opacity: 0.9, box: true, fx: 0.5, fy: 0.85, tile: false, angle: -30 };

function loadSaved(): TextOpts {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || "null");
    // Position is per photo, so only the look and the text carry over.
    if (s && typeof s === "object") return { ...DEFAULTS, ...s, fx: DEFAULTS.fx, fy: DEFAULTS.fy };
  } catch {}
  return DEFAULTS;
}

export default function TextPanel({ t, src, onApply }: Props) {
  const [o, setO] = useState<TextOpts>(DEFAULTS);
  const [fontTick, setFontTick] = useState(0);
  const [busy, setBusy] = useState(false);
  const dragging = useRef(false);
  const set = (p: Partial<TextOpts>) => setO((prev) => ({ ...prev, ...p }));

  useEffect(() => setO(loadSaved()), []);
  useEffect(() => {
    try {
      const { fx: _fx, fy: _fy, ...rest } = o;
      localStorage.setItem(STORE, JSON.stringify(rest));
    } catch {}
  }, [o]);

  // Redraw once the Devanagari font has arrived (first use on a page can take a moment).
  useEffect(() => {
    let live = true;
    loadTextFont(o).then(() => live && setFontTick((n) => n + 1));
    return () => {
      live = false;
    };
  }, [o.text, o.bold]); // eslint-disable-line react-hooks/exhaustive-deps

  const { ref, dims } = usePreview(src, (c) => drawText(c, o), [o, fontTick]);
  const full = { width: src.width, height: src.height };
  const empty = !textLines(o.text).length;

  const moveTo = (fx: number, fy: number) => {
    const block = measureText(full, o);
    const c = clampCenter({ x: fx * full.width, y: fy * full.height }, full, block);
    set({ fx: c.x / full.width, fy: c.y / full.height });
  };
  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>, down = false) => {
    if (o.tile) return;
    if (down) {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragging.current = true;
    }
    if (!dragging.current) return;
    const p = pointerFraction(e);
    moveTo(p.x, p.y);
  };
  const preset = (a: Anchor) => {
    const c = anchorCenter(a, full, measureText(full, o));
    set({ fx: c.x / full.width, fy: c.y / full.height });
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={ref}
        width={dims.width}
        height={dims.height}
        aria-label={t.dragText}
        className={`mx-auto block h-auto w-full select-none rounded-xl border border-line ${o.tile ? "" : "cursor-move"}`}
        style={previewStyle(dims.width, dims.height)}
        onPointerDown={(e) => onPointer(e, true)}
        onPointerMove={(e) => onPointer(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      />
      <p className="text-center text-sm text-muted">{o.tile ? t.tileHint : t.dragText}</p>

      <label className="block text-sm">
        {t.yourText}
        <textarea
          className="field mt-1 min-h-11"
          rows={2}
          lang="hi"
          style={{ fontFamily: '"Noto Sans Devanagari", system-ui, sans-serif' }}
          value={o.text}
          placeholder={t.textPlaceholder}
          onChange={(e) => set({ text: e.target.value })}
        />
      </label>

      <label className="block text-sm">
        {fmt(t.textSize, { n: o.size })}
        <input type="range" min={2} max={30} value={o.size} onChange={(e) => set({ size: Number(e.target.value) })} className="mt-2 h-8 w-full" />
      </label>

      <div>
        <p className="mb-2 text-sm">{t.color}</p>
        <div className="flex flex-wrap items-center gap-2">
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              aria-pressed={o.color === c}
              onClick={() => set({ color: c })}
              className={`h-11 w-11 rounded-full border-2 ${o.color === c ? "border-brand ring-2 ring-brand" : "border-line"}`}
              style={{ background: c }}
            />
          ))}
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="color" className="h-11 w-11 cursor-pointer rounded border border-line bg-surface" value={o.color} onChange={(e) => set({ color: e.target.value })} aria-label={t.customColor} />
            {t.customColor}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input type="checkbox" className="h-5 w-5" checked={o.bold} onChange={(e) => set({ bold: e.target.checked })} />
          <b>{t.bold}</b>
        </label>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input type="checkbox" className="h-5 w-5" checked={o.box} onChange={(e) => set({ box: e.target.checked })} />
          {t.bgBox}
        </label>
      </div>

      <label className="block text-sm">
        {fmt(t.opacity, { n: Math.round(o.opacity * 100) })}
        <input type="range" min={10} max={100} value={Math.round(o.opacity * 100)} onChange={(e) => set({ opacity: Number(e.target.value) / 100 })} className="mt-2 h-8 w-full" />
      </label>

      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" className="h-5 w-5" checked={o.tile} onChange={(e) => set({ tile: e.target.checked })} />
        {t.tile}
      </label>

      {o.tile ? (
        <label className="block text-sm">
          {fmt(t.angle, { n: o.angle })}
          <input type="range" min={-90} max={90} value={o.angle} onChange={(e) => set({ angle: Number(e.target.value) })} className="mt-2 h-8 w-full" />
        </label>
      ) : (
        <fieldset>
          <legend className="mb-2 text-sm">{t.position}</legend>
          <div className="mx-auto grid w-44 grid-cols-3 gap-1">
            {ANCHORS.map((a) => (
              <button key={a} type="button" aria-label={t.pos[a]} title={t.pos[a]} onClick={() => preset(a)} className="btn-secondary min-h-11 px-0 text-lg">
                {ARROWS[a]}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <button
        type="button"
        className="btn-primary w-full"
        disabled={empty || busy}
        onClick={async () => {
          setBusy(true);
          await loadTextFont(o);
          setBusy(false);
          onApply(o);
        }}
      >
        🔤 {t.addText}
      </button>
    </div>
  );
}
