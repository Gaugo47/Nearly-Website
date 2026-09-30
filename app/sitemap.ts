import { siteUrl } from "./site";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
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
    ...["/conditions-liste-attente", "/confidentialite", "/mentions-legales"].map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date("2026-09-30"),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
