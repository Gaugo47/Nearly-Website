"use client";

import { useState } from "react";
import IPhoneMockup from "./IPhoneMockup";

const spaces = [
  { key: "friends", name: "Les amis", space: "La bande", icon: "✳", line: "Le groupe qu’on ne quitte jamais.", image: "/media/app-amis.jpg", alt: "Accueil de l’espace amis La bande dans Nearly" },
  { key: "family", name: "La famille", space: "La tribu", icon: "⌂", line: "Un petit air de chez vous.", image: "/media/app-famille.jpg", alt: "Accueil de l’espace famille dans Nearly" },
  { key: "couple", name: "Le couple", space: "Nous deux", icon: "♡", line: "Les petits riens, à deux.", image: "/media/app-accueil.jpg", alt: "Accueil de l’espace couple dans Nearly" },
];

export default function RelationPreview() {
  const [selected, setSelected] = useState(0);
  const space = spaces[selected];
  return (
    <div className={`relationship-demo relationship-demo--${space.key}`}>
      <div className="relationship-switch" role="group" aria-label="Explorer les espaces Nearly">
        {spaces.map((item, index) => <button key={item.key} type="button" aria-pressed={selected === index} aria-controls="relationship-preview" onClick={() => setSelected(index)}><span aria-hidden="true">{item.icon}</span>{item.name}</button>)}
      </div>
      <div className="relationship-stage" id="relationship-preview">
        <div className="relationship-orbit" aria-hidden="true" />
        <span className="relationship-star relationship-star--one" aria-hidden="true">✦</span>
        <span className="relationship-star relationship-star--two" aria-hidden="true">✧</span>
        <IPhoneMockup className="relationship-phone" src={space.image} alt={space.alt} eager />
        <div className="relationship-caption" aria-live="polite"><span aria-hidden="true">{space.icon}</span><div><strong>{space.space}</strong><p>{space.line}</p></div></div>
      </div>
      <p className="relationship-note">Un espace privé pour chacun de vos liens.</p>
    </div>
  );
}
