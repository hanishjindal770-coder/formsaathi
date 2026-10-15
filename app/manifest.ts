import type { MetadataRoute } from "next";
import { asset } from "@/lib/base";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FormSaathi — free image, PDF & form tools",
    short_name: "FormSaathi",
    description: "Resize, crop, compress and convert photos and PDFs, plus exam form tools. Works offline, files never leave your phone.",
    start_url: asset("/?source=pwa"),
    scope: asset("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6f7fb",
    theme_color: "#1e40af",
    lang: "en",
    categories: ["education", "utilities", "productivity"],
    icons: [
      { src: asset("/icons/icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: asset("/icons/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: asset("/icons/maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Resize image", url: asset("/en/resize-image/") },
      { name: "Compress image", url: asset("/en/compress-image/") },
      { name: "Compress PDF", url: asset("/en/pdf-compress/") },
    ],
  };
}
