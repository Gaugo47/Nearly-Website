
import { sitePath, absoluteUrl } from "../site";
import SiteNav from "../SiteNav";
import SiteFooter from "../SiteFooter";
import WaitlistForm from "../WaitlistForm";
import PhoneShowcase from "../PhoneShowcase";
import StoreRail from "../StoreRail";
import HeroPhone from "../HeroPhone";
import FeatureTour from "../FeatureTour";


// The English generator switches this to "en", so each page shows the store visuals in its own language.
const store = { language: "fr" } as const;
const storeVisual = (number: string) => sitePath(`/media/store/${store.language}/${number}.webp`);

const tour = (file: string) => sitePath(`/media/tour/${store.language}/${file}.webp`);

const tourSteps = [
  {
    key: "rituals",
    label: "Rituels & jeux",
    title: "Les rituels",
    accent: "qui rapprochent.",
    text: "Un « ça va ? » qui devient une vraie réponse. Une question, une humeur, un petit défi à partager.",
    points: ["Une question du jour, chacun son tour", "Des questions pour aller plus loin", "Un calendrier partagé pour vos rendez-vous"],
    screen: tour("rituals"),
    screenAlt: "Écran Rituels & jeux de Nearly : mini-jeux, question du jour, questions et activité surprise",
    pops: [
      { src: tour("pop-daily"), alt: "Carte Question du jour de l’accueil : tout le monde a répondu, voir les réponses", className: "tour-pop--daily", width: 690, height: 500 },
      { src: tour("pop-bucket"), alt: "Tuile Bucket list : vos projets à deux", className: "tour-pop--bucket", width: 332, height: 312 },
    ],
  },
  {
    key: "moments",
    label: "Moments",
    title: "Les souvenirs",
    accent: "qu’on ressort.",
    text: "La photo floue, le fou rire, la journée ensemble. Gardez les moments qui vous ressemblent.",
    points: ["Un moment par jour, en double photo", "Vos souvenirs posés sur une carte", "Des réactions et des mots doux entre vous"],
    screen: tour("moments"),
    screenAlt: "Écran Moment du jour de Nearly : la carte des souvenirs et le journal des moments partagés",
    pops: [
      { src: tour("pop-flowers"), alt: "Moment double photo d’Alice à Paris : un bouquet de pivoines et son selfie", className: "tour-pop--flowers", width: 594, height: 976 },
    ],
  },
  {
    key: "mochi",
    label: "Compagnon",
    title: "Mochi grandit",
    accent: "avec votre lien.",
    text: "Un drôle de compagnon adopté par votre petit monde. Mochi grandit au fil de vos attentions partagées.",
    points: ["Il gagne de l’XP à chaque attention", "Nourrir, câliner, débloquer des tenues", "Des objectifs doux, jamais des obligations"],
    screen: tour("companion"),
    screenAlt: "Écran Mochi de Nearly : le compagnon, son niveau et ses jauges",
    pops: [
      { src: tour("pop-checklist"), alt: "Carte Aujourd’hui pour Mochi : 3 attentions sur 4, encore une à faire", className: "tour-pop--checklist", width: 690, height: 716 },
    ],
  },
];

const railVisuals = [
  { src: storeVisual("02"), alt: "Tes proches, en direct : les proches posés sur un globe avec leur ville" },
  { src: storeVisual("03"), alt: "Couple, amis, famille : un espace pour chacun, avec ses couleurs, ses rituels et ses membres" },
  { src: storeVisual("04"), alt: "Widgets pour le couple, les amis et la famille sur l’écran d’accueil" },
  { src: storeVisual("05"), alt: "Mochi grandit avec votre lien : le compagnon virtuel et ses jauges" },
  { src: storeVisual("06"), alt: "Jouez ensemble, même à 1 000 km : la ludothèque des mini-jeux de Nearly" },
  { src: storeVisual("07"), alt: "Party Mode, soirées légendaires : défis, « Je n’ai jamais » et statistiques de soirée" },
  { src: storeVisual("08"), alt: "Spicy Mode, votre jardin secret : un espace privé pour le couple, toujours consenti" },
  { src: storeVisual("09"), alt: "Tous vos plans au même endroit : le calendrier partagé et ses rappels" },
  { src: storeVisual("10"), alt: "Vos moments sur la carte : les souvenirs posés sur un globe" },
];

// The two-player games of Spicy, as the app's rituals name them. Suggestive, never explicit: the
// positions wheel stays in the app.
const spicyIcons = {
  flame: <path d="M12 3c1 3.6 4.5 5 4.5 10a4.5 4.5 0 0 1-9 0c0-2.2 1.1-3.6 2.3-4.5.1 1.8.9 2.7 1.8 3.1C11 9 11 6 12 3z" />,
  swap: <path d="M7 7h11l-3-3M17 17H6l3 3" />,
  chat: <path d="M5 5h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM19.5 9.5A2 2 0 0 1 21 11.4V16a2 2 0 0 1-2 2v2.5l-3-2.5h-4" />,
  bookmark: <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z" />,
  list: <path d="M9 7h11M9 12h11M9 17h11M4 7l1 1 2-2M4 12l1 1 2-2M4 17h2" />,
  hourglass: <path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" />,
};
const spicyGames = [
  { icon: spicyIcons.flame, title: "Question sans filtre", text: "Une réponse chacun, révélée seulement quand vous avez répondu tous les deux." },
  { icon: spicyIcons.swap, title: "Défi ou confidence", text: "Oser ou se livrer, en trois intensités. Un joker permet toujours de passer." },
  { icon: spicyIcons.chat, title: "Confidences épicées", text: "Vingt questions pour vous découvrir autrement, toujours consenties." },
  { icon: spicyIcons.bookmark, title: "Ce qui fait craquer", text: "Vos envies, vos limites et les petits détails à ne pas oublier." },
  { icon: spicyIcons.list, title: "Liste des envies", text: "Oui, peut-être, pas maintenant : chacun avance à son rythme." },
  { icon: spicyIcons.hourglass, title: "Message à ouvrir plus tard", text: "Un mot glissé pour plus tard, pour faire durer le suspense." },
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

      <section className="store-hero" id="top">
        <div className="store-hero__copy">
          <p className="store-chip"><span className="store-chip__dot" aria-hidden="true" /> Bientôt sur iOS &amp; Android</p>
          <h1>Proches,<br /><span className="store-pill">même à distance.</span></h1>
          <p className="store-hero__lede">Vos amis, votre famille, votre couple. Un espace privé pour partager le quotidien, jouer et garder les moments qui vous rapprochent.</p>
          <div className="store-hero__actions">
            <a className="store-button" href="#liste-attente">Rejoindre la liste d’attente <ArrowIcon /></a>
            <a className="store-link" href="#vos-liens">Voir l’app <span aria-hidden="true">→</span></a>
          </div>
          <ul className="store-spaces" aria-label="Les espaces Nearly">
            <li className="store-spaces__couple">Couple</li>
            <li className="store-spaces__friends">Amis</li>
            <li className="store-spaces__family">Famille</li>
          </ul>
        </div>
        <HeroPhone screen={sitePath(`/media/store/home-screen-${store.language}.webp`)} alt="Accueil couple de Nearly : Alice et Bob, niveau 5, compte à rebours des retrouvailles et question du jour" />
      </section>

      <nav className="showcase-index" aria-label="Explorer l’application"><span>Dans Nearly</span><a href="#vos-liens">Vos espaces</a><a href="#experience">Le quotidien</a><a href="#party-mode">Party</a><a href="#spicy">Spicy</a><a href="#securite">Confidentialité</a></nav>

      <section className="store-gallery" id="vos-liens" aria-labelledby="store-gallery-title">
        <div className="store-gallery__heading">
          <h2 id="store-gallery-title">Une app,<br /><span className="store-pill">tous vos liens.</span></h2>
          <p>Couple, amis, famille : chaque espace a ses couleurs, ses jeux et ses souvenirs. Faites défiler pour découvrir Nearly.</p>
        </div>
        <StoreRail visuals={railVisuals} />
      </section>

      <section className="experience-tour" id="experience" aria-labelledby="experience-title">
        <div className="experience-tour__heading">
          <p className="store-chip store-chip--light"><span className="store-chip__dot" aria-hidden="true" /> Dans chacun de vos espaces</p>
          <h2 id="experience-title">Les petits riens<br /><span className="store-pill">font les grands liens.</span></h2>
          <p>Questions, souvenirs et attentions partagées : les mêmes petites habitudes pour vos amis, votre famille et votre couple.</p>
        </div>
        <FeatureTour steps={tourSteps} />
      </section>

      <section className="gallery-band">
        <div className="gallery-copy">
          <p className="eyebrow eyebrow--light"><span /> Les moments à venir</p>
          <h2>« On se fait<br /><em>un truc ? »</em></h2>
          <p className="gallery-intro">Un dîner à deux, un week-end en bande, un déjeuner en famille. Trouvez une idée, préparez les retrouvailles et gardez vos lieux préférés.</p>
        </div>
        <PhoneShowcase label="Galerie d’écrans Nearly" screens={[
          { src: "/media/app-carte.jpg", alt: "Carte des proches Nearly", label: "En direct", card: { label: "Maya · en direct", lead: "/media/store/card-maya.webp", round: true, route: ["work", "home"], steps: [
            { title: "En route vers la maison", detail: "32 km/h · depuis le travail", progress: .58 },
            { title: "Arrivée à la maison", detail: "Partagé avec La bande", progress: 1 },
          ] } },
          { src: "/media/app-idees.jpg", alt: "Idées personnalisées dans Nearly", label: "Idées", card: { label: "Alice & Bob · agenda", lead: "/media/store/nearly-icon-96.webp", people: ["/media/store/card-alice.webp", "/media/store/card-bob.webp"], steps: [
            { title: "Alice propose « Votre série à vous »", detail: "Samedi à 21:00 · en attente de Bob", marks: ["✓", "…"] },
            { title: "Bob a accepté", detail: "Ajouté à votre agenda partagé", marks: ["✓", "✓"] },
          ] } },
          { src: "/media/app-amis.jpg", alt: "Accueil de l’espace amis La bande dans Nearly", label: "La bande", card: { label: "Question du jour", lead: "/media/store/nearly-icon-96.webp", people: ["/media/store/card-maya.webp", "/media/store/card-camille.webp", "/media/store/card-leo.webp", "/media/store/card-alice.webp"], steps: [
            { title: "2 réponses sur 4", detail: "Réponds pour découvrir les leurs", marks: ["✓", "✓", "", ""] },
            { title: "Léo vient de répondre", detail: "Il ne manque plus que toi", marks: ["✓", "✓", "✓", ""] },
          ] } },
        ]} />
      </section>

      <section className="mode-intro" aria-labelledby="modes-title"><p className="eyebrow"><span /> Les sous-modes Nearly</p><h2 id="modes-title">À chaque moment,<br /><em>son ambiance.</em></h2><p>Le quotidien dans vos espaces. Les soirées dans Party. La complicité à deux dans Spicy.</p></section>

      <section className="party-showcase" id="party-mode" aria-labelledby="party-title">
        <div className="party-copy">
          <p className="eyebrow eyebrow--party"><span /> Entre amis · Party Mode · 18+</p>
          <h2 id="party-title">Une soirée.<br /><em>Toute la bande.</em></h2>
          <p className="party-intro">Des jeux pour lancer l’ambiance, un coffre pour les photos et des comptes faciles à partager.</p>
          <div className="party-features"><div><span>01</span><strong>Party Lab</strong><p>Jeux et défis pour lancer la soirée avec votre groupe.</p></div><div><span>02</span><strong>Photos de soirée</strong><p>Un coffre verrouillé pour les souvenirs de la bande.</p></div><div id="frais-partages"><span>03</span><strong>Frais partagés</strong><p>Ajoutez les dépenses et retrouvez qui rembourse qui.</p></div></div>
        </div>
        <PhoneShowcase label="Aperçu du Party Mode de Nearly pour les groupes d’amis" screens={[
          { src: "/media/app-party-lab.jpg", alt: "Jeux et défis du Party Lab de Nearly", label: "Party Lab", card: { label: "Party Lab · classement", lead: "/media/store/nearly-icon-96.webp", people: ["/media/store/card-maya.webp", "/media/store/card-camille.webp", "/media/store/card-leo.webp", "/media/store/card-alice.webp"], steps: [
            { title: "Léo prend 1 point", detail: "Il l’a déjà fait, évidemment", marks: ["2", "1", "3", "1"] },
            { title: "Léo mène la soirée", detail: "Maya et Camille le talonnent", marks: ["3", "2", "4", "1"] },
          ] } },
          { src: "/media/app-party-photos.png", alt: "Coffre de photos privées d’une soirée entre amis dans Nearly", label: "Coffre photo", card: { label: "Coffre de soirée", lead: "/media/store/card-leo.webp", round: true, photos: ["/media/store/vault-1.webp", "/media/store/vault-2.webp", "/media/store/vault-3.webp"], steps: [
            { title: "Léo a ajouté 12 photos", detail: "Visibles après déverrouillage", locked: true },
            { title: "Coffre déverrouillé", detail: "Les souvenirs d’hier soir s’affichent", locked: false },
          ] } },
          { src: "/media/app-party-expenses.jpg", alt: "Répartition des frais partagés entre amis dans Nearly", label: "Frais partagés", card: { label: "Frais · 120,00 €", lead: "/media/store/card-camille.webp", round: true, route: ["coins", "check"], steps: [
            { title: "Camille t’a remboursé", detail: "40,00 € · reste 80,00 €", progress: .34 },
            { title: "Léo t’a remboursé", detail: "40,00 € · reste 40,00 €", progress: .67 },
          ] } },
        ]} />
      </section>

      <section className="spicy" id="spicy" aria-labelledby="spicy-title">
        <div className="spicy-copy">
          <p className="eyebrow eyebrow--spicy"><span /> À deux · Spicy · 18+</p>
          <h2 id="spicy-title">Votre complicité.<br /><em>À votre rythme.</em></h2>
          <p className="spicy-intro">Un espace intime qui s’ouvre lorsque vous êtes tous les deux d’accord. Vos photos restent dans un coffre protégé par code.</p>
          <div className="spicy-principles"><div><span>01</span><strong>À deux, d’accord</strong><p>Un mode réservé aux adultes, activé avec un consentement partagé.</p></div><div><span>02</span><strong>Un coffre privé</strong><p>Vos photos restent protégées par code, avec un accès temporaire.</p></div><div><span>03</span><strong>Votre rythme</strong><p>Le droit de passer ou de quitter le mode, toujours.</p></div></div>
        </div>
        <PhoneShowcase label="Aperçu du mode Spicy privé de Nearly" screens={[
          { src: "/media/app-spicy-home.jpg", alt: "Accueil consenti du mode Spicy de Nearly", label: "Votre antre", card: { label: "Spicy · tension du jour", lead: "/media/store/nearly-icon-96.webp", people: ["/media/store/card-alice.webp", "/media/store/card-bob.webp"], steps: [
            { title: "Bob a choisi son emoji", detail: "Choisis le tien pour voir le sien", marks: ["…", "🔒"] },
            { title: "Réponses révélées", detail: "Vous l’avez choisi tous les deux", marks: ["🔥", "🔥"] },
          ] } },
          { src: "/media/app-spicy-games.jpg", alt: "Jeux à deux du mode Spicy : question sans filtre, confidences et défis", label: "Jeux", card: { label: "Défi ou confidence", lead: "/media/store/nearly-icon-96.webp", people: ["/media/store/card-alice.webp", "/media/store/card-bob.webp"], steps: [
            { title: "Bob a choisi d’oser", detail: "Intensité franche · à ton tour", marks: ["…", "✓"] },
            { title: "Défi relevé à deux", detail: "Il vous reste un joker chacun", marks: ["✓", "✓"] },
          ] } },
          { src: "/media/app-spicy-vault.jpg", alt: "Coffre privé du mode Spicy protégé par code secret", label: "Coffre privé", card: { label: "Spicy · coffre privé", lead: "/media/store/nearly-icon-96.webp", route: ["unlock", "lock"], steps: [
            { title: "Coffre ouvert", detail: "Il se referme seul au bout de 5 minutes", progress: .3 },
            { title: "Coffre refermé", detail: "Le code est de nouveau demandé", progress: 1 },
          ] } },
        ]} />
        <div className="spicy-games">
          <div className="spicy-games__heading">
            <h3 id="spicy-games-title">Dans votre antre</h3>
            <p>Des jeux à deux pour faire monter la tension, sans jamais rien forcer.</p>
          </div>
          <ul>
            {spicyGames.map(game => (
              <li key={game.title}>
                <svg viewBox="0 0 24 24" aria-hidden="true">{game.icon}</svg>
                <strong>{game.title}</strong>
                <p>{game.text}</p>
              </li>
            ))}
          </ul>
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

      <aside className="try-aside">
        <div><p className="eyebrow"><span /> Le journal Nearly</p><h2>Les liens, au fil des jours.</h2><p>Des conseils pour la distance, des idées pour le quotidien et nos sélections d’applications pour vos proches.</p></div>
        <a className="button button--primary" href={sitePath("/blog/")}>Explorer le blog <ArrowIcon /></a>
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
