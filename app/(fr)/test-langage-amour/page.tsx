import { pageAlternates } from "../../language";
import type { Metadata } from "next";
import { sitePath, absoluteUrl } from "../../site";
import SiteNav from "../../SiteNav";
import SiteFooter from "../../SiteFooter";
import LoveLanguageTest from "../../LoveLanguageTest";
import ToolGuide from "../../ToolGuide";
import { getBlogArticles } from "../../blog-content";
import { socialMetadata, breadcrumbList, faqPage, webApplication, jsonLd } from "../../seo";

const language = { language: "fr" as const }.language;
const title = "Test des langages de l’amour";
const description = "Dix choix rapides pour découvrir ce qui vous fait vous sentir aimé·e : paroles, moments, cadeaux, services ou toucher. Test gratuit, sans compte.";

export const metadata: Metadata = {
  title,
  description,
  alternates: pageAlternates("/test-langage-amour/"),
  ...socialMetadata({ title, description, url: absoluteUrl("/test-langage-amour/"), locale: "fr_FR" }),
};

const steps = [
  { title: "Dix choix à faire", text: "Entre deux attentions, gardez celle qui vous touche le plus. Comptez deux minutes." },
  { title: "Cinq langages notés", text: "Paroles valorisantes, moments de qualité, cadeaux, services rendus et toucher : chacun reçoit une note sur quatre." },
  { title: "Un résultat à comparer", text: "Faites le test chacun de votre côté, puis échangez vos résultats et une idée d’attention pour la semaine." },
];

const faqs = [
  { question: "Quels sont les cinq langages de l’amour ?", answer: "Les paroles valorisantes, les moments de qualité, les cadeaux, les services rendus et le toucher physique. Ce modèle a été proposé par l’auteur Gary Chapman en 1992 pour décrire les façons dont chacun exprime et reçoit l’affection." },
  { question: "Ce test est-il le test officiel ?", answer: "Non. C’est un test indicatif rédigé par Nearly et inspiré de ce modèle. Il ne remplace ni le questionnaire officiel ni l’avis d’un professionnel, et ne pose aucun diagnostic." },
  { question: "Peut-on avoir plusieurs langages de l’amour ?", answer: "Oui. Une égalité entre deux langages est un résultat possible : le test affiche alors les deux. Vos préférences peuvent aussi changer avec le temps ou selon la relation." },
  { question: "Comment utiliser le résultat en couple ?", answer: "Comparez vos résultats, puis choisissez chacun une attention dans le langage de l’autre pour la semaine. Le résultat propose aussi une idée adaptée à la distance." },
  { question: "Mes réponses sont-elles enregistrées ?", answer: "Non. Le calcul se fait dans votre navigateur : aucune réponse n’est envoyée ni conservée." },
];

const reading = ["rituels-questions-couple", "questions-couple-a-distance", "relation-a-distance-conseils"];

export default function LoveLanguagePage() {
  const url = absoluteUrl("/test-langage-amour/");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      webApplication({ name: title, description, url, language }),
      breadcrumbList([{ name: "Accueil", path: "/" }, { name: "Outils et activités", path: "/outils/" }, { name: title, path: "/test-langage-amour/" }]),
      faqPage(faqs),
    ],
  };
  return (
    <main className="tool-page tool-page--focused">
      <SiteNav current="tools" />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <div className="tool-breadcrumb"><a href={sitePath("/outils/")}>← Outils &amp; activités</a><span>Langages de l’amour</span></div>
      <section className="game-taster game-taster--love section">
        <div className="game-taster__intro">
          <p className="eyebrow"><span /> 10 choix · 2 minutes</p>
          <h1>Votre langage de<br /><em>l’amour.</em></h1>
          <p>Découvrez ce qui vous fait vous sentir aimé·e, puis comparez avec votre moitié.</p>
          <small className="love-test__disclaimer">Test indicatif inspiré des cinq langages décrits par Gary Chapman. Ce n’est ni le test officiel ni un diagnostic.</small>
        </div>
        <LoveLanguageTest />
      </section>

      <ToolGuide
        title="Comment fonctionne le test"
        steps={steps}
        faqs={faqs}
        articles={getBlogArticles(language).filter(article => reading.includes(article.slug))}
        tools={[{ label: "Piocher une question à deux", href: "/questions-couple/" }, { label: "Jouer à Devine la couleur", href: "/devine-la-couleur/" }]}
      />

      <aside className="tools-note"><p>Dans Nearly, une question du jour et des rituels à deux aident à entretenir ces attentions au quotidien.</p><a href={sitePath("/#liste-attente")}>Rejoindre la liste d’attente <span aria-hidden="true">↗</span></a></aside>
      <SiteFooter />
    </main>
  );
}
