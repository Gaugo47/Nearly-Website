import { pageAlternates } from "../../language";

import { sitePath } from "../../site";
import type { Metadata } from "next";
import SiteNav from "../../SiteNav";
import SiteFooter from "../../SiteFooter";
import ExpenseDemo from "../../ExpenseDemo";

export const metadata: Metadata = {
  title: "Calculateur de remboursement entre amis",
  description: "Calculez gratuitement qui doit rembourser qui après une sortie, un week-end ou des vacances. Ajoutez vos frais et obtenez les remboursements à faire.",
  alternates: pageAlternates("/calculateur-remboursement/"),
};

export default function CalculateurRemboursementPage() {
  return (
    <main className="tool-page tool-page--focused">
      <SiteNav current="tools" />
      <div className="tool-breadcrumb"><a href={sitePath("/outils/")}>← Outils &amp; activités</a><span>Frais partagés</span></div>

      <header className="tool-hero tool-hero--expense">
        <p className="eyebrow"><span /> Outil gratuit · Frais partagés</p>
        <h1>Qui doit rembourser<br /><em>qui&nbsp;?</em></h1>
        <p>Ajoutez les dépenses du groupe, choisissez qui a payé et qui participe. Le calculateur indique les remboursements les plus simples, au centime près.</p>
        <div className="tool-hero__facts"><span><strong>3</strong> frais à tester</span><span><strong>5</strong> devises</span><span><strong>0</strong> compte requis</span></div>
      </header>

      <section className="tool-demo-section" aria-label="Calculateur de frais partagés">
        <ExpenseDemo />
      </section>

      <aside className="tools-note"><p>Dans l’application, vos frais restent synchronisés avec votre groupe et ses espaces partagés.</p><a href={sitePath("/#party-mode")}>Découvrir Nearly entre amis <span aria-hidden="true">↗</span></a></aside>
      <SiteFooter />
    </main>
  );
}
