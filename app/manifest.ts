import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FormSaathi — फॉर्मसाथी",
    short_name: "FormSaathi",
    description: "Photo, signature and age tools for Indian government exam forms. Works offline, files never leave your phone.",
    start_url: "/hi/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6f7fb",
    theme_color: "#1e40af",
    lang: "hi",
    categories: ["education", "utilities", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "फोटो रिसाइज़र / Photo resizer", url: "/hi/photo-resize/" },
      { name: "सिग्नेचर रिसाइज़र / Signature resizer", url: "/hi/signature-resize/" },
      { name: "आयु कैलकुलेटर / Age calculator", url: "/hi/age-calculator/" },
    ],
  };
}
