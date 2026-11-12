type Source = { label: string; href: string };
type Comparison = {
  id: "couple" | "family" | "friends";
  tab: string;
  title: string;
  nearlyFocus: string;
  competitors: { name: string; focus: string; href: string }[];
  features: { label: string; apps: string[]; notes?: Record<string, string>; free?: boolean; paid?: Record<string, string> }[];
  extraSources?: Source[];
};

const keyDates = "Dates clés";
const partyMode = "Mode Party (18+)";
// Tethered's own site: after the free trial, a subscription is required to keep using the app.
const afterTrial = "Abonnement requis après l’essai gratuit";
// Mirrors the free plan of the app: a Nearly feature without `free` gets the $ badge,
// and `paid` adds it only where a competitor's official source says a subscription is needed.
const free = true;
const appPricing: Record<string, { value: string; detail: string; storeId?: string }> = {
  Nearly: { value: "9,99 €/mois", detail: "Premium, ou 59,99 €/an" },
  Tethered: { value: "14,99 à 17,99 €/mois", detail: "44,99 à 59,99 €/an", storeId: "6754725037" },
  "Couple Joy": { value: "14,99 à 44,99 €", detail: "Durées non précisées", storeId: "1624758651" },
  Love8: { value: "9,99 €/mois", detail: "Pour 2 · 29,99 €/an", storeId: "6448163027" },
  Candle: { value: "8,99 €/mois", detail: "19,99 à 44,99 €/an", storeId: "6743355635" },
  FamilyAlbum: { value: "5,49 €/mois", detail: "Premium Famille, ou 54,99 €/an", storeId: "935672069" },
  FamilyWall: { value: "4,99 €/mois", detail: "39,99 €/an", storeId: "496889629" },
  Life360: { value: "5,99 à 10,99 €", detail: "Silver et Gold · durées non précisées", storeId: "384830320" },
  Snapchat: { value: "3,99 €/mois", detail: "Snapchat+", storeId: "447188370" },
  Locket: { value: "1,99 à 39 €", detail: "Locket Gold · durées non précisées", storeId: "1600525061" },
  Bump: { value: "2,49 à 34,99 €", detail: "Bump Club · durées non précisées", storeId: "6471519217" },
};
const comparisons: Comparison[] = [
  {
    id: "couple",
    tab: "Couple",
    title: "Les applis pour les couples",
    nearlyFocus: "Rituels et souvenirs à deux",
    competitors: [
      { name: "Tethered", focus: "Défis à distance", href: "https://apps.apple.com/in/app/tethered-long-distance-games/id6754725037" },
      { name: "Couple Joy", focus: "Journal et widgets", href: "https://couplejoyapp.com/" },
      { name: "Love8", focus: "Localisation et compagnon", href: "https://apps.apple.com/us/app/love8-app-for-couples/id6448163027" },
      { name: "Candle", focus: "Rituels à deux", href: "https://www.trycandle.app/" },
    ],
    features: [
      { label: "Espaces amis et famille dans la même appli", apps: ["Nearly"] },
      { label: "Capsules temporelles à ouvrir plus tard", apps: ["Nearly"], free },
      { label: "Carte interactive de vos souvenirs", apps: ["Nearly"], free },
      { label: "Mode intime 18+ à activer à deux", apps: ["Nearly"], notes: { Love8: "Rubrique intimité", Candle: "Cartes intimité" } },
      { label: "Calendrier partagé", apps: ["Nearly"], free, notes: { Tethered: keyDates, "Couple Joy": keyDates, Love8: keyDates, Candle: "Compte à rebours" }, paid: { Tethered: afterTrial } },
      { label: "Compagnon virtuel à faire grandir ensemble", apps: ["Nearly", "Love8"], free },
      { label: "Position des proches sur une carte", apps: ["Nearly", "Tethered", "Love8"], free, paid: { Tethered: afterTrial } },
      { label: "Jeux et quiz à deux", apps: ["Nearly", "Tethered", "Couple Joy", "Candle"], free, paid: { Tethered: afterTrial, Candle: "Offre gratuite : une activité par jour" } },
    ],
    extraSources: [
      { label: "Tethered · essai et abonnement", href: "https://www.usetethered.com/" },
    ],
  },
  {
    id: "family",
    tab: "Famille",
    title: "Les applis pour les familles",
    nearlyFocus: "Souvenirs et rituels en famille",
    competitors: [
      { name: "FamilyAlbum", focus: "Photos et albums", href: "https://help.family-album.com/hc/en-us/articles/360038267214-What-is-FamilyAlbum" },
      { name: "FamilyWall", focus: "Organisation familiale", href: "https://support.familywall.com/en/support/solutions/articles/47001013681-about-familywall" },
      { name: "Life360", focus: "Localisation et sécurité", href: "https://www.life360.com/trust-safety/device-permissions" },
    ],
    features: [
      { label: "Questions et rituels en famille", apps: ["Nearly"], free },
      { label: "Compagnon virtuel à faire grandir ensemble", apps: ["Nearly"], free },
      { label: "Capsules temporelles à ouvrir plus tard", apps: ["Nearly"], free },
      { label: "Rétro animée du mois", apps: ["Nearly", "FamilyAlbum"], free, paid: { FamilyAlbum: "Mensuel : payant" } },
      { label: "Espaces dédiés au couple et aux amis", apps: ["Nearly"], notes: { Life360: "Cercles d’amis" } },
      { label: "Photos partagées dans le cercle familial", apps: ["Nearly", "FamilyAlbum", "FamilyWall"], free, paid: { FamilyWall: "Au-delà de 100 Mo : payant" } },
      { label: "Calendrier familial partagé", apps: ["Nearly", "FamilyWall"], free },
      { label: "Position des proches sur une carte", apps: ["Nearly", "FamilyWall", "Life360"], free, paid: { FamilyWall: "Temps réel : payant" } },
    ],
    extraSources: [
      { label: "FamilyWall Premium", href: "https://support.familywall.com/en/support/solutions/articles/47001239196-what-is-included-in-familywall-premium-" },
      { label: "FamilyWall · quota de stockage", href: "https://support.familywall.com/en/support/solutions/articles/47001013704-what-is-my-storage-quota-and-how-to-manage-it-" },
      { label: "FamilyAlbum gratuit et Premium", href: "https://blog.family-album.com/blog/is-familyalbum-really-free-what-you-get-without-paying/" },
    ],
  },
  {
    id: "friends",
    tab: "Amis",
    title: "Les applis pour les groupes d’amis",
    nearlyFocus: "Moments et soirées entre amis",
    competitors: [
      { name: "Snapchat", focus: "Snaps et discussions", href: "https://values.snap.com/privacy/privacy-by-product" },
      { name: "Locket", focus: "Photos sur votre écran", href: "https://apps.apple.com/us/app/locket-widget/id1600525061" },
      { name: "Bump", focus: "Carte des amis", href: "https://apps.apple.com/us/app/bump-real-life-is-happening/id6471519217" },
    ],
    features: [
      { label: "Coffre photo verrouillé à plusieurs", apps: ["Nearly"], notes: { Nearly: partyMode } },
      { label: "Répartition des dépenses", apps: ["Nearly"], free },
      { label: "Capsules temporelles à ouvrir plus tard", apps: ["Nearly"], free },
      { label: "Questions du jour entre amis", apps: ["Nearly"], free },
      { label: "Compagnon virtuel à faire grandir ensemble", apps: ["Nearly"], free },
      { label: "Calendrier partagé", apps: ["Nearly"], free, notes: { Snapchat: "Invitations à des événements" } },
      { label: "Jeux multijoueurs en groupe", apps: ["Nearly", "Snapchat"], free, notes: { Bump: "Défis sur la carte" } },
      { label: "Position des proches sur une carte", apps: ["Nearly", "Snapchat", "Bump"], free },
    ],
    extraSources: [
      { label: "Jeux sur Snapchat", href: "https://help.snapchat.com/hc/en-gb/articles/46189352630804-How-do-I-play-games-on-Snapchat" },
      { label: "Événements sur Snapchat", href: "https://help.snapchat.com/hc/en-gb/articles/21930772695572-What-are-Plans-and-how-do-they-work" },
      { label: "Widgets Snapchat", href: "https://help.snapchat.com/hc/en-gb/sections/5685920770580-Widgets-and-Extensions" },
    ],
  },
];

function PaidBadge({ label }: { label: string }) {
  return (
    <span className="app-comparison__paid" title={label}>
      <span aria-hidden="true">$</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

function FeatureMark({ included }: { included: boolean }) {
  return (
    <span className={included ? "app-comparison__mark app-comparison__mark--yes" : "app-comparison__mark"}>
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={included ? "m5 12 4 4L19 6" : "M7 12h10"} />
      </svg>
      <span className="sr-only">{included ? "Fonction documentée" : "Non documenté dans les sources consultées"}</span>
    </span>
  );
}

function ComparisonPanel({ comparison }: { comparison: Comparison }) {
  const { id, title, nearlyFocus, competitors, features, extraSources = [] } = comparison;
  const apps = [{ name: "Nearly", focus: nearlyFocus }, ...competitors];
  const priceSources = competitors.map(app => ({ label: `${app.name} · App Store`, href: `https://apps.apple.com/fr/app/id${appPricing[app.name].storeId}` }));
  const sources = [...competitors.map(app => ({ label: app.name, href: app.href })), ...priceSources, ...extraSources];
  const nearlyCell = (name: string) => name === "Nearly" ? "app-comparison__nearly" : undefined;
  // Rows are grouped by a rule, not by hand: first what at least one other app also offers
  // (most widespread first), then what only Nearly lists. A wall of Nearly-only rows at the top
  // reads as a rigged grid; the same rows under their own heading read as what they are.
  // A full ✓ at a competitor weighs more than a partial note, so the most common features lead.
  const elsewhere = (feature: Comparison["features"][number]) => competitors.reduce((score, app) => score + (feature.apps.includes(app.name) ? 10 : feature.notes?.[app.name] ? 1 : 0), 0);
  const groups = [
    { label: "En commun avec d’autres applis", rows: features.filter(feature => elsewhere(feature)).sort((a, b) => elsewhere(b) - elsewhere(a)) },
    { label: "En plus dans Nearly", rows: features.filter(feature => !elsewhere(feature)).sort((a, b) => Number(Boolean(b.free)) - Number(Boolean(a.free))) },
  ];
  const freeCount = features.filter(feature => feature.free).length;
  return (
    <section className="app-comparison__panel" data-comparison={id} id={`comparison-${id}-panel`} aria-labelledby={`comparison-${id}-title`}>
      <h3 className="app-comparison__panel-title" id={`comparison-${id}-title`}>{title}</h3>
      <p className="app-comparison__hint">Faites défiler le tableau pour voir toutes les applis. <span aria-hidden="true">→</span></p>
      <div className="app-comparison__scroll" role="region" aria-labelledby={`comparison-${id}-title`} tabIndex={0}>
        <table className="app-comparison__table" aria-describedby="comparison-notes">
          <caption className="sr-only">Fonctionnalités comparées par application</caption>
          <thead>
            <tr>
              <th scope="col">Fonctionnalité</th>
              {apps.map(app => (
                <th scope="col" className={nearlyCell(app.name)} key={app.name}>
                  {app.name}
                  <small>{app.focus}</small>
                  {app.name === "Nearly" && <span className="app-comparison__badge">App à venir</span>}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map(group => (
          <tbody key={group.label}>
            <tr className="app-comparison__group">
              <th scope="rowgroup">{group.label}</th>
              {apps.map(app => <td className={nearlyCell(app.name)} aria-hidden="true" key={app.name} />)}
            </tr>
            {group.rows.map(feature => (
              <tr key={feature.label}>
                <th scope="row">{feature.label}</th>
                {apps.map(app => {
                  const included = feature.apps.includes(app.name);
                  const note = feature.notes?.[app.name];
                  const paidLabel = app.name === "Nearly"
                    ? (included && !feature.free ? "Fonction Premium" : undefined)
                    : feature.paid?.[app.name];
                  return (
                    <td className={nearlyCell(app.name)} key={app.name}>
                      {paidLabel && <PaidBadge label={paidLabel} />}
                      {(included || !note) && <FeatureMark included={included} />}
                      {note && <span className="app-comparison__partial">{note}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          ))}
          <tbody>
            <tr className="app-comparison__price-row">
              <th scope="row">Prix de l’abonnement<small>App Store France, novembre 2026</small></th>
              {apps.map(app => (
                <td className={nearlyCell(app.name)} key={app.name}>
                  <strong>{appPricing[app.name].value}</strong>
                  <small>{appPricing[app.name].detail}</small>
                  {app.name === "Nearly" && <small className="app-comparison__free">{freeCount} fonctions sur {features.length} sans abonnement</small>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <details className="app-comparison__sources">
        <summary>Sources officielles consultées les 9 et 12 novembre 2026</summary>
        <ul>{sources.map(source => <li key={source.href}><a href={source.href}>{source.label} <span aria-hidden="true">↗</span></a></li>)}</ul>
      </details>
    </section>
  );
}

export default function AppComparison() {
  return (
    <section className="app-comparison" id="comparatif" aria-labelledby="comparison-title">
      <div className="app-comparison__inner">
        <header className="app-comparison__heading">
          <p className="eyebrow">Le comparatif des apps</p>
          <h2 id="comparison-title"><span className="store-pill">Nearly</span> face aux autres applis</h2>
          <p>Couple, famille, amis : à chaque onglet ses applis spécialisées, et Nearly dans les trois.</p>
        </header>
        <fieldset className="app-comparison__filters">
          <legend className="sr-only">Type de lien à comparer</legend>
          {comparisons.map(({ id, tab }) => (
            <label className="app-comparison__filter" key={id}>
              <input className="sr-only" id={`comparison-${id}`} type="radio" name="comparison-circle" defaultChecked={id === "couple"} aria-controls={`comparison-${id}-panel`} />
              <span>{tab}</span>
            </label>
          ))}
        </fieldset>
        <p className="app-comparison__legend">
          <span className="app-comparison__paid" aria-hidden="true">$</span>
          Réservé à un abonnement payant
        </p>
        {comparisons.map(comparison => <ComparisonPanel comparison={comparison} key={comparison.id} />)}
        <p className="app-comparison__notes" id="comparison-notes">
          ✓ Fonction documentée. Le tiret indique que la fonction n’est pas documentée dans les sources consultées. La colonne Nearly présente les fonctionnalités annoncées pour son application à venir. Certaines fonctionnalités peuvent dépendre de l’offre. Prix relevés sur l’App Store France le 9 novembre 2026 pour des applis à téléchargement gratuit avec achats intégrés ; ils peuvent évoluer. Le prix affiché pour Nearly est le tarif Premium prévu pour son application à venir. La pastille $ signale une fonction réservée, en tout ou partie, à un abonnement payant ; chez les concurrents, elle n’apparaît que si leur source officielle l’indique. Les autres fonctions de Nearly sont incluses dans l’offre gratuite, avec d’éventuelles limites d’usage ou de progression.
        </p>
      </div>
    </section>
  );
}
