import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A separate local cache keeps previews usable when OneDrive locks .next.
  distDir: process.env.NEARLY_BUILD_DIR || ".next",
  output: "export",
  trailingSlash: true,
  basePath: (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, ""),
  images: { unoptimized: true },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
