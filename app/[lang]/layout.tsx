import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDict, isLang, LOCALES } from "@/i18n";
import { SITE_URL } from "@/lib/routes";
import { asset } from "@/lib/base";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SWRegister from "@/components/SWRegister";
import Analytics from "@/components/Analytics";

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: t.site.name,
    title: { default: `${t.site.name} — ${t.site.tagline}`, template: `%s | ${t.site.name}` },
    description: t.site.tagline,
    manifest: asset("/manifest.webmanifest"),
    icons: { icon: asset("/icons/icon-192.png"), apple: asset("/icons/apple-touch-icon.png") },
    openGraph: { siteName: t.site.name, type: "website", locale: lang === "hi" ? "hi_IN" : "en_IN", images: [`${SITE_URL}/og.png`] },
    twitter: { card: "summary_large_image" },
    appleWebApp: { capable: true, title: t.site.name, statusBarStyle: "default" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e40af" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
};

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang}>
      <body className="min-h-dvh font-sans antialiased">
        <SiteHeader lang={lang} />
        <main className="mx-auto w-full max-w-3xl px-4 pb-16">{children}</main>
        <SiteFooter lang={lang} />
        <SWRegister />
        <Analytics />
      </body>
    </html>
  );
}
