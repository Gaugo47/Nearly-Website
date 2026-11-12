import { pageAlternates } from "../../language";
import type { Metadata } from "next";
import { sitePath, absoluteUrl } from "../../site";
import GameMatch from "../../GameMatch";
import SiteNav from "../../SiteNav";
import SiteFooter from "../../SiteFooter";
import ToolGuide from "../../ToolGuide";
import { getBlogArticles } from "../../blog-content";
import { socialMetadata, breadcrumbList, faqPage, webApplication, jsonLd } from "../../seo";

const language = { language: "fr" as const }.language;
const title = "Quelle activité est faite pour vous ?";
const description = "Répondez à trois questions pour savoir par quelle activité commencer : une conversation à deux, un test à comparer ou un jeu pour lancer la soirée.";

export const metadata: Metadata = {
  title,
  description,
  alternates: pageAlternates("/tester-un-jeu/"),
  ...socialMetadata({ title, description, url: absoluteUrl("/tester-un-jeu/"), locale: "fr_FR" }),
};

const steps = [
  { title: "Entre nous", text: "Des questions du jour pour ouvrir une vraie discussion à deux, en cinq minutes." },
  { title: "Duo décrypté", text: "Un quiz de complicité : chacun répond de son côté, puis vous comparez vos réponses." },
  { title: "Qui de nous ?", text: "Un jeu de votes du Party Lab pour lancer une soirée à trois joueurs ou plus." },
];

const faqs = [
  { question: "Comment fonctionne le test ?", answer: "Vous répondez à trois questions sur votre façon de passer du temps ensemble. Le test recommande l’un des trois jeux Nearly et vous envoie vers l’activité du site qui s’en rapproche le plus." },
  { question: "Peut-on jouer à distance ?", answer: "Oui. La question proposée à la fin du test se joue en appel vidéo, par message ou de vive voix. Les jeux Nearly sont pensés pour être partagés même quand on ne vit pas au même endroit." },
  { question: "Le test est-il gratuit ?", answer: "Oui. Il est gratuit, sans compte et sans e-mail à fournir. Vous pouvez le refaire autant de fois que vous le souhaitez." },
  { question: "Où retrouver ces jeux ?", answer: "Dans l’application Nearly, qui arrive bientôt sur iOS et Android. La liste d’attente permet d’être prévenu au lancement." },
];

const reading = ["jeux-a-distance-entre-amis", "idees-rendez-vous-couple-distance", "garder-le-lien-amis-distance"];

export default function GamePage() {
  const url = absoluteUrl("/tester-un-jeu/");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      webApplication({ name: title, description, url, language }),
      breadcrumbList([{ name: "Accueil", path: "/" }, { name: "Outils et activités", path: "/outils/" }, { name: title, path: "/tester-un-jeu/" }]),
      faqPage(faqs),
    ],
  };
  return (
    <main className="tool-page tool-page--focused">
      <SiteNav current="tools" />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <div className="tool-breadcrumb"><a href={sitePath("/outils/")}>← Outils &amp; activités</a><span>Par quoi commencer</span></div>
      <section className="game-taster section">
        <div className="game-taster__intro">
          <p className="eyebrow"><span /> 3 questions · 30 secondes</p>
          <h1>Par quoi<br /><em>commencer&nbsp;?</em></h1>
          <p>Répondez instinctivement : on vous indique l’activité à essayer tout de suite, et le jeu Nearly qui vous ressemble.</p>
        </div>
        <GameMatch />
      </section>

      <ToolGuide
        title="Les trois jeux du test"
        steps={steps}
        faqs={faqs}
        articles={getBlogArticles(language).filter(article => reading.includes(article.slug))}
        tools={[{ label: "Jouer à Devine la couleur", href: "/devine-la-couleur/" }, { label: "Faire le test des langages de l’amour", href: "/test-langage-amour/" }]}
      />

      <aside className="tools-note"><p>Questions, quiz et jeux de soirée se retrouvent dans Nearly, avec vos espaces et vos souvenirs partagés.</p><a href={sitePath("/#liste-attente")}>Rejoindre la liste d’attente <span aria-hidden="true">↗</span></a></aside>
      <SiteFooter />
    </main>
  );
}
