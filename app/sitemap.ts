import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gaugo47.github.io/Nearly-Website";
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-07-28"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/calculateur-remboursement`,
      lastModified: new Date("2026-08-09"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/questions-couple`,
      lastModified: new Date("2026-08-09"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
