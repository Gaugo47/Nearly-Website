
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
        "Un espace privé pour chaque lien : amis, famille et couple. Nearly rapproche vos proches avec des questions, des rituels, des souvenirs et des moments partagés.",
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
        "Protection des captures sur mobile compatible dans les modes Party et Spicy",
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
    <main className="home-focused home-showcase">
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
          <h1>Les liens<br />qui comptent.<br /><em>Même de loin.</em></h1>
          <p className="hero-lede">Vos amis, votre famille, votre couple. Un espace privé pour partager le quotidien, jouer et garder les moments qui vous rapprochent.</p>
          <div className="hero-actions">
            <a className="button button--primary hero-waitlist" href="#liste-attente">Rejoindre la liste d’attente <ArrowIcon /></a>
            <a className="hero-secondary" href="#experience">Découvrir Nearly <span aria-hidden="true">→</span></a>
          </div>
          <p className="hero-availability"><span className="pulse" /> Bientôt sur iOS &amp; Android</p>
        </div>
        <RelationPreview />
      </section>

      <nav className="showcase-index" aria-label="Explorer l’application"><span>Dans Nearly</span><a href="#vos-liens">Vos espaces</a><a href="#experience">Le quotidien</a><a href="#party-mode">Party</a><a href="#spicy">Spicy</a><a href="#securite">Confidentialité</a></nav>

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

      <section className="mode-intro" aria-labelledby="modes-title"><p className="eyebrow"><span /> Les sous-modes Nearly</p><h2 id="modes-title">À chaque moment,<br /><em>son ambiance.</em></h2><p>Le quotidien dans vos espaces. Les soirées dans Party. La complicité à deux dans Spicy.</p></section>

      <section className="party-showcase" id="party-mode" aria-labelledby="party-title">
        <div className="party-copy">
          <p className="eyebrow eyebrow--party"><span /> Entre amis · Party Mode · 18+</p>
          <h2 id="party-title">Une soirée.<br /><em>Toute la bande.</em></h2>
          <p className="party-intro">Des jeux pour lancer l’ambiance, un coffre pour les photos et des comptes faciles à partager.</p>
          <div className="party-features"><div><span>01</span><strong>Party Lab</strong><p>Jeux et défis pour lancer la soirée avec votre groupe.</p></div><div><span>02</span><strong>Photos de soirée</strong><p>Un coffre verrouillé pour les souvenirs de la bande.</p></div><div id="frais-partages"><span>03</span><strong>Frais partagés</strong><p>Ajoutez les dépenses et retrouvez qui rembourse qui.</p></div></div>
        </div>
        <div className="party-devices" aria-label="Aperçu du Party Mode de Nearly pour les groupes d’amis">
          <figure className="party-device party-device--lab"><IPhoneMockup className="party-screen" src="/media/app-party-lab.jpg" alt="Jeux et défis du Party Lab de Nearly" /><figcaption>Party Lab</figcaption></figure>
          <figure className="party-device party-device--photos"><IPhoneMockup className="party-screen" src="/media/app-party-photos.png" alt="Coffre de photos privées d’une soirée entre amis dans Nearly" /><figcaption>Coffre photo</figcaption></figure>
          <figure className="party-device party-device--expenses"><IPhoneMockup className="party-screen" src="/media/app-party-expenses.jpg" alt="Répartition des frais partagés entre amis dans Nearly" /><figcaption>Frais partagés</figcaption></figure>
        </div>
      </section>

      <section className="spicy" id="spicy" aria-labelledby="spicy-title">
        <div className="spicy-copy">
          <p className="eyebrow eyebrow--spicy"><span /> À deux · Spicy · 18+</p>
          <h2 id="spicy-title">Votre complicité.<br /><em>À votre rythme.</em></h2>
          <p className="spicy-intro">Un espace intime qui s’ouvre lorsque vous êtes tous les deux d’accord. Vos photos restent dans un coffre protégé par code.</p>
          <div className="spicy-principles"><div><span>01</span><strong>À deux, d’accord</strong><p>Un mode réservé aux adultes, activé avec un consentement partagé.</p></div><div><span>02</span><strong>Un coffre privé</strong><p>Vos photos restent protégées par code, avec un accès temporaire.</p></div><div><span>03</span><strong>Votre rythme</strong><p>Le droit de passer ou de quitter le mode, toujours.</p></div></div>
        </div>
        <div className="spicy-visual" aria-label="Aperçu du mode Spicy privé de Nearly">
          <div className="spicy-glow" />
          <IPhoneMockup className="spicy-phone spicy-phone--vault" src="/media/app-spicy-vault.jpg" alt="Coffre privé du mode Spicy protégé par code secret" />
          <IPhoneMockup className="spicy-phone spicy-phone--home" src="/media/app-spicy-home.jpg" alt="Accueil consenti du mode Spicy de Nearly" />
        </div>
      </section>

      <section className="privacy" id="securite" aria-labelledby="privacy-title">
        <div className="privacy-visual" aria-label="Chiffrement et coffres privés dans Nearly">
          <div className="privacy-halo" aria-hidden="true" />
          <div className="security-core"><span className="security-core__icon security-core__icon--lock" aria-hidden="true"><i /></span><small>Votre cercle, votre espace</small><strong>Votre espace<br />reste le vôtre.</strong><span className="security-core__status"><i aria-hidden="true" /> Confidentialité intégrée</span></div>
          <div className="security-float security-float--messages"><span aria-hidden="true">✓</span><div><small>Conversations</small><strong>Échanges chiffrés</strong></div></div>
          <div className="security-float security-float--photos"><span aria-hidden="true">◆</span><div><small>Party &amp; Spicy</small><strong>Coffres photo verrouillés</strong></div></div>
          <div className="security-float security-float--capture"><span aria-hidden="true">⊘</span><div><small>Sur mobile compatible</small><strong>Protection des captures</strong></div></div>
        </div>
        <div className="privacy-copy"><p className="eyebrow eyebrow--light"><span /> La confidentialité dans Nearly</p><h2 id="privacy-title">Vos échanges.<br /><em>Votre cercle.</em></h2><p className="privacy-intro">Une conversation de famille, un souvenir de soirée, un moment à deux : chacun reste dans l’espace des personnes que vous avez choisies.</p>
          <div className="privacy-points"><div><span className="privacy-number">01</span><strong>Échanges chiffrés</strong><span>Vos conversations et vos photos privées sont chiffrées.</span></div><div><span className="privacy-number">02</span><strong>Espaces distincts</strong><span>Votre famille, vos amis et votre couple gardent chacun leurs échanges et leurs souvenirs.</span></div><div><span className="privacy-number">03</span><strong>Coffres verrouillés</strong><span>Dans Party et Spicy, les photos du coffre s’affichent après déverrouillage.</span></div><div><span className="privacy-number">04</span><strong>Protection des captures</strong><span>Party et Spicy protègent les captures d’écran sur les mobiles compatibles.</span></div></div>
          <a className="privacy-link" href={sitePath("/confidentialite/")}>Lire la politique de confidentialité <ArrowIcon /></a>
        </div>
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
          <h2 id="liste-attente-titre">La suite,<br /><em>avec vos proches.</em></h2>
          <p className="waitlist-intro">Rejoignez la liste d’attente pour être prévenu·e au lancement. Vos attentes nous aident à construire Nearly.</p>
          <p className="waitlist-reassurance">Des nouvelles de Nearly, une désinscription en un clic.</p>
        </div>
        <WaitlistForm />
      </section>
      <SiteFooter />
    </main>
  );
}
