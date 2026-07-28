const features = [
  {
    number: "01",
    title: "Un rituel qui tient dans la vraie vie",
    text: "Une question, une humeur, un petit défi. Quelques minutes suffisent pour créer un moment qui compte, sans transformer votre lien en liste de tâches.",
    image: "/media/app-rituels.png",
    alt: "Écran Rituels et jeux de l’application Nearly",
    className: "feature-card feature-card--lavender",
  },
  {
    number: "02",
    title: "Votre histoire, au même endroit",
    text: "Moments, souvenirs, capsules temporelles et carte partagée composent un album vivant que votre espace garde rien que pour vous.",
    image: "/media/app-moments.png",
    alt: "Album de moments partagé dans Nearly",
    className: "feature-card feature-card--peach",
  },
  {
    number: "03",
    title: "Un compagnon qui grandit avec le lien",
    text: "Mochi évolue grâce à vos attentions partagées. Jamais de culpabilisation : seulement de petites raisons de revenir l’un vers l’autre.",
    image: "/media/app-compagnon.png",
    alt: "Compagnon virtuel Mochi dans Nearly",
    className: "feature-card feature-card--violet",
  },
];

const faqs = [
  {
    question: "Nearly, c’est quoi exactement ?",
    answer:
      "Nearly est une application relationnelle privée pour rester proche de son couple, de ses meilleurs amis ou de sa famille, même à distance. Elle réunit des rituels, questions, souvenirs, jeux, idées, événements et un compagnon partagé.",
  },
  {
    question: "Est-ce seulement une application pour les couples à distance ?",
    answer:
      "Non. Nearly propose trois ambiances adaptées aux couples, aux amis proches et aux familles. Elle fonctionne aussi très bien quand on habite près l’un de l’autre mais que les emplois du temps compliquent les moments partagés.",
  },
  {
    question: "Quelle différence avec une messagerie classique ?",
    answer:
      "Nearly ne cherche pas à remplacer vos messages. L’application transforme les petits gestes en expériences communes : répondre à une question, préparer des retrouvailles, conserver un souvenir, lancer un jeu ou faire grandir votre compagnon.",
  },
  {
    question: "Mes souvenirs et ma position sont-ils publics ?",
    answer:
      "Non. L’espace est privé. La localisation est optionnelle et le partage en direct ne démarre que lorsque vous l’activez. Les recommandations n’utilisent jamais vos messages, photos ou notes privées.",
  },
  {
    question: "Nearly est-elle disponible sur iPhone et Android ?",
    answer:
      "Nearly est conçue pour iOS et Android. Les liens de téléchargement seront ajoutés ici dès l’ouverture officielle des fiches App Store et Google Play.",
  },
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
        "Application relationnelle privée pour les couples, amis et familles : questions, rituels, souvenirs, jeux, calendrier, idées et compagnon partagé.",
      image: "/media/nearly-icon.png",
      featureList: [
        "Question du jour",
        "Humeurs partagées",
        "Moments et souvenirs privés",
        "Calendrier et compteur de retrouvailles",
        "Mini-jeux relationnels",
        "Carte de souvenirs",
        "Idées personnalisées",
        "Compagnon virtuel partagé",
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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="site-nav" aria-label="Navigation principale">
        <a className="brand" href="#top" aria-label="Nearly, retour en haut">
          <img src="/media/nearly-logo.png" alt="Nearly" />
        </a>
        <div className="nav-links">
          <a href="#experience">L’expérience</a>
          <a href="#pour-qui">Pour qui ?</a>
          <a href="#confidentialite">Confidentialité</a>
        </div>
        <a className="nav-cta" href="#telecharger">
          Découvrir <ArrowIcon />
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-orb hero-orb--one" />
        <div className="hero-orb hero-orb--two" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> L’app qui prend soin de vos liens</p>
          <h1>
            La distance sépare les journées.
            <em> Pas votre lien.</em>
          </h1>
          <p className="hero-lede">
            Nearly crée un espace privé où les couples, amis et familles
            transforment les petits gestes en souvenirs, rituels et moments
            vraiment partagés.
          </p>
          <div className="hero-actions">
            <a className="button button--primary" href="#experience">
              Voir Nearly en action <ArrowIcon />
            </a>
            <span className="launch-note">
              <span className="pulse" /> Bientôt sur iOS &amp; Android
            </span>
          </div>
          <div className="audience-row" aria-label="Nearly pour tous vos liens proches">
            <span>Couples</span><i />
            <span>Meilleurs amis</span><i />
            <span>Familles</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Aperçu de l’application Nearly">
          <div className="float-card float-card--question">
            <span className="float-icon">“</span>
            <div><small>Question du jour</small><strong>Alice a répondu</strong></div>
          </div>
          <div className="float-card float-card--reunion">
            <span className="float-icon">♥</span>
            <div><small>Prochaines retrouvailles</small><strong>dans 12 jours</strong></div>
          </div>
          <div className="phone phone--hero">
            <span className="phone-speaker" />
            <img src="/media/app-accueil.png" alt="Accueil de l’application Nearly avec espace partagé, rituels et humeur" />
          </div>
          <div className="companion-chip">
            <span>✦</span>
            <div><small>Mochi est fier</small><strong>+25 pour votre lien</strong></div>
          </div>
        </div>
      </section>

      <section className="manifesto" aria-label="La promesse Nearly">
        <p>Pas un réseau social.</p>
        <p>Pas une messagerie de plus.</p>
        <strong>Votre endroit à vous.</strong>
      </section>

      <section className="experience section" id="experience">
        <div className="section-heading">
          <p className="eyebrow"><span /> Ce qui vous rapproche</p>
          <h2>Des petites attentions.<br /><em>De vrais souvenirs.</em></h2>
          <p>
            Nearly donne un rythme doux à votre relation. On ouvre l’app pour
            partager quelque chose, jamais pour combler un fil infini.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className={feature.className} key={feature.title}>
              <div className="feature-copy">
                <span className="feature-number">{feature.number}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
              <div className="feature-phone">
                <img src={feature.image} alt={feature.alt} loading="lazy" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gallery-band">
        <div className="gallery-copy">
          <p className="eyebrow eyebrow--light"><span /> Tout votre lien, ici</p>
          <h2>Une seule app.<br /><em>Une infinité de “nous”.</em></h2>
          <ul>
            <li><span>01</span> Préparer vos prochaines retrouvailles</li>
            <li><span>02</span> Trouver une idée vraiment faite pour vous</li>
            <li><span>03</span> Jouer, rire et vous redécouvrir</li>
            <li><span>04</span> Garder une trace de ce qui compte</li>
          </ul>
        </div>
        <div className="phone-fan" aria-label="Galerie d’écrans Nearly">
          <div className="fan-phone fan-phone--left"><img src="/media/app-carte.png" alt="Carte des proches Nearly" loading="lazy" /></div>
          <div className="fan-phone fan-phone--center"><img src="/media/app-idees.png" alt="Idées personnalisées dans Nearly" loading="lazy" /></div>
          <div className="fan-phone fan-phone--right"><img src="/media/app-party.png" alt="Party Lab de Nearly" loading="lazy" /></div>
        </div>
      </section>

      <section className="audiences section" id="pour-qui">
        <div className="section-heading section-heading--center">
          <p className="eyebrow"><span /> Un espace qui vous ressemble</p>
          <h2>Votre lien n’entre pas<br />dans une seule <em>case.</em></h2>
        </div>
        <div className="audience-cards">
          <article className="audience-card audience-card--couple">
            <span className="audience-kicker">À deux</span>
            <h3>Pour les couples</h3>
            <p>À distance ou sous le même toit : entretenir la complicité, préparer les retrouvailles et garder votre jardin secret.</p>
            <span className="audience-tag">Chaleureux · complice</span>
          </article>
          <article className="audience-card audience-card--friends">
            <span className="audience-kicker">La bande</span>
            <h3>Pour les amis</h3>
            <p>Des défis, des photos, des idées et un Party Lab pour continuer à créer des histoires, même quand les agendas débordent.</p>
            <span className="audience-tag">Fun · spontané</span>
          </article>
          <article className="audience-card audience-card--family">
            <span className="audience-kicker">Entre proches</span>
            <h3>Pour les familles</h3>
            <p>Des nouvelles douces, des souvenirs communs et des rendez-vous qui rapprochent toutes les générations.</p>
            <span className="audience-tag">Rassurant · vivant</span>
          </article>
        </div>
      </section>

      <section className="privacy" id="confidentialite">
        <div className="privacy-visual">
          <div className="privacy-halo" />
          <img src="/media/nearly-icon.png" alt="Icône Nearly" loading="lazy" />
          <span className="lock-chip">● Espace privé</span>
        </div>
        <div className="privacy-copy">
          <p className="eyebrow eyebrow--light"><span /> Privé par nature</p>
          <h2>Ce qui est à vous<br /><em>reste à vous.</em></h2>
          <p className="privacy-intro">
            Nearly est pensé comme un cocon partagé, pas comme une vitrine.
            Vous choisissez ce qui entre dans votre espace et avec qui.
          </p>
          <div className="privacy-points">
            <div><strong>Localisation à la demande</strong><span>Le partage en direct est optionnel et explicite.</span></div>
            <div><strong>Contenus privés exclus</strong><span>Messages, photos et notes ne servent jamais aux recommandations.</span></div>
            <div><strong>Une expérience sans pression</strong><span>Pas de score négatif, pas de culpabilisation, jamais.</span></div>
          </div>
        </div>
      </section>

      <section className="faq section" id="faq">
        <div className="section-heading">
          <p className="eyebrow"><span /> Questions fréquentes</p>
          <h2>Tout ce que vous voulez<br />savoir sur <em>Nearly.</em></h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<i aria-hidden="true">+</i></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta" id="telecharger">
        <div className="final-glow" />
        <p className="eyebrow eyebrow--light"><span /> La suite commence ici</p>
        <h2>La distance est réelle.<br /><em>Votre proximité aussi.</em></h2>
        <p>Nearly arrive bientôt sur iPhone et Android.</p>
        <div className="store-row" aria-label="Plateformes bientôt disponibles">
          <div className="store-badge"><span>●</span><div><small>Bientôt sur</small><strong>l’App Store</strong></div></div>
          <div className="store-badge"><span>▶</span><div><small>Bientôt sur</small><strong>Google Play</strong></div></div>
        </div>
      </section>

      <footer>
        <a className="brand brand--footer" href="#top"><img src="/media/nearly-logo.png" alt="Nearly" /></a>
        <p>Proches, même à distance.</p>
        <div>
          <a href="#confidentialite">Confidentialité</a>
          <a href="#faq">FAQ</a>
          <span>© 2026 Nearly</span>
        </div>
      </footer>
    </main>
  );
}
