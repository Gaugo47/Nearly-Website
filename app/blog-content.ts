import french from "../content/blog.fr.json";
import english from "../content/blog.en.json";

export type BlogArticle = {
  slug: string;
  category: string;
  kind: "guide" | "comparison";
  title: string;
  description: string;
  summary: string;
  readTime: number;
  published: string;
  updated: string;
  sections: { id: string; title: string; paragraphs: string[]; bullets?: string[] }[];
  ranking?: { name: string; bestFor: string; strength: string; limitation: string; href: string }[];
  methodology?: string;
  faqs: { question: string; answer: string }[];
  sources: { label: string; href: string }[];
  related: string[];
  tool: { label: string; href: string };
};

export { blogSlugs } from "./blog-slugs";

export function getBlogArticles(language: "fr" | "en"): BlogArticle[] {
  return (language === "en" ? english : french) as BlogArticle[];
}

export function getBlogArticle(slug: string, language: "fr" | "en") {
  return getBlogArticles(language).find(article => article.slug === slug);
}
