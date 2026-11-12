import { pageAlternates } from "../../language";

import { sitePath, absoluteUrl } from "../../site";
import type { Metadata } from "next";
import SiteNav from "../../SiteNav";
import SiteFooter from "../../SiteFooter";
import CoupleQuestions from "../../CoupleQuestions";
import ToolGuide from "../../ToolGuide";
import { getBlogArticles } from "../../blog-content";
import { socialMetadata, breadcrumbList, faqPage, webApplication, jsonLd } from "../../seo";

const language = { language: "fr" as const }.language;
const title = "Questions à se poser en couple";
const description = "Des questions à se poser en couple pour rire, se redécouvrir, se rapprocher et nourrir la complicité, même à distance.";

export const metadata: Metadata = {
  title,
  description,
  alternates: pageAlternates("/questions-couple/"),
  ...socialMetadata({ title, description, url: absoluteUrl("/questions-couple/"), locale: "fr_FR" }),
};

const steps = [
  { title: "Piochez une question", text: "Une question apparaît parmi cinq thèmes : se redécouvrir, rêver ensemble, aller plus loin, rire et vivre la distance." },
  { title: "Répondez chacun votre tour", text: "Écoutez la réponse jusqu’au bout, puis relancez sur un détail. Chacun peut passer une question." },
  { title: "Gardez-en une pour demain", text: "Quatre questions par session suffisent pour ouvrir la conversation sans la transformer en interrogatoire." },
];

const faqs = [
  { question: "Quelles questions se poser en couple ?", answer: "Alternez les registres : une question légère pour rire, une question de souvenir, une question sur vos projets et une question plus personnelle. Par exemple : « Quel petit détail chez moi te fait toujours sourire ? » ou « Si nous avions un week-end sans contraintes, où irions-nous ? »" },
  { question: "Ces questions conviennent-elles à une relation à distance ?", answer: "Oui. Le tirage comprend des questions pensées pour la distance, à poser en appel vidéo ou par message vocal. Chacun peut aussi répondre en différé, quand il est disponible." },
  { question: "Faut-il créer un compte pour tirer une question ?", answer: "Non. Le tirage fonctionne dans le navigateur, gratuitement et sans compte. Les questions tirées restent dans la session de votre onglet." },
  { question: "Combien de questions puis-je tirer ?", answer: "Quatre par session sur le site. Dans l’application Nearly, à venir sur iOS et Android, une question du jour est proposée chaque jour à votre espace." },
];

const reading = ["questions-couple-a-distance", "rituels-questions-couple", "idees-rendez-vous-couple-distance"];

export default function QuestionsCouplePage() {
  const url = absoluteUrl("/questions-couple/");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      webApplication({ name: title, description, url, language }),
      breadcrumbList([{ name: "Accueil", path: "/" }, { name: "Outils et activités", path: "/outils/" }, { name: title, path: "/questions-couple/" }]),
      faqPage(faqs),
    ],
  };
  return (
    <main className="tool-page tool-page--focused">
      <SiteNav current="tools" />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <div className="tool-breadcrumb"><a href={sitePath("/outils/")}>← Outils &amp; activités</a><span>Questions à deux</span></div>

      <header className="tool-hero tool-hero--questions">
        <p className="eyebrow"><span /> Outil gratuit · À deux</p>
        <h1>Questions à se poser<br />en <em>couple.</em></h1>
        <p>Une bonne question peut créer un vrai moment. Piochez une question, prenez le temps d’y répondre et laissez la conversation vous emmener.</p>
      </header>

      <section className="tool-question-deck" aria-label="Quatre questions à essayer">
        <CoupleQuestions />
        <p>Quatre questions par session. Prenez votre temps : chacun peut passer.</p>
      </section>

      <ToolGuide
        title="Comment utiliser ces questions"
        steps={steps}
        faqs={faqs}
        articles={getBlogArticles(language).filter(article => reading.includes(article.slug))}
        tools={[{ label: "Faire le test des langages de l’amour", href: "/test-langage-amour/" }, { label: "Jouer à Devine la couleur", href: "/devine-la-couleur/" }]}
      />

      <aside className="tools-note"><p>Une nouvelle question chaque jour dans Nearly, avec vos jeux et vos souvenirs partagés.</p><a href={sitePath("/#liste-attente")}>Rejoindre la liste d’attente <span aria-hidden="true">↗</span></a></aside>
      <SiteFooter />
    </main>
  );
}
