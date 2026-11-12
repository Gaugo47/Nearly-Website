import { siteUrl } from "./site";
import { publicPages, pageAlternates } from "./language";
import type { MetadataRoute } from "next";
import { getBlogArticles } from "./blog-content";

export const dynamic = "force-static";

type Frequency = "weekly" | "monthly" | "yearly";
// Paths match each page's canonical URL, trailing slash included. Dates are the last real content change.
const pages: [path: string, lastModified: string, changeFrequency: Frequency, priority: number][] = [
  ["/", "2026-11-12", "weekly", 1],
  ["/outils/", "2026-11-12", "monthly", 0.8],
  ["/questions-couple/", "2026-11-12", "monthly", 0.9],
  ["/calculateur-remboursement/", "2026-11-12", "monthly", 0.9],
  ["/devine-la-couleur/", "2026-11-12", "monthly", 0.9],
  ["/test-langage-amour/", "2026-11-12", "monthly", 0.9],
  ["/tester-un-jeu/", "2026-11-12", "monthly", 0.6],
  ["/contact/", "2026-10-08", "yearly", 0.5],
  ["/cgu/", "2026-10-04", "monthly", 0.4],
  ["/confidentialite-app/", "2026-10-04", "monthly", 0.4],
  ["/conditions-liste-attente/", "2026-09-30", "yearly", 0.3],
  ["/confidentialite/", "2026-09-30", "yearly", 0.3],
  ["/mentions-legales/", "2026-09-30", "yearly", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getBlogArticles("fr");
  const blogLastModified = new Date(Math.max(...articles.map(article => Date.parse(article.updated))));
  const french: (MetadataRoute.Sitemap[number] & { path: string })[] = [
    ...pages.map(([path, lastModified, changeFrequency, priority]) => ({ path, url: `${siteUrl}${path}`, lastModified: new Date(lastModified), changeFrequency, priority })),
    { path: "/blog/", url: `${siteUrl}/blog/`, lastModified: blogLastModified, changeFrequency: "weekly", priority: 0.8 },
    ...articles.map(article => ({
      path: `/blog/${article.slug}/`,
      url: `${siteUrl}/blog/${article.slug}/`,
      lastModified: new Date(article.updated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
  return french.flatMap(({ path, ...entry }) => {
    if (!publicPages.some(page => (page ? `/${page}/` : "/") === path)) return [entry];
    const alternates = { languages: pageAlternates(path).languages };
    return [
      { ...entry, alternates },
      { ...entry, url: `${siteUrl}/en${path}`, alternates },
    ];
  });
}
