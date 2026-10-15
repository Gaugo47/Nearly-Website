import { siteUrl } from "./site";
import { publicPages, pageAlternates } from "./language";
import type { MetadataRoute } from "next";
import { getBlogArticles } from "./blog-content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const french: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/blog/`, lastModified: new Date("2026-10-14"), changeFrequency: "weekly", priority: 0.8 },
    ...getBlogArticles("fr").map(article => ({
      url: `${siteUrl}/blog/${article.slug}/`,
      lastModified: new Date(article.updated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: siteUrl,
      lastModified: new Date("2026-10-01"),
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
    ...["/outils/", "/tester-un-jeu/"].map(path => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date("2026-10-01"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...["/cgu", "/confidentialite-app"].map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date("2026-10-04"),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    {
      url: `${siteUrl}/contact/`,
      lastModified: new Date("2026-10-08"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...["/conditions-liste-attente", "/confidentialite", "/mentions-legales"].map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date("2026-09-30"),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
  return french.flatMap(entry => {
    const page = entry.url.slice(siteUrl.length).replace(/^\//, "").replace(/\/$/, "");
    if (!publicPages.some(path => path === page)) return [entry];
    const path = page ? `/${page}/` : "/";
    const alternates = { languages: pageAlternates(path).languages };
    return [
      { ...entry, alternates },
      { ...entry, url: `${siteUrl}/en${path}`, lastModified: page.startsWith("blog") ? entry.lastModified : new Date("2026-10-08"), alternates },
    ];
  });
}
