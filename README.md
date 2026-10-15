# FormSaathi (फॉर्मसाथी)

Free, mobile-first, Hindi-first toolkit for Indian government-exam forms. Pick an exam and every tool sets itself to that exam's rules. All file processing happens in the browser; nothing is uploaded. Ships as a static site (Next.js `output: 'export'`) and an installable, offline-capable PWA.

**Status: Phase 1 complete.** Tools: photo, signature, thumb impression and handwritten declaration resizers (generic or set to an exam), photo with name & date (UPSC), age calculator, compress PDF to KB, images to PDF, merge PDFs, passport photo print sheet (8/16/32 on A4), JPG↔PNG. Keyword pages: resize image to X KB / X×Y px, signature to X KB, compress PDF to X KB, JPG↔PNG. Phase 2 tools are stubbed in `lib/tools/registry.ts`.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000/hi/  (service worker is off in dev)
npm test               # Vitest: target-KB, JPEG padding/DPI, crop maths, signature cleanup, age + leap years, exam data
npm run validate:exams # checks every data/exams/*.json against the zod schema
npm run build          # validate → next build → out/ + out/sw.js
npx serve out          # test the production build, offline mode included
```

Node 20+ (CI uses 22). Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your real domain before deploying (it drives canonical URLs, hreflang and the sitemap).

## Deploy (free)

The build output is plain static files in `out/`.

- **GitHub Pages (current)**: `.github/workflows/pages.yml` builds and publishes on every push to `main`, at `https://<user>.github.io/<repo>/`. It sets `NEXT_PUBLIC_BASE_PATH=/<repo>` because a project site lives under a sub-path. One-time setup: repo **Settings → Pages → Source: GitHub Actions**. When you move to a custom domain, drop `NEXT_PUBLIC_BASE_PATH`.

- **Cloudflare Pages**: build command `npm run build`, output directory `out`, env `NEXT_PUBLIC_SITE_URL`, optional `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`.
- **Netlify**: same build command, publish directory `out`.
- **Vercel**: framework preset Next.js; it detects `output: 'export'`. Set the same env vars.

## Adding or verifying an exam

1. Copy an existing file in `data/exams/` to `data/exams/<slug>.json` (file name must equal `slug`, kebab-case).
2. Fill values **only from the official notification**. Put the notification PDF link in `sourceUrl`.
3. When every value has been checked, set `"verified": true`, set `lastVerified` to today (YYYY-MM-DD) and delete `todo`. Unverified exams show an extra warning on every page.
4. `npm run validate:exams`. Pages for that exam appear on the next build. A tool page is only generated when the exam has data for it (no `signature` → no signature page).

Schema: `lib/exams/schema.ts`. Two small extensions to the original spec:
- `age.upperLimitRule`: `"notExceeding"` (default; "not more than 32" → eligible until the day before the 33rd birthday) or `"notAttained"` (UPSC wording "must not have attained 32").
- `todo`: list of what still needs checking (editor-only, not shown to users).
- `widthPx`/`heightPx` may be a number or `{ "min": 350, "max": 1000 }`.

**All 16 template files are `verified: false`.** They are filled from commonly published figures to give the tools something to run on; every value needs checking.

## How the image pipeline works

`lib/image/`: crop → resize (stepwise halving for sharpness) → optional ink cleanup → optional name/date strip → background check → encode.

- **Hitting the KB range** (`targetSize.ts`): binary search on JPEG quality for the highest quality under the max. If even full quality is under the min, the JPEG is padded with comment segments (`jpeg.ts`), which every decoder ignores, so it reaches the minimum without blurring or upscaling. Bounds are conservative: min uses 1 KB = 1024 B, max uses 1000 B, so the file passes either convention.
- **cm sizes**: converted at the exam's `dpi`, or 100 DPI when not given (shown to the user). DPI is also written into the JPEG header.
- **Signature cleanup** (`pixels.ts`): lighting flattening (removes phone shadows), Otsu threshold, soft edge, black or blue ink, auto-crop to ink.
- **Background check**: samples the left/right/top border of the photo.

## Structure

```
app/[lang]/                 home + exam picker
app/[lang]/[slug]/          exam hub | generic tool | keyword page (lib/routes.ts resolves which)
app/[lang]/[slug]/[tool]/   exam × tool page
app/sitemap.ts robots.ts manifest.ts
components/tools/           DocResizer, Cropper, AgeCalculator (client)
components/seo/             rules tables, FAQ + FAQPage schema, breadcrumbs
components/AdSlot.tsx       renders nothing unless NEXT_PUBLIC_ADS_ENABLED=1
components/AffiliateBox.tsx reads data/affiliates.json (empty)
lib/image  lib/exams  lib/pdf (pdf-lib; pdf.js loaded only by the compressor)  lib/print (sheet layout)  lib/tools/registry.ts (all tools incl. Phase 2 stubs)
data/exams/*.json  data/affiliates.json  lib/keywords.ts (keyword page sizes)
i18n/en.ts hi.ts            all UI text
scripts/build-sw.mjs        generates out/sw.js after build
scripts/make-icons.mjs      renders icons/OG image from public/icons/icon.svg
```

Adding a tool: add it to `lib/tools/registry.ts` (`enabled: true`), add text to `i18n/*.ts`, render it in `components/ToolSlot.tsx`. Routes, links and sitemap follow automatically. The paid "document kit (ZIP)" upsell has a marked spot in `components/SiteFooter.tsx`.
