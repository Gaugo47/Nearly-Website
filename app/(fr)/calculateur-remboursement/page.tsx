import { pageAlternates } from "../../language";

import { sitePath, absoluteUrl } from "../../site";
import type { Metadata } from "next";
import SiteNav from "../../SiteNav";
import SiteFooter from "../../SiteFooter";
import ExpenseDemo from "../../ExpenseDemo";
import ToolGuide from "../../ToolGuide";
import { getBlogArticles } from "../../blog-content";
import { socialMetadata, breadcrumbList, faqPage, webApplication, jsonLd } from "../../seo";

const language = { language: "fr" as const }.language;
const title = "Calculateur de remboursement entre amis";
const description = "Calculez gratuitement qui doit rembourser qui après une sortie, un week-end ou des vacances. Ajoutez vos frais et obtenez les remboursements à faire.";

export const metadata: Metadata = {
  title,
  description,
  alternates: pageAlternates("/calculateur-remboursement/"),
  ...socialMetadata({ title, description, url: absoluteUrl("/calculateur-remboursement/"), locale: "fr_FR" }),
};

const steps = [
  { title: "Créez votre groupe", text: "Ajoutez au moins deux prénoms ou pseudos : ce sont les personnes entre lesquelles les frais seront répartis." },
  { title: "Ajoutez chaque dépense", text: "Indiquez le montant, la devise, la personne qui a payé et celles qui participent." },
  { title: "Lisez les remboursements", text: "Le calculateur affiche le total du groupe et qui rembourse qui, au centime près." },
];

const faqs = [
  { question: "Comment calculer qui doit rembourser qui ?", answer: "Pour chaque personne, additionnez ce qu’elle a avancé et retirez sa part des dépenses auxquelles elle participe. Un solde positif est une somme à recevoir, un solde négatif une somme à verser. Le calculateur fait ce calcul pour vous et indique les remboursements à effectuer." },
  { question: "Peut-on exclure quelqu’un d’une dépense ?", answer: "Oui. Pour chaque frais, vous choisissez qui participe : une personne qui n’a pas pris part à une activité n’en paie pas sa part." },
  { question: "Comment les devises sont-elles converties ?", answer: "Vous pouvez saisir un frais en euros, dollars américains, livres sterling, francs suisses ou bahts thaïlandais. Le taux vers l’euro est récupéré à l’ajout du frais, puis figé. Si le taux est indisponible, le calculateur l’indique au lieu d’inventer une valeur." },
  { question: "Mes montants sont-ils enregistrés ?", answer: "Les frais et les prénoms restent dans la session de votre onglet. Aucun compte n’est créé et aucun prénom ni montant n’est transmis au service de taux de change." },
  { question: "Combien de frais puis-je ajouter ?", answer: "Trois frais par essai sur le site. Dans l’application Nearly, à venir sur iOS et Android, les frais partagés du Party Mode restent synchronisés avec votre groupe." },
];

const reading = ["partager-frais-week-end-entre-amis", "organiser-soiree-frais-amis", "meilleures-applications-amis"];

export default function CalculateurRemboursementPage() {
  const url = absoluteUrl("/calculateur-remboursement/");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      webApplication({ name: title, description, url, language }),
      breadcrumbList([{ name: "Accueil", path: "/" }, { name: "Outils et activités", path: "/outils/" }, { name: title, path: "/calculateur-remboursement/" }]),
      faqPage(faqs),
    ],
  };
  return (
    <main className="tool-page tool-page--focused">
      <SiteNav current="tools" />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
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

      <ToolGuide
        title="Comment fonctionne le calcul"
        steps={steps}
        faqs={faqs}
        articles={getBlogArticles(language).filter(article => reading.includes(article.slug))}
        tools={[{ label: "Jouer à Devine la couleur", href: "/devine-la-couleur/" }, { label: "Piocher une question à deux", href: "/questions-couple/" }]}
      />

      <aside className="tools-note"><p>Dans l’application, vos frais restent synchronisés avec votre groupe et ses espaces partagés.</p><a href={sitePath("/#party-mode")}>Découvrir Nearly entre amis <span aria-hidden="true">↗</span></a></aside>
      <SiteFooter />
    </main>
  );
}
