// Renders public/icons/icon.svg to the PNG sizes the PWA manifest needs, plus an OG image,
// using the Chromium that Playwright provides. Run once after changing the icon: npm run icons
import { chromium } from "playwright-core";
import fs from "node:fs";

const svg = fs.readFileSync("public/icons/icon.svg", "utf8");
// Uses CHROMIUM_PATH if set, otherwise your installed Google Chrome.
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : { channel: "chrome" });
const page = await browser.newPage();

async function render(out, size, { maskable = false } = {}) {
  await page.setViewportSize({ width: size, height: size });
  const inner = maskable ? `<div style="width:100%;height:100%;background:#1e40af;display:grid;place-items:center"><div style="width:70%;height:70%">${svg}</div></div>` : svg;
  await page.setContent(`<style>html,body{margin:0;width:${size}px;height:${size}px}svg{width:100%;height:100%;display:block}</style>${inner}`);
  await page.screenshot({ path: out, omitBackground: !maskable });
}
await render("public/icons/icon-192.png", 192);
await render("public/icons/icon-512.png", 512);
await render("public/icons/maskable-512.png", 512, { maskable: true });
await render("public/icons/apple-touch-icon.png", 180, { maskable: true });

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<style>@font-face{font-family:N;src:url(data:font/woff2;base64,${fs.readFileSync("public/fonts/noto-sans-devanagari-devanagari-600-normal.woff2").toString("base64")})}
body{margin:0;width:1200px;height:630px;background:#1e40af;color:#fff;font-family:N,sans-serif;display:flex;align-items:center;gap:56px;padding:0 80px;box-sizing:border-box}
.i{width:220px;height:220px;flex:none}.i svg{width:100%;height:100%}h1{font-size:76px;margin:0}p{font-size:34px;margin:12px 0 0;opacity:.9}</style>
<div class="i">${svg}</div><div><h1>FormSaathi</h1><h1>फॉर्मसाथी</h1><p>Photo · Signature · Age — हर परीक्षा के नियम से</p></div>`);
await page.waitForTimeout(300);
await page.screenshot({ path: "public/og.png" });
await browser.close();
console.log("icons written");
