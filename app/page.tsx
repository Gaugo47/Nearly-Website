
import { sitePath, absoluteUrl } from "./site";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import WaitlistForm from "./WaitlistForm";
import IPhoneMockup from "./IPhoneMockup";

const features = [
  {
    number: "01",
    title: "Vos petits rituels",
    text: "Une question, une humeur ou un défi pour garder le lien au quotidien.",
    image: "/media/app-rituels.jpg",
    alt: "Écran Rituels et jeux de l’application Nearly",
    className: "feature-card feature-card--lavender",
  },
  {
    number: "02",
    title: "Vos souvenirs partagés",
    text: "Photos, moments et capsules temporelles : votre histoire se construit au même endroit.",
    image: "/media/app-moments.jpg",
    alt: "Album de moments partagé dans Nearly",
    className: "feature-card feature-card--peach",
  },
  {
    number: "03",
    title: "Votre compagnon Mochi",
    text: "Mochi grandit grâce à vos petites attentions et à vos moments partagés.",
    image: "/media/app-compagnon.jpg",
    alt: "Compagnon virtuel Mochi dans Nearly",
    className: "feature-card feature-card--violet",
  },
];

const faqs = [
  { question: "Pour qui est Nearly ?", answer: "Pour les couples, les amis et les familles. Chaque relation a son propre espace, à distance ou sous le même toit." },
  { question: "Quand pourrai-je télécharger l’application ?", answer: "Nearly arrive bientôt sur iOS et Android. Inscrivez-vous à la liste d’attente pour recevoir un e-mail au lancement." },
  { question: "Les outils du site nécessitent-ils un compte ?", answer: "Non. Les questions, le test de jeu et le calculateur s’essaient gratuitement sur le site, sans compte Nearly." },
  { question: "Comment fonctionnent les espaces privés ?", answer: "Chaque relation garde ses échanges et ses souvenirs dans son espace. Party et Spicy disposent de coffres photo verrouillés. Le mode Spicy est réservé aux adultes et s’active avec un consentement partagé." },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Nearly",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "iOS, Android",
      inLanguage: ["fr", "en"],
      description:
        "Hub relationnel privé qui réunit les couples, amis et familles pour rester proches malgré la distance grâce aux questions, rituels, souvenirs, jeux et moments partagés.",
      image: absoluteUrl("/media/nearly-icon.png"),
      featureList: [
        "Question du jour",
        "Humeurs partagées",
        "Moments et souvenirs privés",
        "Calendrier et compteur de retrouvailles",
        "Mini-jeux relationnels",
        "Carte de souvenirs",
        "Idées personnalisées",
        "Compagnon virtuel partagé",
        "Conversations et photos entièrement chiffrées",
        "Coffres-forts photo verrouillés dans les modes Party et Spicy",
        "Filtre anti-screenshot dans les modes Party et Spicy",
        "Party Mode entre amis avec jeux, photos privées et frais partagés",
        "Mode Spicy privé, consenti et protégé par code",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main className="home-focused">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SiteNav />

      <section className="hero" id="top">
        <div className="hero-orb hero-orb--one" />
        <div className="hero-orb hero-orb--two" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Couple · Amis · Famille</p>
          <h1>Tous ceux qui comptent.<em> Toujours plus proches.</em></h1>
          <p className="hero-lede">Un espace privé pour chaque relation. Des rituels, des souvenirs et des jeux pour rester proches, même à distance.</p>
          <div className="hero-actions">
            <a className="button button--primary" href="#experience">Découvrir les fonctionnalités <ArrowIcon /></a>
            <span className="launch-note"><span className="pulse" /> Bientôt sur iOS &amp; Android</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Aperçu de l’application Nearly">
          <div className="float-card float-card--question"><span className="float-icon">“</span><div><small>Question du jour</small><strong>Alice a répondu</strong></div></div>
          <IPhoneMockup className="phone phone--hero" src="/media/app-accueil.jpg" alt="Accueil de l’application Nearly avec espace partagé, rituels et humeur" eager />
          <div className="companion-chip"><span>✦</span><div><small>Votre compagnon</small><strong>Mochi grandit avec vous</strong></div></div>
        </div>
      </section>

      <section className="experience section" id="experience">
        <div className="section-heading">
          <p className="eyebrow"><span /> Le quotidien, ensemble</p>
          <h2>De petites attentions.<br /><em>Un lien qui grandit.</em></h2>
          <p>Trois façons de partager un moment, même quand vos journées vous éloignent.</p>
        </div>
        <div className="feature-grid">
          {features.map(feature => (
            <article className={feature.className} key={feature.title}>
              <div className="feature-copy"><span className="feature-number">{feature.number}</span><h3>{feature.title}</h3><p>{feature.text}</p></div>
              <IPhoneMockup className="feature-phone" src={feature.image} alt={feature.alt} />
            </article>
          ))}
        </div>
      </section>

      <section className="gallery-band">
        <div className="gallery-copy">
          <p className="eyebrow eyebrow--light"><span /> Les moments à venir</p>
          <h2>Des idées pour<br /><em>se retrouver.</em></h2>
          <p className="gallery-intro">Préparez votre prochain rendez-vous, trouvez une activité et gardez vos lieux préférés sur une carte partagée.</p>
        </div>
        <div className="phone-fan" aria-label="Galerie d’écrans Nearly">
          <IPhoneMockup className="fan-phone fan-phone--left" src="/media/app-carte.jpg" alt="Carte des proches Nearly" />
          <IPhoneMockup className="fan-phone fan-phone--center" src="/media/app-idees.jpg" alt="Idées personnalisées dans Nearly" />
          <IPhoneMockup className="fan-phone fan-phone--right" src="/media/app-party.jpg" alt="Accueil du Party Mode de Nearly" />
        </div>
      </section>

      <section className="party-showcase" id="party-mode">
        <div className="party-copy">
          <p className="eyebrow eyebrow--party"><span /> Entre amis · Party Mode</p>
          <h2>Une soirée.<br /><em>Toute la bande.</em></h2>
          <p className="party-intro">Des jeux pour lancer l’ambiance, un coffre pour les photos et des comptes faciles à partager.</p>
          <ul className="feature-summary"><li>Jeux et défis dans le Party Lab</li><li>Photos de soirée dans un coffre verrouillé</li><li id="frais-partages">Dépenses et remboursements entre amis</li></ul>
        </div>
        <div className="party-devices" aria-label="Aperçu du Party Mode de Nearly pour les groupes d’amis">
          <figure className="party-device party-device--lab"><IPhoneMockup className="party-screen" src="/media/app-party-lab.jpg" alt="Jeux et défis du Party Lab de Nearly" /><figcaption>Party Lab</figcaption></figure>
          <figure className="party-device party-device--photos"><IPhoneMockup className="party-screen" src="/media/app-party-photos.png" alt="Coffre de photos privées d’une soirée entre amis dans Nearly" /><figcaption>Coffre photo</figcaption></figure>
          <figure className="party-device party-device--expenses"><IPhoneMockup className="party-screen" src="/media/app-party-expenses.jpg" alt="Répartition des frais partagés entre amis dans Nearly" /><figcaption>Frais partagés</figcaption></figure>
        </div>
      </section>

      <section className="spicy" id="spicy">
        <div className="spicy-copy">
          <p className="eyebrow eyebrow--spicy"><span /> À deux · Spicy · 18+</p>
          <h2>Votre complicité.<br /><em>À votre rythme.</em></h2>
          <p className="spicy-intro">Un espace intime qui s’ouvre lorsque vous êtes tous les deux d’accord. Vos photos restent dans un coffre protégé par code.</p>
          <ul className="feature-summary"><li>Consentement partagé</li><li>Accès au coffre temporaire</li><li>Le droit de passer, toujours</li></ul>
        </div>
        <div className="spicy-visual" aria-label="Aperçu du mode Spicy privé de Nearly">
          <div className="spicy-glow" />
          <IPhoneMockup className="spicy-phone spicy-phone--vault" src="/media/app-spicy-vault.jpg" alt="Coffre privé du mode Spicy protégé par code secret" />
          <IPhoneMockup className="spicy-phone spicy-phone--home" src="/media/app-spicy-home.jpg" alt="Accueil consenti du mode Spicy de Nearly" />
        </div>
      </section>

      <section className="privacy-brief" id="securite" aria-labelledby="privacy-title">
        <div><p className="eyebrow"><span /> Vos liens restent privés</p><h2 id="privacy-title">Votre espace.<br /><em>Vos règles.</em></h2></div>
        <p>Chaque relation garde ses échanges et ses souvenirs dans son espace. Conversations chiffrées, coffres photo verrouillés et consentement partagé font partie de l’expérience.</p>
      </section>

      <aside className="try-aside" id="tester-un-jeu">
        <div><p className="eyebrow"><span /> Envie de passer à l’action ?</p><h2>Essayez un peu de Nearly.</h2><p>Questions à partager, test de jeu et calculateur : choisissez votre activité.</p></div>
        <a className="button button--primary" href={sitePath("/outils/")}>Outils &amp; activités <ArrowIcon /></a>
      </aside>

      <section className="faq section" id="faq">
        <div className="section-heading"><p className="eyebrow"><span /> En quelques mots</p><h2>Vos <em>questions.</em></h2></div>
        <div className="faq-list">{faqs.map((faq, index) => <details key={faq.question}><summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<i aria-hidden="true">+</i></summary><p>{faq.answer}</p></details>)}</div>
      </section>

      <section className="waitlist" id="liste-attente" aria-labelledby="liste-attente-titre">
        <span id="telecharger" className="anchor-alias" aria-hidden="true" />
        <div className="waitlist-copy">
          <p className="eyebrow"><span /> Bientôt sur iOS &amp; Android</p>
          <h2 id="liste-attente-titre">La suite,<br /><em>avec vous.</em></h2>
          <p className="waitlist-intro">Rejoignez la liste d’attente pour être prévenu·e au lancement. Vos attentes nous aident à construire Nearly.</p>
          <p className="waitlist-reassurance">Des nouvelles de Nearly, une désinscription en un clic.</p>
        </div>
        <WaitlistForm />
      </section>
      <SiteFooter />
    </main>
  );
}
