"use client";
import { useEffect, useMemo, useRef } from "react";
import type { Source } from "@/lib/image/canvas";
import { previewBase } from "./annotateDraw";

/**
 * Live preview canvas for the Text and Blur tabs: a downscaled copy of the working image that
 * `paint` draws onto after every change. Returns the base size and the visible canvas ref.
 */
export function usePreview(src: Source, paint: (c: HTMLCanvasElement) => void, deps: unknown[]) {
  const base = useMemo(() => previewBase(src), [src]);
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useRef(0);
  useEffect(() => {
    // One paint per animation frame: drag events can fire faster than a JS blur can run.
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const c = ref.current;
      if (!c) return;
      if (c.width !== base.width || c.height !== base.height) {
        c.width = base.width;
        c.height = base.height;
      }
      const x = c.getContext("2d", { willReadFrequently: true });
      if (!x) return;
      x.clearRect(0, 0, c.width, c.height);
      x.drawImage(base, 0, 0);
      paint(c);
    });
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, ...deps]);
  return { ref, dims: { width: base.width, height: base.height } };
}

/** Pointer position as a 0–1 fraction of the element, clamped. */
export function pointerFraction(e: { clientX: number; clientY: number; currentTarget: Element }) {
  const r = e.currentTarget.getBoundingClientRect();
  return {
    x: Math.min(1, Math.max(0, (e.clientX - r.left) / (r.width || 1))),
    y: Math.min(1, Math.max(0, (e.clientY - r.top) / (r.height || 1))),
  };
}

/** Keeps the preview inside ~55% of the viewport height whatever the photo's shape. */
export const previewStyle = (w: number, h: number) => ({
  maxWidth: `min(100%, ${(55 * w) / h}vh)`,
  touchAction: "none" as const,
  background: "repeating-conic-gradient(#8882 0% 25%, transparent 0% 50%) 50% / 20px 20px",
});
