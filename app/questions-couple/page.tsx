
import { absoluteUrl, sitePath } from "../site";
import type { Metadata } from "next";
import SiteNav from "../SiteNav";
import SiteFooter from "../SiteFooter";
import CoupleQuestions from "../CoupleQuestions";

export const metadata: Metadata = {
  title: "Questions à se poser en couple",
  description: "Des questions à se poser en couple pour rire, se redécouvrir, se rapprocher et nourrir la complicité, même à distance.",
  alternates: { canonical: absoluteUrl("/questions-couple/") },
};

export default function QuestionsCouplePage() {
  return (
    <main className="tool-page tool-page--focused">
      <SiteNav current="tools" />
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

      <aside className="tools-note"><p>Une nouvelle question chaque jour dans Nearly, avec vos jeux et vos souvenirs partagés.</p><a href={sitePath("/#experience")}>Découvrir l’application <span aria-hidden="true">↗</span></a></aside>
      <SiteFooter />
    </main>
  );
}
