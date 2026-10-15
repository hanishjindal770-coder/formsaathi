"use client";
import { useEffect, useState } from "react";
import { fmt } from "@/i18n/config";
import type { studioEn } from "@/i18n/parts/studio";
import { clampCrop, initialCrop, scaleCrop, type Rect } from "@/lib/image/crop";
import { CROP_PRESETS, cropRatio, type CropPresetId, type Dims } from "@/lib/image/edit";
import Cropper from "../Cropper";
import { Chip, NumField } from "./ui";

type Props = { t: typeof studioEn; src: string; current: Dims; onApply: (r: Rect) => void };

function startRect(d: Dims, ratio: number | null): Rect {
  // Free crop starts a bit inset so the box edges are visible and grabbable.
  return ratio === null ? initialCrop(d.width, d.height, d.width / d.height, 0.85) : initialCrop(d.width, d.height, ratio);
}

export default function CropPanel({ t, src, current, onApply }: Props) {
  const [preset, setPreset] = useState<CropPresetId>("free");
  const [cw, setCw] = useState("2");
  const [ch, setCh] = useState("3");
  const ratio = cropRatio(preset, { w: Number(cw), h: Number(ch) });
  const [rect, setRect] = useState<Rect>(() => startRect(current, ratio));

  useEffect(() => {
    setRect(startRect(current, ratio));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.width, current.height, preset, ratio]);

  const { width: W, height: H } = current;
  const full = ratio ? Math.min(W, H * ratio) : W;
  const label = (id: CropPresetId) => (id === "free" || id === "passport" || id === "custom" ? t.presets[id] : id);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm">{t.ratio}</p>
        <div className="flex flex-wrap gap-2">
          {CROP_PRESETS.map((p) => (
            <Chip key={p.id} on={preset === p.id} onClick={() => setPreset(p.id)}>{label(p.id)}</Chip>
          ))}
        </div>
      </div>
      {preset === "custom" && (
        <fieldset>
          <legend className="mb-1 text-sm">{t.customRatio}</legend>
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <NumField id="studio-rw" label={t.width} value={cw} min={0} onChange={setCw} />
            <span className="pb-3">:</span>
            <NumField id="studio-rh" label={t.height} value={ch} min={0} onChange={setCh} />
          </div>
        </fieldset>
      )}
      <Cropper src={src} imgW={W} imgH={H} crop={rect} aspect={ratio} onChange={setRect} label={t.dragHint} />
      <p className="text-center text-sm text-muted">{t.dragHint}</p>
      <label className="block text-sm">
        {t.zoom}
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.01}
          className="mt-2 h-8 w-full"
          value={Math.min(1, rect.width / full)}
          onChange={(e) => {
            const next = scaleCrop(rect, (Number(e.target.value) * full) / rect.width, W, H, ratio);
            setRect(clampCrop(next, W, H, ratio));
          }}
        />
      </label>
      <p className="text-sm font-medium">{fmt(t.cropSize, { w: Math.round(rect.width), h: Math.round(rect.height) })}</p>
      <button type="button" className="btn-primary w-full" onClick={() => onApply(rect)}>
        ✂️ {t.applyCrop}
      </button>
    </div>
  );
}
