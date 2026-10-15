"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { fmt } from "@/i18n/config";
import type { ocrEn } from "@/i18n/parts/ocr";
import { cleanOcrText, defaultOcrLang, firstRunMB, txtName, type OcrLang } from "@/lib/ocr/clean";
import type { OcrProgress } from "@/lib/ocr/loader";
import { useObjectUrl } from "./shared";

type Props = { lang: "hi" | "en"; t: typeof ocrEn };

const LANGS: OcrLang[] = ["hin+eng", "hin", "eng"];
const LANG_KEY = "fs:ocrLang";
// Tesseract reads text best at roughly 20-40 px letter height. Huge phone photos only cost
// time and memory, and tiny screenshots read better when enlarged.
const MAX_SIDE = 3000;
const MIN_SIDE = 1000;

async function toCanvas(file: Blob): Promise<HTMLCanvasElement> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const long = Math.max(bmp.width, bmp.height);
  const scale = long > MAX_SIDE ? MAX_SIDE / long : long < MIN_SIDE ? 2 : 1;
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff"; // transparent PNGs would otherwise read as black
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close();
  return c;
}

export default function ImageToText({ lang, t }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [ocrLang, setOcrLang] = useState<OcrLang>(() => defaultOcrLang(lang));
  const [status, setStatus] = useState<"idle" | "prep" | OcrProgress["stage"]>("idle");
  const [pct, setPct] = useState(0);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [drag, setDrag] = useState(false);
  const run = useRef(0);
  const preview = useObjectUrl(file);
  const busy = status !== "idle";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY) as OcrLang | null;
      if (saved && LANGS.includes(saved)) setOcrLang(saved);
    } catch {
      // storage blocked: keep the default
    }
  }, []);

  const pickLang = (l: OcrLang) => {
    setOcrLang(l);
    try { localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ }
  };

  const openFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) { setError(t.notImage); return; }
    setError("");
    setText(null);
    setFile(f);
  }, [t.notImage]);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const f = [...(e.clipboardData?.items ?? [])].find((i) => i.kind === "file" && i.type.startsWith("image/"))?.getAsFile();
      if (!f || busy) return;
      e.preventDefault();
      openFile(f);
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [openFile, busy]);

  // Free the worker's memory (~100 MB) when leaving the page.
  useEffect(() => () => { import("@/lib/ocr/loader").then((m) => m.stopOcr()); }, []);

  async function start() {
    if (!file) return;
    const id = ++run.current;
    setError("");
    setText(null);
    setPct(0);
    setStatus("prep");
    try {
      const [canvas, { recognize }] = await Promise.all([toCanvas(file), import("@/lib/ocr/loader")]);
      const raw = await recognize(canvas, ocrLang, (p) => {
        if (run.current !== id) return;
        setStatus(p.stage);
        setPct(Math.round(p.progress * 100));
      });
      if (run.current !== id) return;
      const clean = cleanOcrText(raw);
      setText(clean);
      if (!clean) setError(t.empty);
    } catch {
      if (run.current === id) setError(t.failed);
    } finally {
      if (run.current === id) setStatus("idle");
    }
  }

  async function stop() {
    run.current++;
    setStatus("idle");
    (await import("@/lib/ocr/loader")).stopOcr();
  }

  async function copy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked: the user can still select the textarea
    }
  }

  function download() {
    if (!text) return;
    // BOM so Notepad on older Windows opens Hindi text as UTF-8.
    const url = URL.createObjectURL(new Blob(["﻿" + text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = txtName(file?.name);
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const pill = (on: boolean) => `min-h-11 rounded-full border px-4 text-sm ${on ? "border-brand bg-brand text-brand-ink" : "border-line"}`;
  const statusText = status === "prep" ? t.preparing : status === "load" ? fmt(t.loading, { p: pct }) : status === "recognize" ? fmt(t.recognizing, { p: pct }) : "";

  return (
    <div className="space-y-4">
      <div
        className={`card space-y-3 border-2 border-dashed text-center ${drag ? "border-brand" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f && !busy) openFile(f); }}
      >
        {preview && <img src={preview} alt="" className="mx-auto max-h-64 rounded-lg border border-line object-contain" />}
        <div className="grid grid-cols-2 gap-2">
          {[false, true].map((cam) => (
            <label key={String(cam)} className={`${file || cam ? "btn-secondary" : "btn-primary"} w-full cursor-pointer ${busy ? "pointer-events-none opacity-50" : ""}`}>
              {cam ? `📷 ${t.camera}` : `📁 ${file ? t.change : t.choose}`}
              <input
                type="file"
                accept="image/*"
                capture={cam ? "environment" : undefined}
                className="sr-only"
                disabled={busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (f) openFile(f);
                }}
              />
            </label>
          ))}
        </div>
        <p className="text-sm text-muted">{t.dropHint}</p>
      </div>

      <div className="card space-y-3">
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">{t.language}</legend>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button key={l} type="button" aria-pressed={ocrLang === l} disabled={busy} onClick={() => pickLang(l)} className={pill(ocrLang === l)}>
                {t.langs[l]}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="text-sm text-muted">{fmt(t.firstRun, { mb: firstRunMB(ocrLang) })}</p>
        {busy ? (
          <div className="space-y-2" aria-live="polite">
            <div className="h-3 overflow-hidden rounded-full bg-surface border border-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
              <div className="h-full bg-brand transition-[width]" style={{ width: `${status === "prep" ? 0 : pct}%` }} />
            </div>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span>{statusText}</span>
              <button type="button" className="btn-secondary min-h-11 px-4" onClick={stop}>{t.stop}</button>
            </div>
          </div>
        ) : (
          <button type="button" className="btn-primary w-full text-lg" disabled={!file} onClick={start}>🔤 {t.start}</button>
        )}
        {error && <p className="text-sm text-bad" role="alert">{error}</p>}
      </div>

      {text !== null && text !== "" && (
        <div className="card space-y-2">
          <label htmlFor="ocr-out" className="block text-sm font-semibold">{t.result}</label>
          <textarea
            id="ocr-out"
            className="field min-h-64 w-full font-[inherit] leading-relaxed"
            lang={ocrLang === "eng" ? "en" : "hi"}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="text-xs text-muted">{fmt(t.chars, { n: text.length })}</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="btn-primary" onClick={copy}>{copied ? t.copied : `📋 ${t.copy}`}</button>
            <button type="button" className="btn-secondary" onClick={download}>⬇️ {t.download}</button>
          </div>
        </div>
      )}

      <div className="card space-y-2 text-sm">
        <p className="font-semibold">💡 {t.tipsTitle}</p>
        <ul className="list-disc space-y-1 ps-5">
          {t.tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
        <p className="text-muted">🔒 {t.privacy}</p>
      </div>
    </div>
  );
}
