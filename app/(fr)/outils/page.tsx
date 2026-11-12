import { pageAlternates } from "../../language";
import type { Metadata } from "next";
import { sitePath, absoluteUrl } from "../../site";
import SiteNav from "../../SiteNav";
import SiteFooter from "../../SiteFooter";
import { socialMetadata, breadcrumbList, jsonLd } from "../../seo";

const title = "Outils et activités à essayer";
const description = "Une question à partager, un jeu de couleurs, un test des langages de l’amour ou des frais à répartir : essayez les outils Nearly gratuitement, sans compte.";

export const metadata: Metadata = {
  title,
  description,
  alternates: pageAlternates("/outils/"),
  ...socialMetadata({ title, description, url: absoluteUrl("/outils/"), locale: "fr_FR" }),
};

const tools = [
  { icon: "“", tag: "À deux · Conversation", title: "Piochez une question", text: "Une question pour rire, se redécouvrir ou commencer une vraie discussion.", action: "Essayer les questions", href: "/questions-couple/", tone: "rose" },
  { icon: "◐", tag: "Seul ou à deux · Jeu", title: "Devinez la couleur", text: "Mémorisez une couleur, ou faites deviner la vôtre avec un indice. Le plus proche l’emporte.", action: "Lancer une partie", href: "/devine-la-couleur/", tone: "violet" },
  { icon: "♡", tag: "Seul ou à deux · Test", title: "Votre langage de l’amour", text: "Dix choix pour découvrir ce qui vous fait vous sentir aimé·e, à comparer à deux.", action: "Faire le test", href: "/test-langage-amour/", tone: "sky" },
  { icon: "€", tag: "Entre amis · Calculateur", title: "Partagez les frais", text: "Ajoutez vos dépenses et découvrez qui rembourse qui, au centime près.", action: "Ouvrir le calculateur", href: "/calculateur-remboursement/", tone: "peach" },
];

export default function ToolsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList", name: title, description, numberOfItems: tools.length,
        itemListElement: tools.map((tool, index) => ({ "@type": "ListItem", position: index + 1, name: tool.title, description: tool.text, url: absoluteUrl(tool.href) })),
      },
      breadcrumbList([{ name: "Accueil", path: "/" }, { name: "Outils et activités", path: "/outils/" }]),
    ],
  };
  return (
    <main className="tools-hub">
      <SiteNav current="tools" />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <header className="tools-hub__intro">
        <p className="eyebrow"><span /> Un avant-goût de Nearly</p>
        <h1>À vous<br /><em>de jouer.</em></h1>
        <p>Choisissez une activité et partagez un moment. C’est gratuit, sans compte.</p>
      </header>
      <section className="tools-grid tools-grid--four" aria-label="Outils et activités disponibles">
        {tools.map(tool => (
          <article className={`tool-choice tool-choice--${tool.tone}`} key={tool.href}>
            <span className="tool-choice__icon" aria-hidden="true">{tool.icon}</span>
            <p className="tool-choice__tag">{tool.tag}</p>
            <h2>{tool.title}</h2>
            <p>{tool.text}</p>
            <a href={sitePath(tool.href)}>{tool.action} <span aria-hidden="true">↗</span></a>
          </article>
        ))}
      </section>
      <aside className="tools-note tools-note--quiz"><p>Vous hésitez ? Trois questions suffisent pour savoir par quelle activité commencer.</p><a href={sitePath("/tester-un-jeu/")}>Trouver mon activité <span aria-hidden="true">↗</span></a></aside>
      <aside className="tools-note"><p>Ces essais donnent un aperçu de Nearly. Retrouvez les espaces partagés et les autres fonctionnalités dans l’application.</p><a href={sitePath("/#experience")}>Découvrir l’application <span aria-hidden="true">↗</span></a></aside>
      <aside className="tools-note tools-note--blog"><p>Envie d’idées pour la suite ? Le blog réunit des rituels, des jeux et des conseils pour rester proches.</p><a href={sitePath("/blog/")}>Explorer le blog <span aria-hidden="true">↗</span></a></aside>
      <SiteFooter />
    </main>
  );
}
