import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogSlugs, getBlogArticle, getBlogArticles } from "../../../blog-content";
import { pageAlternates } from "../../../language";
import { sitePath, absoluteUrl } from "../../../site";
import SiteNav from "../../../SiteNav";
import SiteFooter from "../../../SiteFooter";
import BlogVisual from "../../../BlogVisual";
import BlogCard from "../../../BlogCard";

const language = { language: "fr" as const }.language;
export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogSlugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug, language);
  if (!article) notFound();
  return {
    title: article.title, description: article.description,
    alternates: pageAlternates(`/blog/${article.slug}/`),
    authors: [{ name: "Nearly", url: absoluteUrl("/blog/") }],
    openGraph: {
      type: "article", url: absoluteUrl(`/blog/${article.slug}/`), locale: "fr_FR",
      title: article.title, description: article.description,
      publishedTime: article.published, modifiedTime: article.updated, authors: ["Nearly"],
      images: [{ url: absoluteUrl("/og.png"), width: 1536, height: 902, alt: article.title }],
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.description, images: [absoluteUrl("/og.png")] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getBlogArticle(slug, language);
  if (!article) notFound();
  const related = getBlogArticles(language).filter(item => article.related.includes(item.slug));
  const date = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(article.updated));
  const localOrExternal = (href: string) => href.startsWith("/") ? sitePath(href) : href;
  const url = absoluteUrl(`/blog/${article.slug}/`);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting", "@id": `${url}#article`, mainEntityOfPage: url, url,
        headline: article.title, description: article.description, abstract: article.summary,
        inLanguage: language, articleSection: article.category,
        datePublished: article.published, dateModified: article.updated,
        author: { "@type": "Organization", name: "Nearly", url: absoluteUrl("/blog/") },
        publisher: { "@type": "Organization", name: "Nearly", url: absoluteUrl("/"), logo: { "@type": "ImageObject", url: absoluteUrl("/media/nearly-icon.png") } },
        image: absoluteUrl("/og.png"), citation: article.sources.map(source => source.href.startsWith("/") ? absoluteUrl(source.href) : source.href),
      },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog/") },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ] },
      { "@type": "FAQPage", mainEntity: article.faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
      ...(article.ranking ? [{ "@type": "ItemList", name: article.title, itemListOrder: "https://schema.org/ItemListOrderAscending", numberOfItems: article.ranking.length,
        description: article.methodology, itemListElement: article.ranking.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, url: `${url}#app-${index + 1}` })) }] : []),
    ],
  };
  return (
    <main className="blog-article-page">
      <SiteNav current="blog" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <article className="blog-article">
        <nav className="blog-breadcrumb" aria-label="Fil d’Ariane"><a href={sitePath("/")}>Accueil</a><span aria-hidden="true">/</span><a href={sitePath("/blog/")}>Blog</a><span aria-hidden="true">/</span><span aria-current="page">{article.category}</span></nav>
        <header className="blog-article__header"><div><p className="eyebrow"><span /> {article.category}</p><h1>{article.title}</h1><p className="blog-article__description">{article.description}</p><p className="blog-byline">Par la rédaction Nearly <span aria-hidden="true">·</span> Mis à jour le <time dateTime={article.updated}>{date}</time> <span aria-hidden="true">·</span> {article.readTime} min de lecture</p></div><BlogVisual slug={article.slug} /></header>
        <div className="blog-article__layout">
          <aside className="blog-toc"><nav aria-label="Sommaire de l’article"><p>Dans cet article</p><a href="#essentiel">L’essentiel</a>{article.ranking && <a href="#selection">Le classement</a>}{article.sections.map(section => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}<a href="#questions">Questions fréquentes</a><a href="#sources">Sources</a></nav></aside>
          <div className="blog-body">
            <section className="blog-summary" id="essentiel"><h2>L’essentiel</h2><p>{article.summary}</p></section>
            {article.ranking && <>
              <section className="blog-methodology"><h2>Comment nous avons choisi</h2><p>{article.methodology}</p></section>
              <section id="selection"><h2>Notre classement par usage</h2>
                <div className="blog-table-wrap" role="region" aria-label="Tableau comparatif des applications" tabIndex={0}><table className="blog-table"><caption>Trois approches pour un besoin partagé</caption><thead><tr><th scope="col">Application</th><th scope="col">À privilégier pour</th><th scope="col">À savoir</th></tr></thead><tbody>{article.ranking.map((item, index) => <tr key={item.name}><th scope="row"><a href={`#app-${index + 1}`}>{index + 1}. {item.name}</a></th><td>{item.bestFor}</td><td>{item.limitation}</td></tr>)}</tbody></table></div>
                <ol className="blog-ranking">{article.ranking.map((item, index) => <li id={`app-${index + 1}`} key={item.name}><span className="blog-ranking__number" aria-hidden="true">0{index + 1}</span><div><h3>{item.name}</h3><p className="blog-ranking__fit">{item.bestFor}</p><p>{item.strength}</p><p><strong>À savoir : </strong>{item.limitation}</p><a href={localOrExternal(item.href)}>{item.name} <span aria-hidden="true">↗</span></a></div></li>)}</ol>
              </section>
            </>}
            {article.sections.map(section => <section id={section.id} key={section.id}><h2>{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
            <aside className="blog-tool"><p>Un premier pas, maintenant.</p><a className="button button--primary" href={sitePath(article.tool.href)}>{article.tool.label} <span aria-hidden="true">↗</span></a><small>Gratuit et sans compte · Aperçu de Nearly</small></aside>
            <section id="questions"><h2>Questions fréquentes</h2>{article.faqs.map(faq => <div className="blog-faq" key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}</section>
            <section className="blog-sources" id="sources"><h2>Sources &amp; repères</h2><p>{article.kind === "comparison" ? "Présentations officielles consultées le 14 octobre 2026. Les recommandations sont celles de la rédaction Nearly." : "Les fonctionnalités Nearly mentionnées ici sont celles présentées sur notre site. Ces idées sont des pistes à adapter à votre quotidien."}</p><ul>{article.sources.map(source => <li key={source.href}><a href={localOrExternal(source.href)}>{source.label} <span aria-hidden="true">↗</span></a></li>)}</ul></section>
          </div>
        </div>
      </article>
      <section className="blog-related" aria-labelledby="related-title"><p className="eyebrow">Pour continuer</p><h2 id="related-title">D’autres idées pour vos liens.</h2><div className="blog-grid">{related.map(item => <BlogCard article={item} key={item.slug} />)}</div></section>
      <aside className="blog-cta"><div><p className="eyebrow">Proches, même à distance.</p><h2>Votre prochain petit moment.</h2><p>Nearly arrive bientôt sur iOS et Android. Inscrivez-vous pour être informé du lancement.</p></div><a className="button button--primary" href={sitePath("/#liste-attente")}>Rejoindre la liste d’attente <span aria-hidden="true">↗</span></a></aside>
      <SiteFooter />
    </main>
  );
}
