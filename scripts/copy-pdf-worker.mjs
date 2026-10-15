// Copies the pdf.js worker into public/ so it is served as a static file (loaded only by
// the PDF compressor, never on other pages). Runs on npm install.
import fs from "node:fs";
fs.copyFileSync("node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs", "public/pdf.worker.min.js");
