/**
 * Sub-path the site is served from: "" on a custom domain, "/formsaathi" on GitHub Pages.
 * Next.js adds it to <Link> and bundled assets itself; use asset() for hand-written URLs
 * to files in /public.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
export const asset = (path: string) => `${BASE_PATH}${path}`;
