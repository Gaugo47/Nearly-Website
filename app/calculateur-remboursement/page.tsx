import type { Metadata } from "next";
import ExpenseDemo from "../ExpenseDemo";

export const metadata: Metadata = {
  title: "Calculateur de remboursement entre amis",
  description: "Calculez gratuitement qui doit rembourser qui après une sortie, un week-end ou des vacances. Ajoutez vos frais et obtenez les remboursements à faire.",
  alternates: { canonical: "/calculateur-remboursement" },
};

export default function CalculateurRemboursementPage() {
  return (
    <main className="tool-page">
      <nav className="tool-nav" aria-label="Navigation Nearly">
        <a className="tool-nav__brand" href="/" aria-label="Nearly, accueil"><img src="/media/nearly-app-icon-liquid-glass-v2.png" alt="Nearly" /></a>
        <div><a href="/questions-couple">Questions couple</a><a href="/calculateur-remboursement" aria-current="page">Calculateur</a></div>
        <a className="tool-nav__back" href="/#frais-partages">Découvrir Nearly <span aria-hidden="true">↗</span></a>
      </nav>

      <header className="tool-hero tool-hero--expense">
        <p className="eyebrow"><span /> Outil gratuit · Frais partagés</p>
        <h1>Qui doit rembourser<br /><em>qui&nbsp;?</em></h1>
        <p>Ajoutez les dépenses du groupe, choisissez qui a payé et qui participe. Le calculateur indique les remboursements les plus simples, au centime près.</p>
        <div className="tool-hero__facts"><span><strong>3</strong> frais à tester</span><span><strong>5</strong> devises</span><span><strong>0</strong> compte requis</span></div>
      </header>

      <section className="tool-demo-section" aria-labelledby="demo-calculateur">
        <div className="tool-section-heading"><p className="eyebrow"><span /> Votre calculateur</p><h2 id="demo-calculateur">Faites les comptes.<br /><em>On s’occupe du reste.</em></h2></div>
        <ExpenseDemo />
      </section>

      <section className="tool-explainer" aria-label="Comment fonctionne le calculateur">
        <article><span>01</span><h2>Ajoutez vos frais</h2><p>Restaurant, courses, essence ou week-end : donnez un nom, un montant et la personne qui a avancé.</p></article>
        <article><span>02</span><h2>Choisissez le groupe</h2><p>Créez vos participants directement sur le web, sans inscription, puis sélectionnez qui partage chaque dépense.</p></article>
        <article><span>03</span><h2>Remboursez simplement</h2><p>Le solde de chacun et les remboursements à effectuer se mettent à jour automatiquement.</p></article>
      </section>

      <section className="tool-conversion">
        <p className="eyebrow eyebrow--light"><span /> La suite dans Nearly</p>
        <h2>Pour les vrais groupes,<br /><em>sans limite.</em></h2>
        <p>Dans Nearly, vos frais restent synchronisés avec votre groupe, autant de dépenses que nécessaire. Et vous retrouvez aussi les jeux, les souvenirs et votre espace privé.</p>
        <a className="button button--primary" href="/#telecharger">Découvrir Nearly <span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
}
