import IPhoneMockup from "./IPhoneMockup";

const spaces = [
  { key: "friends", name: "Les amis", space: "La bande", icon: "✳", line: "Le groupe qu’on ne quitte jamais.", image: "/media/app-amis.jpg", alt: "Accueil de l’espace amis La bande dans Nearly" },
  { key: "family", name: "La famille", space: "La tribu", icon: "⌂", line: "Un petit air de chez vous.", image: "/media/app-famille.jpg", alt: "Accueil de l’espace famille dans Nearly" },
  { key: "couple", name: "Le couple", space: "Nous deux", icon: "♡", line: "Les petits riens, à deux.", image: "/media/app-accueil.jpg", alt: "Accueil de l’espace couple dans Nearly" },
];

export default function RelationPreview() {
  return (
    <div className="relations-preview" aria-label="Trois espaces Nearly : amis, famille et couple">
      <p className="relations-preview__note">Chacun son espace. Tous dans Nearly.</p>
      <div className="relations-preview__cards">
        {spaces.map(space => (
          <figure className={`relation-preview relation-preview--${space.key}`} key={space.key}>
            <figcaption><span>{space.name}</span><strong><i aria-hidden="true">{space.icon}</i>{space.space}</strong></figcaption>
            <IPhoneMockup className="relation-phone" src={space.image} alt={space.alt} eager />
            <p>{space.line}</p>
          </figure>
        ))}
      </div>
      <span className="relations-preview__spark" aria-hidden="true">✧</span>
    </div>
  );
}
