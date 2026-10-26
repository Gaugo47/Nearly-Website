"use client";

import { useEffect, useState, type ReactNode } from "react";
import { sitePath } from "./site";

// Port of the couple home cards (SpaceHeroCard) shown in the App Store visual 01.
const paths = {
  heart: <path d="M12 21s-7.5-4.6-9.6-9.2C1 8.7 2.9 5 6.5 5c2.1 0 3.6 1.2 4.5 2.6l1 1.4 1-1.4C13.9 6.2 15.4 5 17.5 5 21.1 5 23 8.7 21.6 11.8 19.5 16.4 12 21 12 21z" fill="currentColor" />,
  infinite: <path d="M7 8c-2.3 0-4 1.8-4 4s1.7 4 4 4c3.5 0 6.5-8 10-8 2.3 0 4 1.8 4 4s-1.7 4-4 4c-3.5 0-6.5-8-10-8z" fill="none" stroke="currentColor" strokeWidth="2.4" />,
  navigate: <path d="M21 3 3 10.5l7.6 2.9L13.5 21z" fill="currentColor" />,
  flame: <path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.4 1.2-4 2.5-5 .1 2 1 3 2 3.5C11 9 11 5 12 2z" fill="currentColor" />,
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="13" r="3.2" fill="none" stroke="currentColor" strokeWidth="2" /></>,
  options: <><path d="M4 7h10M18 7h2M4 17h4M12 17h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><circle cx="16" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="10" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="2" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></>,
  time: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" /></>,
  timer: <><circle cx="12" cy="13" r="8.5" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M12 13V8.5M9.5 2.5h5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></>,
};
type IconName = keyof typeof paths;
const Icon = ({ name, className }: { name: IconName; className?: string }) => <svg className={className} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;

const cover = sitePath("/media/store/card-cover.webp");

const cards: { key: string; icon: IconName; label: string; body: ReactNode }[] = [
  {
    key: "together", icon: "infinite", label: "TEMPS ENSEMBLE",
    body: <>
      <p className="home-card__lead">ENSEMBLE DEPUIS LE 14 FÉVR. 2024</p>
      <div className="home-card__panel">
        <div><span><Icon name="calendar" />965</span><small>JOURS</small></div>
        <i />
        <div><span><Icon name="time" />09</span><small>HEURES</small></div>
        <i />
        <div><span><Icon name="timer" />41</span><small>MINUTES</small></div>
      </div>
    </>,
  },
  {
    key: "reunion", icon: "heart", label: "RETROUVAILLES",
    body: <>
      <p className="home-card__lead">ON SE RETROUVE DANS</p>
      <p className="home-card__count"><b>12</b><span>jours</span></p>
      <span className="home-card__chip"><Icon name="calendar" />Le 18 octobre 2026</span>
    </>,
  },
  {
    key: "distance", icon: "navigate", label: "DISTANCE",
    body: <>
      <p className="home-card__count"><b>5 833</b><span>km</span></p>
      <div className="home-card__route">
        <img src={sitePath("/media/store/card-alice.webp")} alt="" />
        <span><Icon name="heart" /></span>
        <img src={sitePath("/media/store/card-bob.webp")} alt="" />
      </div>
    </>,
  },
  {
    key: "streak", icon: "flame", label: "SÉRIE",
    body: <>
      <p className="home-card__streak"><Icon name="flame" /><b>12</b><span>jours d’affilée</span></p>
      <p className="home-card__hint">Passez tous aujourd’hui pour la garder</p>
      <div className="home-card__days">{[0, 1, 2, 3, 4, 5].map(day => <span key={day} className={day < 5 ? "is-done" : undefined}>{day < 5 && <Icon name="flame" />}</span>)}</div>
    </>,
  },
];

const start = 1; // The reunion card, as in the store visual.

export default function HeroPhone({ screen, alt }: { screen: string; alt: string }) {
  // Three copies make the loop seamless: we jump back by one set, without transition, after the last slide.
  const [index, setIndex] = useState(cards.length + start);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => { setAnimate(true); setIndex(value => value + 1); }, 2800);
    return () => window.clearInterval(timer);
  }, [paused]);

  const settle = () => {
    if (index < cards.length * 2) return;
    setAnimate(false);
    setIndex(index - cards.length);
  };

  return (
    <div className="hero-phone" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hero-phone__device">
        <img className="hero-phone__screen" src={screen} alt={alt} width={660} height={1429} fetchPriority="high" />
        <span className="hero-phone__patch" aria-hidden="true" />
      </div>
      <div className="hero-phone__rail" aria-hidden="true">
        <ul
          className="hero-phone__track"
          style={{ transform: `translateX(calc(${-index} * (var(--card) + var(--gap))))`, transition: animate ? undefined : "none" }}
          onTransitionEnd={settle}
        >
          {[0, 1, 2].flatMap(copy => cards.map(card => (
            <li className="home-card" key={`${copy}-${card.key}`} style={{ backgroundImage: `url(${cover})` }}>
              <div className="home-card__top">
                <span className="home-card__pill"><Icon name={card.icon} />{card.label}</span>
                <span className="home-card__actions"><span><Icon name="camera" /></span><span><Icon name="options" /></span></span>
              </div>
              <div>{card.body}</div>
            </li>
          )))}
        </ul>
      </div>
      <p className="hero-phone__note" aria-hidden="true">choisis ta carte ↑</p>
    </div>
  );
}
