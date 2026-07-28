import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nearly.app";
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-07-28"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
