import type { Metadata } from "next";
import CoupleQuestions from "../CoupleQuestions";

export const metadata: Metadata = {
  title: "Questions à se poser en couple",
  description: "Des questions à se poser en couple pour rire, se redécouvrir, se rapprocher et nourrir la complicité, même à distance.",
  alternates: { canonical: "/questions-couple" },
};

const themes = [
  ["Pour rire", "Des questions légères pour se surprendre et finir en fou rire."],
  ["Pour se redécouvrir", "Les petits détails, souvenirs et envies qu’on oublie parfois de partager."],
  ["Pour aller plus loin", "Des questions douces pour parler de ses besoins, de son rythme et de son lien."],
  ["À distance", "Des pistes concrètes pour se sentir présent même quand les kilomètres s’en mêlent."],
];

export default function QuestionsCouplePage() {
  return (
    <main className="tool-page">
      <nav className="tool-nav" aria-label="Navigation Nearly">
        <a className="tool-nav__brand" href="/" aria-label="Nearly, accueil"><img src="/media/nearly-app-icon-liquid-glass-v2.png" alt="Nearly" /></a>
        <div><a href="/questions-couple" aria-current="page">Questions couple</a><a href="/calculateur-remboursement">Calculateur</a></div>
        <a className="tool-nav__back" href="/#tester-un-jeu">Découvrir Nearly <span aria-hidden="true">↗</span></a>
      </nav>

      <header className="tool-hero tool-hero--questions">
        <p className="eyebrow"><span /> Outil gratuit · À deux</p>
        <h1>Questions à se poser<br />en <em>couple.</em></h1>
        <p>Une bonne question peut créer un vrai moment. Piochez une question, prenez le temps d’y répondre et laissez la conversation vous emmener.</p>
        <div className="tool-hero__facts"><span><strong>04</strong> questions à tester</span><span><strong>5</strong> minutes pour vous</span><span><strong>∞</strong> façons de répondre</span></div>
      </header>

      <section className="question-tool-section" aria-labelledby="question-du-jour">
        <div className="tool-section-heading"><p className="eyebrow"><span /> Piochez une question</p><h2 id="question-du-jour">Un moment pour<br /><em>vous deux.</em></h2><p>Il n’y a aucune bonne réponse : laissez les silences, les anecdotes et les détours faire leur travail. L’essai permet de découvrir quatre questions par visiteur.</p></div>
        <CoupleQuestions />
      </section>

      <section className="question-themes" aria-label="Thèmes de questions de couple">
        {themes.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{text}</p></article>)}
      </section>

      <section className="tool-conversion tool-conversion--coral">
        <p className="eyebrow eyebrow--light"><span /> La suite dans Nearly</p>
        <h2>Une nouvelle question,<br /><em>chaque jour.</em></h2>
        <p>Nearly transforme ces instants en rituels partagés : questions, jeux de complicité, souvenirs et attentions pour rester proches, où que vous soyez.</p>
        <div className="tool-conversion__actions"><a className="button button--primary" href="/#tester-un-jeu">Faire le test de jeu <span aria-hidden="true">↗</span></a><a href="/#telecharger">Découvrir Nearly</a></div>
      </section>
    </main>
  );
}
