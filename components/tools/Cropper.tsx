"use client";
import { useRef } from "react";
import { moveCrop, resizeCrop, type Rect } from "@/lib/image/crop";

type Props = {
  src: string;
  imgW: number;
  imgH: number;
  crop: Rect;
  aspect: number | null;
  onChange: (r: Rect) => void;
  guide?: "face" | "none";
  label: string;
};

/**
 * Minimal touch-friendly cropper: drag the box to move, drag the corner handle to resize.
 * Works in source-image pixels; the screen→image scale is read on every pointer move so it
 * survives rotation and resizes.
 */
export default function Cropper({ src, imgW, imgH, crop, aspect, onChange, guide = "none", label }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const drag = useRef<{ mode: "move" | "resize"; x: number; y: number; start: Rect } | null>(null);

  const scale = () => imgW / (wrap.current?.clientWidth || imgW);

  const onDown = (mode: "move" | "resize") => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { mode, x: e.clientX, y: e.clientY, start: crop };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const s = scale();
    const dx = (e.clientX - d.x) * s;
    const dy = (e.clientY - d.y) * s;
    onChange(d.mode === "move" ? moveCrop(d.start, dx, dy, imgW, imgH) : resizeCrop(d.start, dx, dy, imgW, imgH, aspect));
  };
  const onUp = () => {
    drag.current = null;
  };

  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  return (
    <div ref={wrap} className="relative mx-auto w-full select-none overflow-hidden rounded-xl bg-black/80" style={{ maxWidth: `min(100%, ${(60 * imgW) / imgH}vh)` }}>
      <img src={src} alt="" className="block h-auto w-full" draggable={false} width={imgW} height={imgH} />
      <div
        role="slider"
        aria-label={label}
        aria-valuenow={Math.round(crop.width)}
        tabIndex={0}
        onKeyDown={(e) => {
          const step = imgW / 50;
          const m: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
          if (m[e.key]) {
            e.preventDefault();
            onChange(moveCrop(crop, m[e.key][0], m[e.key][1], imgW, imgH));
          }
        }}
        onPointerDown={onDown("move")}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="absolute cursor-move border-2 border-white"
        style={{
          left: pct(crop.x, imgW),
          top: pct(crop.y, imgH),
          width: pct(crop.width, imgW),
          height: pct(crop.height, imgH),
          boxShadow: "0 0 0 9999px rgba(0,0,0,.55)",
          touchAction: "none",
        }}
      >
        {guide === "face" && (
          <div className="pointer-events-none absolute left-1/2 top-[12%] h-[62%] w-[58%] -translate-x-1/2 rounded-[50%] border-2 border-dashed border-white/70" />
        )}
        <div
          onPointerDown={onDown("resize")}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="absolute bottom-1 right-1 h-9 w-9 cursor-nwse-resize rounded-full border-2 border-white bg-brand"
          style={{ touchAction: "none" }}
          aria-hidden
        />
      </div>
    </div>
  );
}
