"use client";

import { useEffect, useId, useRef, useState } from "react";

type Visual = { src: string; alt: string };

export default function StoreRail({ visuals }: { visuals: Visual[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [position, setPosition] = useState({ first: 1, last: 1, atStart: true, atEnd: false });

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => {
      const bounds = element.getBoundingClientRect();
      const items = Array.from(element.querySelectorAll("figure"));
      const visible = items.flatMap((item, index) => {
        const rect = item.getBoundingClientRect();
        return rect.left < bounds.right - 24 && rect.right > bounds.left + 24 ? [index + 1] : [];
      });
      setPosition({ first: visible[0] ?? 1, last: visible.at(-1) ?? 1, atStart: element.scrollLeft <= 2, atEnd: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
    };
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => { element.removeEventListener("scroll", update); observer.disconnect(); };
  }, [visuals.length]);

  const scroll = (direction: number) => {
    const element = rail.current;
    if (!element) return;
    const step = element.querySelector("figure")?.getBoundingClientRect().width ?? 280;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    const count = Math.max(1, Math.floor((element.clientWidth - 48) / (step + gap)));
    element.scrollBy({ left: direction * (step + gap) * count, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return (
    <div className="store-rail">
      <div className="store-rail__controls">
        <p className="store-rail__hint">Un aperçu de votre petit monde</p>
        <span className="store-rail__count" aria-live="polite" aria-atomic="true"><span className="sr-only">Visuels affichés :</span> {position.first === position.last ? position.first : `${position.first}–${position.last}`} / {visuals.length}</span>
        <button type="button" onClick={() => scroll(-1)} disabled={position.atStart} aria-controls={trackId} aria-label="Visuels précédents"><span aria-hidden="true">←</span></button>
        <button type="button" onClick={() => scroll(1)} disabled={position.atEnd} aria-controls={trackId} aria-label="Visuels suivants"><span aria-hidden="true">→</span></button>
      </div>
      <div className="store-rail__track" id={trackId} ref={rail} tabIndex={0} role="region" aria-label="Aperçu de l’application Nearly" onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          scroll(event.key === "ArrowLeft" ? -1 : 1);
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          event.currentTarget.scrollTo({ left: event.key === "Home" ? 0 : event.currentTarget.scrollWidth, behavior: "instant" });
        }
      }}>
        {visuals.map(visual => (
          <figure className="store-rail__item" key={visual.src}>
            <img src={visual.src} alt={visual.alt} width={720} height={1561} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
    </div>
  );
}
