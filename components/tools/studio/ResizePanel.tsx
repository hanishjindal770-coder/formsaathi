"use client";
import { useEffect, useState } from "react";
import { fmt } from "@/i18n/config";
import type { studioEn } from "@/i18n/parts/studio";
import {
  clampDims,
  DEFAULT_PRINT_DPI,
  fromPx,
  lockedDims,
  MAX_UPSCALE,
  PERCENT_PRESETS,
  roundUnit,
  scaleByPercent,
  toPx,
  upscaleFactor,
  type Dims,
  type Unit,
} from "@/lib/image/edit";
import { Chip, NumField, Segment } from "./ui";

type Props = {
  t: typeof studioEn;
  current: Dims;
  original: Dims;
  preset?: { widthPx?: number; heightPx?: number };
  onApply: (d: Dims) => void;
};

const num = (s: string) => {
  const n = Number(s);
  return isFinite(n) && n > 0 ? n : 0;
};

export default function ResizePanel({ t, current, original, preset, onApply }: Props) {
  const hasPreset = !!(preset?.widthPx || preset?.heightPx);
  const [mode, setMode] = useState<"percent" | "size">(hasPreset ? "size" : "percent");
  const [pct, setPct] = useState(50);
  const [unit, setUnit] = useState<Unit>("px");
  const [dpi, setDpi] = useState(String(DEFAULT_PRINT_DPI));
  // An exact preset like 600×600 means "this size", so it starts unlocked when both sides are given.
  const [lock, setLock] = useState(!(preset?.widthPx && preset?.heightPx));
  const [w, setW] = useState("");
  const [h, setH] = useState("");
  const [confirmUp, setConfirmUp] = useState(false);
  const [usedPreset, setUsedPreset] = useState(false);

  const d = num(dpi) || DEFAULT_PRINT_DPI;
  const show = (pixels: number, u = unit) => String(roundUnit(fromPx(pixels, u, d), u));

  // Refill the fields from the working image whenever it changes (after undo, crop, …).
  useEffect(() => {
    if (hasPreset && !usedPreset) {
      setUsedPreset(true);
      const wp = preset!.widthPx;
      const hp = preset!.heightPx;
      const filled = wp && hp ? { width: wp, height: hp } : wp ? lockedDims(current, "width", wp, true, 0) : lockedDims(current, "height", hp!, true, 0);
      setW(String(filled.width));
      setH(String(filled.height));
      return;
    }
    setW(show(current.width));
    setH(show(current.height));
    setConfirmUp(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.width, current.height]);

  const editSide = (side: "width" | "height", v: string) => {
    side === "width" ? setW(v) : setH(v);
    setConfirmUp(false);
    const n = num(v);
    if (!lock || !n) return;
    const pxVal = toPx(n, unit, d);
    const other = lockedDims(current, side, pxVal, true, 0);
    if (side === "width") setH(show(other.height));
    else setW(show(other.width));
  };

  const changeUnit = (u: Unit) => {
    // Keep the same physical size while switching units.
    const wp = toPx(num(w), unit, d);
    const hp = toPx(num(h), unit, d);
    setUnit(u);
    setW(wp ? show(wp, u) : "");
    setH(hp ? show(hp, u) : "");
  };

  const target: Dims | null =
    mode === "percent"
      ? scaleByPercent(current, pct)
      : num(w) && num(h)
        ? { width: Math.max(1, Math.round(toPx(num(w), unit, d))), height: Math.max(1, Math.round(toPx(num(h), unit, d))) }
        : null;
  const clamped = target ? clampDims(target) : null;
  // Judge the size the person asked for, not the clamped one, so huge requests still warn.
  const tooUp = !!target && upscaleFactor(target, original) > MAX_UPSCALE;
  const same = !!clamped && clamped.width === current.width && clamped.height === current.height;

  return (
    <div className="space-y-4">
      <Segment value={mode} onChange={(m) => { setMode(m); setConfirmUp(false); }} options={[{ id: "percent", label: t.byPercent }, { id: "size", label: t.bySize }]} />
      {mode === "percent" ? (
        <div className="space-y-3">
          <label className="block text-sm">
            {fmt(t.percent, { pct })}
            <input type="range" min={1} max={200} value={pct} onChange={(e) => { setPct(Number(e.target.value)); setConfirmUp(false); }} className="mt-2 h-8 w-full" />
          </label>
          <div className="flex flex-wrap gap-2">
            {PERCENT_PRESETS.map((p) => (
              <Chip key={p} on={pct === p} onClick={() => setPct(p)}>{p}%</Chip>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <NumField id="studio-w" label={t.width} value={w} min={0} onChange={(v) => editSide("width", v)} />
            <NumField id="studio-h" label={t.height} value={h} min={0} onChange={(v) => editSide("height", v)} />
          </div>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input type="checkbox" className="h-5 w-5" checked={lock} onChange={(e) => setLock(e.target.checked)} />
            🔗 {t.lock}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block min-w-0 text-sm">
              {t.unit}
              <select className="field mt-1" value={unit} onChange={(e) => changeUnit(e.target.value as Unit)}>
                {(["px", "cm", "in"] as const).map((u) => (
                  <option key={u} value={u}>{t.units[u]}</option>
                ))}
              </select>
            </label>
            {unit !== "px" && <NumField id="studio-dpi" label={t.dpi} value={dpi} min={1} onChange={setDpi} />}
          </div>
          {unit !== "px" && <p className="text-xs text-muted">{t.dpiHelp}</p>}
        </div>
      )}
      {clamped && <p className="text-sm font-medium">{fmt(t.newSize, { w: clamped.width, h: clamped.height })}</p>}
      {clamped?.clamped && <p className="text-sm text-warn">{fmt(t.clamped, { w: clamped.width, h: clamped.height })}</p>}
      {tooUp && <p className="rounded-lg bg-warn-bg p-3 text-sm text-warn">⚠️ {fmt(t.upscaleWarn, { n: MAX_UPSCALE })}</p>}
      <button
        type="button"
        className="btn-primary w-full"
        disabled={!clamped || same}
        onClick={() => {
          if (!clamped) return;
          if (tooUp && !confirmUp) return setConfirmUp(true);
          onApply({ width: clamped.width, height: clamped.height });
        }}
      >
        {tooUp && confirmUp ? t.applyAnyway : t.apply}
      </button>
    </div>
  );
}
