import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // "/formsaathi" when hosted on GitHub Pages; empty on a custom domain.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
