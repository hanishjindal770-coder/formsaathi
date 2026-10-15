import type { Worker } from "tesseract.js";
import { asset } from "@/lib/base";
import type { OcrLang } from "./clean";

export type OcrProgress = { stage: "load" | "recognize"; progress: number };

let current: { lang: OcrLang; worker: Promise<Worker> } | null = null;
let onProgress: ((p: OcrProgress) => void) | null = null;

/**
 * One shared worker, created on first use. tesseract.js is imported dynamically so its code
 * stays out of the page's initial JS. All files come from /ocr on our own origin
 * (copied there by scripts/copy-ocr-assets.mjs).
 */
async function getWorker(lang: OcrLang): Promise<Worker> {
  if (current?.lang === lang) return current.worker;
  if (current) {
    const old = current.worker;
    current = null;
    old.then((w) => w.terminate()).catch(() => {});
  }
  const worker = (async () => {
    const mod = await import("tesseract.js");
    // CommonJS package: bundlers expose it either as named exports or under `default`.
    const { createWorker, OEM } = mod.default ?? mod;
    return createWorker(lang, OEM.LSTM_ONLY, {
      workerPath: asset("/ocr/worker.min.js"),
      corePath: asset("/ocr/core"), // a folder: the worker picks the SIMD build when the device supports it
      langPath: asset("/ocr/lang"),
      gzip: true,
      // Same-origin worker URL instead of a blob: keeps it under the service worker for offline use.
      workerBlobURL: false,
      logger: (m) => {
        if (!onProgress) return;
        const stage = m.status === "recognizing text" ? "recognize" : "load";
        onProgress({ stage, progress: typeof m.progress === "number" ? m.progress : 0 });
      },
    });
  })();
  current = { lang, worker };
  // A failed load (e.g. offline on first use) must not be cached forever.
  worker.catch(() => { if (current?.worker === worker) current = null; });
  return worker;
}

export async function recognize(image: HTMLCanvasElement | Blob, lang: OcrLang, progress: (p: OcrProgress) => void): Promise<string> {
  onProgress = progress;
  try {
    const worker = await getWorker(lang);
    const { data } = await worker.recognize(image);
    return data.text;
  } finally {
    onProgress = null;
  }
}

export function stopOcr() {
  const w = current?.worker;
  current = null;
  w?.then((x) => x.terminate()).catch(() => {});
}
