"use client";
import { useEffect, useRef, useState } from "react";
import { fmt } from "@/i18n/config";
import type { studioEn } from "@/i18n/parts/studio";
import type { Source } from "@/lib/image/canvas";
import { normRect, scaleRect, strengthPx, tinyRect, type IRect, type Pt } from "@/lib/image/annotate";
import { drawBlur, type BlurOpts } from "./annotateDraw";
import { Segment } from "./ui";
import { pointerFraction, previewStyle, usePreview } from "./usePreview";

type Props = { t: typeof studioEn; src: Source; onApply: (o: BlurOpts) => void };

export default function BlurPanel({ t, src, onApply }: Props) {
  const [mode, setMode] = useState<BlurOpts["mode"]>("blur");
  const [level, setLevel] = useState(6);
  const [rect, setRect] = useState<IRect | null>(null);
  const start = useRef<Pt | null>(null);
  const full = { width: src.width, height: src.height };

  // A new working image (after Apply, undo, …) starts with no area selected.
  useEffect(() => setRect(null), [src]);

  const { ref, dims } = usePreview(
    src,
    (c) => {
      if (!rect || tinyRect(rect, 1)) return;
      const pv = { width: c.width, height: c.height };
      drawBlur(c, mode, scaleRect(rect, full, pv), strengthPx(level, pv));
    },
    [rect, mode, level],
  );

  const at = (e: React.PointerEvent<HTMLElement>): Pt => {
    const p = pointerFraction(e);
    return { x: p.x * full.width, y: p.y * full.height };
  };
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = at(e);
    setRect(null);
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (start.current) setRect(normRect(start.current, at(e), full));
  };
  const onUp = () => {
    start.current = null;
    setRect((r) => (r && tinyRect(r) ? null : r));
  };

  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  const px = strengthPx(level, full);
  const whole = !!rect && rect.width === full.width && rect.height === full.height;

  return (
    <div className="space-y-4">
      <div
        className="relative mx-auto w-full select-none overflow-hidden rounded-xl border border-line"
        style={previewStyle(dims.width, dims.height)}
        role="application"
        aria-label={t.dragArea}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <canvas ref={ref} width={dims.width} height={dims.height} className="block h-auto w-full cursor-crosshair" />
        {rect && (
          <div
            data-testid="blur-rect"
            className="pointer-events-none absolute border-2 border-dashed border-white"
            style={{ left: pct(rect.x, full.width), top: pct(rect.y, full.height), width: pct(rect.width, full.width), height: pct(rect.height, full.height), boxShadow: "0 0 0 1px #000" }}
          />
        )}
      </div>
      <p className="text-center text-sm text-muted">{rect ? fmt(t.areaSize, { w: rect.width, h: rect.height }) : t.dragArea}</p>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="btn-secondary min-h-11 px-2 text-sm" aria-pressed={whole} onClick={() => setRect({ x: 0, y: 0, ...full })}>
          🖼️ {t.wholeImage}
        </button>
        <button type="button" className="btn-secondary min-h-11 px-2 text-sm" disabled={!rect} onClick={() => setRect(null)}>
          ✕ {t.clearArea}
        </button>
      </div>

      <Segment value={mode} onChange={setMode} options={[{ id: "blur", label: t.blurMode }, { id: "pixelate", label: t.pixelateMode }]} />

      <label className="block text-sm">
        {fmt(mode === "blur" ? t.blurStrength : t.blockSize, { n: level, px })}
        <input type="range" min={1} max={20} value={level} onChange={(e) => setLevel(Number(e.target.value))} className="mt-2 h-8 w-full" />
      </label>

      <button type="button" className="btn-primary w-full" disabled={!rect} onClick={() => rect && onApply({ mode, level, rect })}>
        {mode === "blur" ? `💧 ${t.applyBlur}` : `▦ ${t.applyPixelate}`}
      </button>
      <p className="text-xs text-muted">{t.blurNote}</p>
    </div>
  );
}
