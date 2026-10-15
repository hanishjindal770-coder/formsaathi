// Puts everything the Image-to-text tool needs into public/ocr/ so OCR runs from our own
// origin (works under the GitHub Pages base path, no third-party CDN, nothing uploaded):
//   public/ocr/worker.min.js              tesseract.js web worker
//   public/ocr/core/*-lstm.wasm.js        tesseract core (wasm inlined); the worker picks the
//                                         plain / SIMD / relaxed-SIMD build the device supports
//   public/ocr/lang/{eng,hin}.traineddata.gz   "fast" LSTM models from tesseract-ocr/tessdata_fast
// The models are not on npm in the fast flavour, so they are downloaded once (pinned tag,
// checked against a SHA-256) and kept; later runs reuse them. Runs on npm install.
// Set OCR_SKIP_DOWNLOAD=1 to skip the download (e.g. offline installs); the tool then can't load a language.
import crypto from "node:crypto";
import fs from "node:fs";
import zlib from "node:zlib";

const OUT = "public/ocr";
const CORE = "node_modules/tesseract.js-core";
const TESSDATA = "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/4.1.0";
const LANGS = {
  eng: "7d4322bd2a7749724879683fc3912cb542f19906c83bcc1a52132556427170b2",
  hin: "4c73ffc59d497c186b19d1e90f5d721d678ea6b2e277b719bee4e2af12271825",
};

fs.mkdirSync(`${OUT}/core`, { recursive: true });
fs.mkdirSync(`${OUT}/lang`, { recursive: true });

fs.copyFileSync("node_modules/tesseract.js/dist/worker.min.js", `${OUT}/worker.min.js`);
// Only the LSTM-only builds: we always use the LSTM engine, and they are ~25% smaller.
for (const f of ["tesseract-core-lstm.wasm.js", "tesseract-core-simd-lstm.wasm.js", "tesseract-core-relaxedsimd-lstm.wasm.js"]) {
  fs.copyFileSync(`${CORE}/${f}`, `${OUT}/core/${f}`);
}
fs.copyFileSync(`${CORE}/LICENSE`, `${OUT}/LICENSE.txt`);

const sha = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

let failed = false;
for (const [lang, hash] of Object.entries(LANGS)) {
  const dest = `${OUT}/lang/${lang}.traineddata.gz`;
  try {
    if (sha(zlib.gunzipSync(fs.readFileSync(dest))) === hash) continue; // already there and intact
  } catch {
    // missing or damaged: download below
  }
  if (process.env.OCR_SKIP_DOWNLOAD) {
    console.warn(`! OCR: skipped downloading ${lang}.traineddata (OCR_SKIP_DOWNLOAD)`);
    continue;
  }
  try {
    const res = await fetch(`${TESSDATA}/${lang}.traineddata`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (sha(buf) !== hash) throw new Error("checksum mismatch");
    fs.writeFileSync(dest, zlib.gzipSync(buf, { level: 9 }));
    console.log(`✓ OCR: ${lang}.traineddata.gz`);
  } catch (e) {
    console.error(`✗ OCR: could not download ${lang}.traineddata from ${TESSDATA}: ${e.message}`);
    failed = true;
  }
}
if (failed) process.exit(1);
