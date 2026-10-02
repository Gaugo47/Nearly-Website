
import { sitePath, absoluteUrl } from "./site";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import WaitlistForm from "./WaitlistForm";
import IPhoneMockup from "./IPhoneMockup";
import RelationPreview from "./RelationPreview";

const features = [
  {
    number: "01",
    title: "Les rituels qui rapprochent",
    text: "Un « ça va ? » qui devient une vraie réponse. Une question, une humeur, un petit défi à partager.",
    image: "/media/app-rituels.jpg",
    alt: "Écran Rituels et jeux de l’application Nearly",
    className: "feature-card feature-card--lavender",
  },
  {
    number: "02",
    title: "Les souvenirs qu’on ressort",
    text: "La photo floue, le fou rire, la journée ensemble. Gardez les moments qui vous ressemblent.",
    image: "/media/app-moments.jpg",
    alt: "Album de moments partagé dans Nearly",
    className: "feature-card feature-card--peach",
  },
  {
    number: "03",
    title: "Votre compagnon Mochi",
    text: "Un drôle de compagnon adopté par votre petit monde. Mochi grandit au fil de vos attentions partagées.",
    image: "/media/app-compagnon.jpg",
    alt: "Compagnon virtuel Mochi dans Nearly",
    className: "feature-card feature-card--violet",
  },
];

const faqs = [
  { question: "Pour qui est Nearly ?", answer: "Pour les amis, les familles et les couples, avec la même place pour chaque lien. Vous pouvez avoir plusieurs espaces : votre bande, votre famille, votre couple. À distance ou sous le même toit." },
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
        "Un espace privé pour chaque lien : amis, famille et couple. Nearly rapproche vos gens avec des questions, des rituels, des souvenirs et des moments partagés.",
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
    <main className="home-focused home-relations">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SiteNav />

      <section className="hero" id="top">
        <div className="hero-orb hero-orb--one" />
        <div className="hero-orb hero-orb--two" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Amis · Famille · Couple</p>
          <h1>Vos gens.<br /><em>Tout près.</em></h1>
          <p className="hero-lede"><strong>Votre bande, votre famille, votre moitié.</strong> Nearly donne à chacun de vos liens son espace privé, ses rituels et ses souvenirs. Même quand la vie vous éparpille.</p>
          <div className="hero-actions">
            <a className="button button--primary" href="#vos-liens">Trouver votre « nous » <ArrowIcon /></a>
            <span className="launch-note"><span className="pulse" /> Bientôt sur iOS &amp; Android</span>
          </div>
        </div>
        <RelationPreview />
      </section>

      <section className="relation-stories" id="vos-liens" aria-labelledby="relations-title">
        <div className="relation-stories__heading"><p className="eyebrow"><span /> Tous ceux qui comptent</p><h2 id="relations-title">Trois façons d’être <em>nous.</em></h2></div>
        <div className="relation-stories__grid">
          <article className="relation-story relation-story--friends"><span className="relation-story__label">Entre amis</span><h3>« On se fait<br />un truc ? »</h3><p>Un défi pour rire, les souvenirs de la bande et une idée pour votre prochaine sortie.</p><span className="relation-story__doodle" aria-hidden="true">✳</span></article>
          <article className="relation-story relation-story--family"><span className="relation-story__label">En famille</span><h3>« T’es bien<br />arrivé ? »</h3><p>La photo du dimanche, les nouvelles de chacun et les prochains moments ensemble.</p><span className="relation-story__doodle" aria-hidden="true">⌂</span></article>
          <article className="relation-story relation-story--couple"><span className="relation-story__label">En couple</span><h3>« Encore cinq<br />petites minutes. »</h3><p>Les questions à deux, les petites attentions et le compte à rebours avant les retrouvailles.</p><span className="relation-story__doodle" aria-hidden="true">♡</span></article>
        </div>
        <p className="relation-stories__footnote">Un même Nearly. Un espace à part pour chaque lien.</p>
      </section>

      <section className="experience section" id="experience">
        <div className="section-heading">
          <p className="eyebrow"><span /> Dans chacun de vos espaces</p>
          <h2>Les petits riens<br /><em>font les grands liens.</em></h2>
          <p>Questions, souvenirs et attentions partagées : les mêmes petites habitudes pour vos amis, votre famille et votre couple.</p>
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
          <h2>« On se fait<br /><em>un truc ? »</em></h2>
          <p className="gallery-intro">Un dîner à deux, un week-end en bande, un déjeuner en famille. Trouvez une idée, préparez les retrouvailles et gardez vos lieux préférés.</p>
        </div>
        <div className="phone-fan" aria-label="Galerie d’écrans Nearly">
          <IPhoneMockup className="fan-phone fan-phone--left" src="/media/app-carte.jpg" alt="Carte des proches Nearly" />
          <IPhoneMockup className="fan-phone fan-phone--center" src="/media/app-idees.jpg" alt="Idées personnalisées dans Nearly" />
          <IPhoneMockup className="fan-phone fan-phone--right" src="/media/app-amis.jpg" alt="Accueil de l’espace amis La bande dans Nearly" />
        </div>
      </section>

      <section className="mode-extras" aria-labelledby="modes-title">
        <div className="mode-extras__heading"><p className="eyebrow"><span /> Les petits extras · 18+</p><h2 id="modes-title">Pour changer <em>d’ambiance.</em></h2><p>Deux modes à découvrir quand vous en avez envie.</p></div>
        <details className="mode-fold mode-fold--party" id="party-mode">
          <summary><span aria-hidden="true">✳</span><div><strong>Party Mode</strong><small>Des jeux, des souvenirs de soirée et les comptes de la bande.</small></div><i aria-hidden="true">+</i></summary>
      <section className="party-showcase">
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
        </details>

        <details className="mode-fold mode-fold--spicy" id="spicy">
          <summary><span aria-hidden="true">♡</span><div><strong>Mode Spicy</strong><small>Un espace intime à deux, toujours consenti.</small></div><i aria-hidden="true">+</i></summary>
      <section className="spicy">
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
        </details>
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
          <h2 id="liste-attente-titre">Gardez une place<br /><em>pour vos gens.</em></h2>
          <p className="waitlist-intro">Rejoignez la liste d’attente pour être prévenu·e au lancement. Vos attentes nous aident à construire Nearly.</p>
          <p className="waitlist-reassurance">Des nouvelles de Nearly, une désinscription en un clic.</p>
        </div>
        <WaitlistForm />
      </section>
      <SiteFooter />
    </main>
  );
}
