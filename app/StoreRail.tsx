"use client";

import { useRef } from "react";

type Visual = { src: string; alt: string };

export default function StoreRail({ visuals }: { visuals: Visual[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => {
    const element = rail.current;
    if (!element) return;
    const step = element.querySelector("figure")?.getBoundingClientRect().width ?? 280;
    element.scrollBy({ left: direction * (step + 20) * 2, behavior: "smooth" });
  };
  return (
    <div className="store-rail">
      <div className="store-rail__controls">
        <button type="button" onClick={() => scroll(-1)} aria-label="Visuels précédents"><span aria-hidden="true">←</span></button>
        <button type="button" onClick={() => scroll(1)} aria-label="Visuels suivants"><span aria-hidden="true">→</span></button>
      </div>
      <div className="store-rail__track" ref={rail} tabIndex={0} role="region" aria-label="Aperçu de l’application Nearly">
        {visuals.map(visual => (
          <figure className="store-rail__item" key={visual.src}>
            <img src={visual.src} alt={visual.alt} width={720} height={1561} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
    </div>
  );
}
