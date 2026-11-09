type Source = { label: string; href: string };
type Comparison = {
  id: "couple" | "family" | "friends";
  tab: string;
  title: string;
  nearlyFocus: string;
  competitors: { name: string; focus: string; href: string }[];
  features: { label: string; apps: string[]; notes?: Record<string, string> }[];
  extraSources?: Source[];
};

const keyDates = "Dates clés";
const partyMode = "Mode Party (18+)";
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
      { label: "Questions pour les couples", apps: ["Nearly", "Tethered", "Couple Joy", "Love8", "Candle"] },
      { label: "Jeux et quiz à deux", apps: ["Nearly", "Tethered", "Couple Joy", "Candle"] },
      { label: "Souvenirs photo partagés en privé", apps: ["Nearly", "Tethered", "Couple Joy", "Love8", "Candle"] },
      { label: "Widgets sur le téléphone", apps: ["Nearly", "Tethered", "Couple Joy", "Love8", "Candle"] },
      { label: "Position des proches sur une carte", apps: ["Nearly", "Tethered", "Love8"] },
      { label: "Calendrier partagé", apps: ["Nearly"], notes: { Tethered: keyDates, "Couple Joy": keyDates, Love8: keyDates, Candle: "Compte à rebours" } },
      { label: "Compagnon virtuel à faire grandir ensemble", apps: ["Nearly", "Love8"] },
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
      { label: "Photos partagées dans le cercle familial", apps: ["Nearly", "FamilyAlbum", "FamilyWall"] },
      { label: "Calendrier familial partagé", apps: ["Nearly", "FamilyWall"] },
      { label: "Position des proches sur une carte", apps: ["Nearly", "FamilyWall", "Life360"] },
      { label: "Questions et rituels en famille", apps: ["Nearly"] },
      { label: "Compagnon virtuel à faire grandir ensemble", apps: ["Nearly"] },
      { label: "Livres photo imprimés", apps: ["FamilyAlbum"] },
      { label: "Alerte SOS dédiée", apps: ["Life360"] },
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
      { label: "Photos partagées avec un cercle choisi", apps: ["Nearly", "Snapchat", "Locket", "Bump"] },
      { label: "Position des proches sur une carte", apps: ["Nearly", "Snapchat", "Bump"] },
      { label: "Jeux multijoueurs en groupe", apps: ["Nearly", "Snapchat"], notes: { Bump: "Défis sur la carte" } },
      { label: "Calendrier partagé", apps: ["Nearly"], notes: { Snapchat: "Invitations à des événements" } },
      { label: "Widgets sur le téléphone", apps: ["Nearly", "Snapchat", "Locket", "Bump"] },
      { label: "Coffre photo verrouillé à plusieurs", apps: ["Nearly"], notes: { Nearly: partyMode } },
      { label: "Répartition des dépenses", apps: ["Nearly"], notes: { Nearly: partyMode } },
    ],
    extraSources: [
      { label: "Jeux sur Snapchat", href: "https://help.snapchat.com/hc/en-gb/articles/46189352630804-How-do-I-play-games-on-Snapchat" },
      { label: "Événements sur Snapchat", href: "https://help.snapchat.com/hc/en-gb/articles/21930772695572-What-are-Plans-and-how-do-they-work" },
      { label: "Widgets Snapchat", href: "https://help.snapchat.com/hc/en-gb/sections/5685920770580-Widgets-and-Extensions" },
    ],
  },
];

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
  const sources = [...competitors.map(app => ({ label: app.name, href: app.href })), ...extraSources];
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
                <th scope="col" key={app.name}>
                  {app.name}
                  <small>{app.focus}</small>
                  {app.name === "Nearly" && <span className="app-comparison__badge">App à venir</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map(feature => (
              <tr key={feature.label}>
                <th scope="row">{feature.label}</th>
                {apps.map(app => {
                  const included = feature.apps.includes(app.name);
                  const note = feature.notes?.[app.name];
                  return (
                    <td key={app.name}>
                      {(included || !note) && <FeatureMark included={included} />}
                      {note && <span className="app-comparison__partial">{note}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <details className="app-comparison__sources">
        <summary>Sources officielles consultées le 9 novembre 2026</summary>
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
          <p>Choisissez un type de lien pour comparer les applis et ce que vous pouvez partager avec vos proches.</p>
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
        {comparisons.map(comparison => <ComparisonPanel comparison={comparison} key={comparison.id} />)}
        <p className="app-comparison__notes" id="comparison-notes">
          ✓ Fonction documentée. Le tiret indique que la fonction n’est pas documentée dans les sources consultées. La colonne Nearly présente les fonctionnalités annoncées pour son application à venir. Certaines fonctionnalités peuvent dépendre de l’offre.
        </p>
      </div>
    </section>
  );
}
