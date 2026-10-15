import type { BlogArticle } from "./blog-content";
import { sitePath } from "./site";
import BlogVisual from "./BlogVisual";

export default function BlogCard({ article }: { article: BlogArticle }) {
  const href = sitePath(`/blog/${article.slug}/`);
  return <article className="blog-card">
    <a className="blog-card__cover" href={href} aria-label={article.title}><BlogVisual slug={article.slug} /></a>
    <div className="blog-card__body">
      <p className="blog-card__category">{article.category}<span>{article.readTime} min</span></p>
      <h3><a href={href}>{article.title}</a></h3>
      <p className="blog-card__description">{article.description}</p>
      <a className="blog-read" href={href}>Lire l’article <span aria-hidden="true">↗</span></a>
    </div>
  </article>;
}
