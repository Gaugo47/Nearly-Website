import { pageAlternates } from "../../language";
import type { Metadata } from "next";
import { sitePath } from "../../site";
import SiteNav from "../../SiteNav";
import SiteFooter from "../../SiteFooter";

export const metadata: Metadata = {
  title: "Outils et activités à essayer",
  description: "Une question à partager, un jeu à découvrir ou des frais à répartir : essayez les outils Nearly gratuitement, sans compte.",
  alternates: pageAlternates("/outils/"),
};

const tools = [
  { icon: "“", tag: "À deux · Conversation", title: "Piochez une question", text: "Une question pour rire, se redécouvrir ou commencer une vraie discussion.", action: "Essayer les questions", href: "/questions-couple/", tone: "rose" },
  { icon: "✦", tag: "À deux ou en groupe · Test", title: "Trouvez votre jeu", text: "Trois réponses pour découvrir l’activité Nearly qui vous ressemble.", action: "Faire le test", href: "/tester-un-jeu/", tone: "violet" },
  { icon: "€", tag: "Entre amis · Calculateur", title: "Partagez les frais", text: "Ajoutez vos dépenses et découvrez qui rembourse qui, au centime près.", action: "Ouvrir le calculateur", href: "/calculateur-remboursement/", tone: "peach" },
];

export default function ToolsPage() {
  return (
    <main className="tools-hub">
      <SiteNav current="tools" />
      <header className="tools-hub__intro">
        <p className="eyebrow"><span /> Un avant-goût de Nearly</p>
        <h1>À vous<br /><em>de jouer.</em></h1>
        <p>Choisissez une activité et partagez un moment. C’est gratuit, sans compte.</p>
      </header>
      <section className="tools-grid" aria-label="Outils et activités disponibles">
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
      <aside className="tools-note"><p>Ces essais donnent un aperçu de Nearly. Retrouvez les espaces partagés et les autres fonctionnalités dans l’application.</p><a href={sitePath("/#experience")}>Découvrir l’application <span aria-hidden="true">↗</span></a></aside>
      <SiteFooter />
    </main>
  );
}
