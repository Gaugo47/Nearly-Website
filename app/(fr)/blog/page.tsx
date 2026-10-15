import type { Metadata } from "next";
import { getBlogArticles } from "../../blog-content";
import { pageAlternates } from "../../language";
import { sitePath, absoluteUrl } from "../../site";
import SiteNav from "../../SiteNav";
import SiteFooter from "../../SiteFooter";
import BlogVisual from "../../BlogVisual";
import BlogCard from "../../BlogCard";

const language = { language: "fr" as const }.language;
const articles = getBlogArticles(language);

export const metadata: Metadata = {
  title: "Blog : relations à distance, amis, famille et comparatifs d’applications",
  description: "Conseils pour rester proches à distance, idées de rituels et comparatifs d’applications pour le couple, les amis et la famille. Le blog Nearly.",
  alternates: pageAlternates("/blog/"),
  openGraph: {
    type: "website", url: absoluteUrl("/blog/"), locale: "fr_FR",
    title: "Le blog Nearly — Les liens se cultivent",
    description: "Des idées à partager et des applications à découvrir pour les liens qui comptent.",
    images: [absoluteUrl("/og.png")],
  },
  twitter: {
    card: "summary_large_image", title: "Le blog Nearly — Les liens se cultivent",
    description: "Des idées à partager et des applications à découvrir pour les liens qui comptent.",
    images: [absoluteUrl("/og.png")],
  },
};

export default function BlogPage() {
  const featured = articles[0];
  const schema = {
    "@context": "https://schema.org", "@type": "Blog",
    name: "Le blog Nearly", url: absoluteUrl("/blog/"), inLanguage: language,
    publisher: { "@type": "Organization", name: "Nearly", url: absoluteUrl("/") },
    blogPost: articles.map(article => ({
      "@type": "BlogPosting", headline: article.title, description: article.description,
      url: absoluteUrl(`/blog/${article.slug}/`), datePublished: article.published, dateModified: article.updated,
    })),
  };
  return (
    <main className="blog-hub">
      <SiteNav current="blog" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <header className="blog-intro">
        <p className="eyebrow"><span /> Le journal Nearly</p>
        <h1>Les liens<br /><em>se cultivent.</em></h1>
        <p>Un peu de curiosité, des moments à partager et des idées pour rester proches. Même de loin.</p>
        <nav className="blog-topics" aria-label="Rubriques du blog">
          <a href="#guides">Conseils &amp; rituels <span aria-hidden="true">↓</span></a>
          <a href="#comparatifs">Comparatifs d’applications <span aria-hidden="true">↓</span></a>
        </nav>
      </header>
      <a className="blog-featured" href={sitePath(`/blog/${featured.slug}/`)}>
        <BlogVisual slug={featured.slug} />
        <div className="blog-featured__copy"><p className="eyebrow">À la une · {featured.readTime} min</p><h2>{featured.title}</h2><p>{featured.description}</p><span className="blog-read">Lire l’article <span aria-hidden="true">↗</span></span></div>
      </a>
      {(["guide", "comparison"] as const).map(kind => (
        <section className="blog-collection" id={kind === "guide" ? "guides" : "comparatifs"} key={kind} aria-labelledby={`${kind}-title`}>
          <div className="blog-collection__heading"><p className="eyebrow">{kind === "guide" ? "À essayer au quotidien" : "Choisir selon vos envies"}</p><h2 id={`${kind}-title`}>{kind === "guide" ? "Petites idées, grands liens." : "Une app pour votre lien."}</h2>
            <p>{kind === "guide" ? "Couple, amis ou famille : prenez ce qui vous ressemble." : "Nos sélections par usage, avec les points forts, les limites et les sources. Comparatifs rédigés par Nearly ; application Nearly à venir."}</p>
          </div>
          <div className="blog-grid">{articles.filter(article => article.kind === kind).map(article => <BlogCard article={article} key={article.slug} />)}</div>
        </section>
      ))}
      <aside className="blog-cta"><div><p className="eyebrow">De la lecture aux petits moments</p><h2>À vous de créer le lien.</h2><p>Une question, un jeu, un calculateur : découvrez les essais Nearly, gratuits et sans compte.</p></div><a className="button button--primary" href={sitePath("/outils/")}>Essayer les outils <span aria-hidden="true">↗</span></a></aside>
      <SiteFooter />
    </main>
  );
}
