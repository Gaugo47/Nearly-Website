import { pageAlternates } from "../../language";
import type { Metadata } from "next";
import { sitePath, absoluteUrl } from "../../site";
import SiteNav from "../../SiteNav";
import SiteFooter from "../../SiteFooter";
import ColorGuess from "../../ColorGuess";
import ToolGuide from "../../ToolGuide";
import { getBlogArticles } from "../../blog-content";
import { socialMetadata, breadcrumbList, faqPage, webApplication, jsonLd } from "../../seo";

const language = { language: "fr" as const }.language;
const title = "Devine la couleur : le jeu de couleurs seul ou à deux";
const description = "Mémorisez une couleur et retrouvez-la, ou faites deviner la vôtre avec un indice. Un jeu gratuit à jouer seul ou à deux, sans compte.";

export const metadata: Metadata = {
  title,
  description,
  alternates: pageAlternates("/devine-la-couleur/"),
  ...socialMetadata({ title, description, url: absoluteUrl("/devine-la-couleur/"), locale: "fr_FR" }),
};

const steps = [
  { title: "Choisissez un mode", text: "En solo, vous jouez contre votre mémoire en cinq manches. À deux, vous devinez à tour de rôle la couleur de l’autre." },
  { title: "Réglez trois curseurs", text: "Teinte, saturation et luminosité : ajustez-les jusqu’à retrouver la couleur que vous avez en tête." },
  { title: "Comparez les couleurs", text: "Les deux couleurs s’affichent côte à côte avec un score sur 100. Plus elles sont proches, plus vous marquez." },
];

const faqs = [
  { question: "Comment jouer à Devine la couleur ?", answer: "En solo, une couleur s’affiche trois secondes, puis vous la recréez de mémoire avec trois curseurs. À deux, un joueur choisit une couleur en secret et donne un indice ; l’autre essaie de la retrouver." },
  { question: "Comment le score est-il calculé ?", answer: "Le jeu mesure l’écart entre la couleur à trouver et votre réponse. Deux couleurs identiques valent 100 points ; plus elles s’éloignent, plus le score baisse." },
  { question: "Peut-on jouer à Devine la couleur à distance ?", answer: "Oui, en partageant votre écran pendant un appel vidéo, ou en jouant chacun en solo avant de comparer vos scores. Le mode à deux est prévu pour un téléphone que l’on se passe." },
  { question: "Faut-il un compte pour jouer ?", answer: "Non. Le jeu fonctionne dans le navigateur, gratuitement et sans compte. Aucune partie n’est enregistrée." },
];

const reading = ["jeux-a-distance-entre-amis", "idees-rendez-vous-couple-distance", "relation-a-distance-conseils"];

export default function ColorGuessPage() {
  const url = absoluteUrl("/devine-la-couleur/");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      webApplication({ name: title, description, url, language }),
      breadcrumbList([{ name: "Accueil", path: "/" }, { name: "Outils et activités", path: "/outils/" }, { name: title, path: "/devine-la-couleur/" }]),
      faqPage(faqs),
    ],
  };
  return (
    <main className="tool-page tool-page--focused">
      <SiteNav current="tools" />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <div className="tool-breadcrumb"><a href={sitePath("/outils/")}>← Outils &amp; activités</a><span>Devine la couleur</span></div>

      <header className="tool-hero tool-hero--color">
        <p className="eyebrow"><span /> Jeu gratuit · Seul ou à deux</p>
        <h1>Devine la<br /><em>couleur.</em></h1>
        <p>Une couleur, trois curseurs, et votre mémoire. Jouez en solo, ou faites deviner votre couleur à quelqu’un avec un simple indice.</p>
      </header>

      <section className="color-game-section" aria-label="Jeu Devine la couleur">
        <ColorGuess />
      </section>

      <ToolGuide
        title="Comment jouer"
        steps={steps}
        faqs={faqs}
        articles={getBlogArticles(language).filter(article => reading.includes(article.slug))}
        tools={[{ label: "Faire le test des langages de l’amour", href: "/test-langage-amour/" }, { label: "Piocher une question à deux", href: "/questions-couple/" }]}
      />

      <aside className="tools-note"><p>D’autres mini-jeux à deux et en groupe vous attendent dans Nearly, avec vos espaces et vos souvenirs partagés.</p><a href={sitePath("/#liste-attente")}>Rejoindre la liste d’attente <span aria-hidden="true">↗</span></a></aside>
      <SiteFooter />
    </main>
  );
}
