import type { Metadata } from "next";
import { absoluteUrl, sitePath } from "../site";
import GameMatch from "../GameMatch";
import SiteNav from "../SiteNav";
import SiteFooter from "../SiteFooter";

export const metadata: Metadata = {
  title: "Quel jeu est fait pour vous ?",
  description: "Répondez à trois questions pour découvrir le jeu Nearly qui correspond à votre façon d’être ensemble.",
  alternates: { canonical: absoluteUrl("/tester-un-jeu/") },
};

export default function GamePage() {
  return (
    <main className="tool-page tool-page--focused">
      <SiteNav current="tools" />
      <div className="tool-breadcrumb"><a href={sitePath("/outils/")}>← Outils &amp; activités</a><span>Votre jeu Nearly</span></div>
      <section className="game-taster section">
        <div className="game-taster__intro">
          <p className="eyebrow"><span /> 3 questions · 30 secondes</p>
          <h1>Quel jeu est fait<br />pour <em>vous&nbsp;?</em></h1>
          <p>Répondez instinctivement et découvrez votre activité à partager.</p>
        </div>
        <GameMatch />
      </section>
      <SiteFooter />
    </main>
  );
}
