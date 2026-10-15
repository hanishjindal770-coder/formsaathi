"use client";
import { useState } from "react";
import { fmt } from "@/i18n/config";
import type { studioEn } from "@/i18n/parts/studio";
import { FORMAT_LABEL, FORMATS, KB_PRESETS, savedPercent, type OutFormat } from "@/lib/image/edit";
import { kb } from "../shared";
import type { OutSettings, Rendered } from "./render";
import { Chip, NumField, Segment } from "./ui";

type T = typeof studioEn;

export function CompressPanel({ t, out, originalBytes, rendered, onApply }: { t: T; out: OutSettings; originalBytes: number; rendered: Rendered | null; onApply: (o: OutSettings) => void }) {
  const [mode, setMode] = useState<"target" | "quality">(out.mode === "quality" ? "quality" : "target");
  const [target, setTarget] = useState(String(out.targetKB));
  const [q, setQ] = useState(Math.round(out.quality * 100));
  const targetN = Number(target);
  const valid = mode === "quality" || (isFinite(targetN) && targetN >= 1);
  const pct = rendered ? savedPercent(originalBytes, rendered.blob.size) : 0;

  return (
    <div className="space-y-4">
      <Segment value={mode} onChange={setMode} options={[{ id: "target", label: t.byKB }, { id: "quality", label: t.byQuality }]} />
      {mode === "target" ? (
        <div className="space-y-3">
          <NumField id="studio-kb" label={t.targetKB} value={target} min={1} onChange={setTarget} />
          <div className="flex flex-wrap gap-2">
            {KB_PRESETS.map((p) => (
              <Chip key={p} on={targetN === p} onClick={() => setTarget(String(p))}>{p} KB</Chip>
            ))}
          </div>
        </div>
      ) : (
        <label className="block text-sm">
          {fmt(t.quality, { q })}
          <input type="range" min={5} max={100} value={q} onChange={(e) => setQ(Number(e.target.value))} className="mt-2 h-8 w-full" disabled={out.format === "png"} />
        </label>
      )}
      {out.format === "png" && (
        <div className="space-y-2 rounded-lg bg-warn-bg p-3 text-sm text-warn">
          <p>{t.pngNote}</p>
          <button type="button" className="btn-secondary min-h-11 text-sm" onClick={() => onApply({ ...out, format: "jpeg" })}>{t.useJpg}</button>
        </div>
      )}
      <button
        type="button"
        className="btn-primary w-full"
        disabled={!valid || (mode === "quality" && out.format === "png")}
        onClick={() => onApply({ ...out, mode, quality: q / 100, targetKB: mode === "target" ? targetN : out.targetKB })}
      >
        🗜️ {t.compress}
      </button>
      {out.mode !== "auto" && (
        <button type="button" className="btn-secondary w-full" onClick={() => onApply({ ...out, mode: "auto" })}>{t.resetQuality}</button>
      )}
      {rendered && !rendered.untouched && (
        <div className="space-y-1 text-sm" aria-live="polite">
          <p>
            {fmt(t.beforeAfter, { before: kb(originalBytes), after: kb(rendered.blob.size) })}{" "}
            <strong className={pct >= 0 ? "text-ok" : "text-bad"}>{fmt(pct >= 0 ? t.saved : t.grew, { pct: Math.abs(pct) })}</strong>
          </p>
          {rendered.tooBig && <p className="text-bad">{fmt(t.tooBig, { kb: out.targetKB, got: kb(rendered.blob.size) })}</p>}
          {rendered.shrunk && !rendered.tooBig && <p className="text-muted">{fmt(t.shrunk, { w: rendered.width, h: rendered.height })}</p>}
        </div>
      )}
    </div>
  );
}

export function ConvertPanel({ t, format, webpOk, onPick }: { t: T; format: OutFormat; webpOk: boolean; onPick: (f: OutFormat) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-sm">{t.outFormat}</p>
      <div className="grid grid-cols-3 gap-2">
        {FORMATS.map((f) => (
          <Chip key={f} on={format === f} disabled={f === "webp" && !webpOk} onClick={() => f !== format && onPick(f)}>{FORMAT_LABEL[f]}</Chip>
        ))}
      </div>
      <p className="text-sm text-muted">{format === "jpeg" ? t.jpgNote : t.keepAlpha}</p>
      {!webpOk && <p className="text-sm text-muted">{t.webpUnsupported}</p>}
    </div>
  );
}

export type RotateAction = "left" | "right" | "180" | "h" | "v";

export function RotatePanel({ t, onAction }: { t: T; onAction: (a: RotateAction) => void }) {
  const items: { a: RotateAction; icon: string; label: string }[] = [
    { a: "left", icon: "⟲", label: t.rotateLeft },
    { a: "right", icon: "⟳", label: t.rotateRight },
    { a: "180", icon: "↻", label: t.rotate180 },
    { a: "h", icon: "⇋", label: t.flipH },
    { a: "v", icon: "⇵", label: t.flipV },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((i) => (
        <button key={i.a} type="button" className="btn-secondary min-h-14 px-2 text-sm" onClick={() => onAction(i.a)}>
          <span aria-hidden className="text-xl">{i.icon}</span> {i.label}
        </button>
      ))}
    </div>
  );
}
