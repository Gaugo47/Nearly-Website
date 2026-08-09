import GameMatch from "./GameMatch";
import ExpenseDemo from "./ExpenseDemo";

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
      "Nearly est le hub relationnel privé de tous les liens qui comptent : couple, meilleurs amis et famille. Chaque relation dispose de son propre espace pour partager des rituels, questions, souvenirs, jeux, idées et événements, afin de se sentir proche malgré la distance.",
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
    question: "Comment Nearly protège mes conversations et mes photos ?",
    answer:
      "Les conversations et les photos partagées dans Nearly sont entièrement chiffrées. Dans les modes Party et Spicy, les photos sont placées dans des coffres-forts verrouillés avant tout accès. Un filtre anti-capture bloque aussi les screenshots afin que les contenus sensibles restent dans l’espace où ils ont été partagés.",
  },
  {
    question: "Comment fonctionne le mode Spicy de Nearly ?",
    answer:
      "Réservé aux adultes, le mode Spicy ouvre un espace complice uniquement après une activation consentie. Son coffre-fort photo doit être déverrouillé par code secret avant tout accès et son ouverture est temporaire. Chacun garde toujours le droit de passer.",
  },
  {
    question: "Que contient le Party Mode pour les groupes d’amis ?",
    answer:
      "Le Party Mode réunit des jeux de soirée, un coffre-fort photo verrouillé et des frais partagés dans le même espace. Le coffre doit être déverrouillé avant d’accéder aux photos de la soirée.",
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
        "Hub relationnel privé qui réunit les couples, amis et familles pour rester proches malgré la distance grâce aux questions, rituels, souvenirs, jeux et moments partagés.",
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
          <a href="/questions-couple">Questions couple</a>
          <a href="/calculateur-remboursement">Calculateur</a>
          <a href="#pour-qui">Pour qui ?</a>
          <a href="#tester-un-jeu">Tester un jeu</a>
          <a href="#party-mode">Party Mode</a>
          <a href="#spicy">Mode Spicy</a>
          <a href="#securite">Sécurité</a>
        </div>
        <a className="nav-cta" href="#telecharger">
          Découvrir <ArrowIcon />
        </a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-orb hero-orb--one" />
        <div className="hero-orb hero-orb--two" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Le hub privé de toutes vos relations</p>
          <h1>
            Tous ceux qui comptent.
            <em> Toujours plus proches.</em>
          </h1>
          <p className="hero-lede">
            Nearly réunit votre couple, vos meilleurs amis et votre famille
            dans un seul hub privé. Chaque relation garde son espace, ses
            souvenirs et ses rituels pour se sentir proche malgré la distance.
          </p>
          <div className="hub-promise" aria-label="La promesse du hub Nearly">
            <strong>Un seul hub</strong>
            <span>Un espace privé pour chaque relation qui compte.</span>
          </div>
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
        <p>Un seul hub.</p>
        <p>Un espace pour chaque relation.</p>
        <strong>Proches, malgré la distance.</strong>
      </section>

      <section className="experience section" id="experience">
        <div className="section-heading">
          <p className="eyebrow"><span /> Tout votre lien, au même endroit</p>
          <h2>Tout ce qui compte.<br /><em>Dans un même hub.</em></h2>
          <p>
            Questions, souvenirs, retrouvailles, jeux et petites attentions :
            Nearly rassemble ce qui nourrit chaque relation, sans fil infini
            et sans remplacer vos conversations.
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
            <a className="audience-link" href="#party-mode">Découvrir le Party Mode <ArrowIcon /></a>
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

      <section className="game-taster section" id="tester-un-jeu">
        <div className="game-taster__intro">
          <p className="eyebrow"><span /> Un avant-goût de Nearly</p>
          <h2>Quel jeu est fait<br />pour <em>vous&nbsp;?</em></h2>
          <p>
            Trois questions, trente secondes et zéro mauvaise réponse.
            Découvrez le jeu Nearly qui correspond le mieux à votre façon
            d’être ensemble.
          </p>
          <div className="game-taster__facts" aria-label="Informations sur le test">
            <span><strong>03</strong> questions</span>
            <span><strong>30</strong> secondes</span>
            <span><strong>01</strong> jeu pour vous</span>
          </div>
        </div>
        <GameMatch />
      </section>

      <section className="party-showcase" id="party-mode">
        <div className="party-copy">
          <p className="eyebrow eyebrow--party"><span /> Party Mode · Entre amis</p>
          <h2>Le chaos de la soirée.<br /><em>Les souvenirs en plus.</em></h2>
          <p className="party-intro">
            Nearly rassemble tout ce qui fait une bonne soirée : des jeux pour
            lancer l’ambiance, un coffre-fort photo verrouillé et des comptes justes,
            sans calcul mental au petit matin.
          </p>
          <div className="party-features">
            <div><span>01</span><strong>Choisissez votre chaos</strong><p>Party Lab propose des défis, des gages et des questions adaptés à la bande.</p></div>
            <div><span>02</span><strong>Déverrouillez le coffre photo</strong><p>Le coffre doit être ouvert avant tout accès aux selfies privés de la soirée.</p></div>
            <div><span>03</span><strong>Partagez, sans prise de tête</strong><p>Ajoutez les dépenses et Nearly indique simplement qui rembourse qui.</p></div>
          </div>
        </div>
        <div className="party-devices" aria-label="Aperçu du Party Mode de Nearly pour les groupes d’amis">
          <figure className="party-device party-device--lab">
            <div className="party-screen">
              <img src="/media/app-party-lab.png" alt="Jeux et défis du Party Lab de Nearly" loading="lazy" />
            </div>
            <figcaption>Party Lab</figcaption>
          </figure>
          <figure className="party-device party-device--photos">
            <div className="party-screen">
              <img src="/media/app-party-photos.png" alt="Coffre de photos privées d’une soirée entre amis dans Nearly" loading="lazy" />
            </div>
            <figcaption>Coffre photo</figcaption>
          </figure>
          <figure className="party-device party-device--expenses">
            <div className="party-screen">
              <img src="/media/app-party-expenses.png" alt="Répartition des frais partagés entre amis dans Nearly" loading="lazy" />
            </div>
            <figcaption>Frais partagés</figcaption>
          </figure>
          <span className="party-chip">● Espace privé à la bande</span>
        </div>
      </section>

      <section className="expense-taster section" id="frais-partages">
        <div className="expense-taster__heading">
          <div>
            <p className="eyebrow"><span /> Frais partagés · Démo</p>
            <h2>Les bons comptes.<br /><em>Sans calcul mental.</em></h2>
          </div>
          <p>
            Ajoutez jusqu’à trois frais comme dans Nearly : choisissez qui a payé et
            pour qui. Les soldes et les remboursements se recalculent
            instantanément, au centime près.
          </p>
        </div>
        <ExpenseDemo />
        <div className="expense-taster__cta">
          <span>Sur le web, créez vos participants sans compte. Dans l’app, vos vrais espaces se synchronisent en direct.</span>
          <a className="button button--primary" href="#telecharger">Télécharger Nearly <ArrowIcon /></a>
        </div>
      </section>

      <section className="spicy" id="spicy">
        <div className="spicy-copy">
          <p className="eyebrow eyebrow--spicy"><span /> Mode Spicy · 18+</p>
          <h2>Votre intimité.<br /><em>Vos règles.</em></h2>
          <p className="spicy-intro">
            Un terrain de jeu complice, suggestif et toujours consenti. Nearly
            vous laisse explorer à votre rythme, dans un espace séparé du reste
            de l’application.
          </p>
          <div className="spicy-principles">
            <div><span>01</span><strong>Consentement partagé</strong><p>Le mode ne s’active que lorsque chacun est d’accord.</p></div>
            <div><span>02</span><strong>Coffre photo sous code</strong><p>Les photos restent verrouillées avant l’accès et le déverrouillage expire automatiquement.</p></div>
            <div><span>03</span><strong>Le droit de passer</strong><p>Aucune pression : vos envies et vos limites restent prioritaires.</p></div>
          </div>
        </div>
        <div className="spicy-visual" aria-label="Aperçu du mode Spicy privé de Nearly">
          <div className="spicy-glow" />
          <div className="spicy-phone spicy-phone--vault">
            <img src="/media/app-spicy-vault.png" alt="Coffre privé du mode Spicy protégé par code secret" loading="lazy" />
          </div>
          <div className="spicy-phone spicy-phone--home">
            <img src="/media/app-spicy-home.png" alt="Accueil consenti du mode Spicy de Nearly" loading="lazy" />
          </div>
          <span className="spicy-chip">✓ Privé · consenti · temporaire</span>
        </div>
      </section>

      <section className="privacy" id="securite">
        <div className="privacy-visual">
          <div className="privacy-halo" />
          <div className="security-core" aria-label="Protection active de votre espace Nearly">
            <span className="security-core__icon security-core__icon--lock" aria-hidden="true"><i /></span>
            <small>Protection active</small>
            <strong>Votre espace<br />reste le vôtre.</strong>
            <span className="security-core__status"><i /> Sécurisé</span>
          </div>
          <div className="security-float security-float--messages">
            <span aria-hidden="true">✓</span>
            <div><small>Conversations</small><strong>Entièrement chiffrées</strong></div>
          </div>
          <div className="security-float security-float--photos">
            <span aria-hidden="true">◆</span>
            <div><small>Party &amp; Spicy</small><strong>Coffres photo verrouillés</strong></div>
          </div>
          <div className="security-float security-float--capture">
            <span aria-hidden="true">⊘</span>
            <div><small>Party &amp; Spicy</small><strong>Screenshot bloqué</strong></div>
          </div>
          <span className="lock-chip">● Sécurité prioritaire</span>
        </div>
        <div className="privacy-copy">
          <p className="eyebrow eyebrow--light"><span /> La sécurité avant tout</p>
          <h2>Votre intimité.<br /><em>Entièrement protégée.</em></h2>
          <p className="privacy-intro">
            Nearly protège les échanges les plus personnels dès leur partage.
            Vos conversations, vos photos et vos moments sensibles restent
            entre les personnes que vous avez choisies.
          </p>
          <div className="privacy-points">
            <div><span className="privacy-number">01</span><strong>Conversations chiffrées</strong><span>Chaque conversation est entièrement chiffrée pour rester privée.</span></div>
            <div><span className="privacy-number">02</span><strong>Photos chiffrées</strong><span>Les photos partagées bénéficient du même niveau de protection.</span></div>
            <div><span className="privacy-number">03</span><strong>Coffres-forts photo</strong><span>Dans Party et Spicy, le coffre doit être déverrouillé avant d’afficher les photos.</span></div>
            <div><span className="privacy-number">04</span><strong>Filtre anti-screenshot</strong><span>Les captures d’écran sont bloquées dans les modes Party et Spicy.</span></div>
          </div>
          <p className="security-note"><span aria-hidden="true">✓</span> La sécurité n’est pas une option ajoutée après coup. Elle fait partie de Nearly dès le départ.</p>
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
        <a className="footer-logo" href="#top" aria-label="Nearly, retour en haut">
          <img src="/media/nearly-app-icon-liquid-glass-v2.png" alt="Nearly" />
        </a>
        <p>Proches, même à distance.</p>
        <div>
          <a href="#securite">Sécurité</a>
          <a href="#faq">FAQ</a>
          <span>© 2026 Nearly</span>
        </div>
      </footer>
    </main>
  );
}
