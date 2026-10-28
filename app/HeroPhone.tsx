"use client";

import { useEffect, useState, type ReactNode, type TransitionEvent } from "react";
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
  gift: <><rect x="3" y="8" width="18" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M5 13v8h14v-8M12 8v13M12 8C10 4 6.5 4.5 7.5 7c.4 1 2.5 1 4.5 1zm0 0c2-4 5.5-3.5 4.5-1-.4 1-2.5 1-4.5 1z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /></>,
  chat: <><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v5a2.5 2.5 0 0 1-2.5 2.5H8l-4 3.5V13.3A2.5 2.5 0 0 1 3 11z" fill="currentColor" /><path d="M19 8.5a2 2 0 0 1 2 2V15a2 2 0 0 1-1 1.7V20l-3.4-3H11a2 2 0 0 1-1.9-1.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></>,
  checkbox: <><rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" /><path d="m7.5 12 3 3 6-6.5" fill="none" stroke="#21184d" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />,
  star: <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z" fill="currentColor" />,
  sparkles: <path d="M12 3c.7 4.3 2.7 6.3 7 7-4.3.7-6.3 2.7-7 7-.7-4.3-2.7-6.3-7-7 4.3-.7 6.3-2.7 7-7zM19 15c.3 1.8 1.2 2.7 3 3-1.8.3-2.7 1.2-3 3-.3-1.8-1.2-2.7-3-3 1.8-.3 2.7-1.2 3-3z" fill="currentColor" />,
  video: <><rect x="2.5" y="6" width="13" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="m15.5 10.5 5-3v9l-5-3z" fill="currentColor" /></>,
  train: <><rect x="5" y="3" width="14" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M5 10h14M8.5 21l2-4M15.5 21l-2-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></>,
};
type IconName = keyof typeof paths;
const Icon = ({ name, className }: { name: IconName; className?: string }) => <svg className={className} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;

const photo = (name: string) => sitePath(`/media/store/card-${name}.webp`);

// The agenda and the bucket list are the app's light list cards: no photo, a header with the space.
const listHeader = (eyebrow: string) => (
  <div className="home-card__list-head">
    <Icon name="heart" />
    <b>{"Alice & Bob"}</b>
    <small>{eyebrow}</small>
    <span><Icon name="options" /></span>
  </div>
);

type Card = { key: string; icon: IconName; label: string; cover?: string; body: ReactNode };

// Every card a couple space can show, in the order of the app's settings sheet,
// plus the family birthday card. "Today" is 6 October 2026, twelve days before the reunion.
const cards: Card[] = [
  {
    key: "reunion", icon: "heart", label: "RETROUVAILLES", cover: photo("cover"),
    body: <>
      <p className="home-card__lead">ON SE RETROUVE DANS</p>
      <p className="home-card__count"><b>12</b><span>jours</span></p>
      <span className="home-card__chip"><Icon name="calendar" />Le 18 octobre 2026</span>
    </>,
  },
  {
    key: "together", icon: "infinite", label: "TEMPS ENSEMBLE", cover: photo("together"),
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
    key: "distance", icon: "navigate", label: "DISTANCE", cover: photo("distance"),
    body: <>
      <p className="home-card__count"><b>5 833</b><span>km</span></p>
      <div className="home-card__route">
        <img src={photo("alice")} alt="" />
        <span><Icon name="heart" /></span>
        <img src={photo("bob")} alt="" />
      </div>
    </>,
  },
  {
    key: "agenda", icon: "calendar", label: "AGENDA",
    body: <>
      {listHeader("AGENDA")}
      <ul className="home-card__rows">
        <li><span className="home-card__tile"><Icon name="video" /></span><p><b>Ciné en visio</b><small>9 oct. 21:00</small></p><em>J-3</em></li>
        <li><span className="home-card__tile"><Icon name="train" /></span><p><b>Retrouvailles à Lyon</b><small>18 oct. · Gare Part-Dieu</small></p><em>J-12</em></li>
      </ul>
    </>,
  },
  {
    key: "streak", icon: "flame", label: "SÉRIE", cover: photo("streak"),
    body: <>
      <p className="home-card__streak"><Icon name="flame" /><b>12</b><span>jours d’affilée</span></p>
      <p className="home-card__hint">Passez tous aujourd’hui pour la garder</p>
      <div className="home-card__days">{[0, 1, 2, 3, 4, 5].map(day => <span key={day} className={day < 5 ? "is-done" : undefined}>{day < 5 && <Icon name="flame" />}</span>)}</div>
    </>,
  },
  {
    key: "chat", icon: "chat", label: "MESSAGES", cover: photo("chat"),
    body: <div className="home-card__message">
      <div>
        <p>Hâte de te voir samedi ! 💜</p>
        <small><i />Bob · il y a 5 min<em>Nouveau</em></small>
      </div>
      <p className="home-card__open">Ouvrir →</p>
    </div>,
  },
  {
    key: "bucket", icon: "checkbox", label: "BUCKET LIST",
    body: <>
      {listHeader("BUCKET LIST · 4/9")}
      <ul className="home-card__rows">
        <li><span className="home-card__tile home-card__wish"><i /></span><p><b>Voir les aurores boréales</b><small>Grande envie</small></p><Icon name="star" className="home-card__star" /></li>
        <li className="is-done"><span className="home-card__tile home-card__wish"><i><Icon name="check" /></i></span><p><b>Apprendre à faire des pâtes</b><small>Réalisée · cochée par Alice</small></p></li>
      </ul>
    </>,
  },
  {
    key: "birthday", icon: "gift", label: "PROCHAIN ANNIVERSAIRE", cover: photo("birthday"),
    body: <>
      <p className="home-card__lead">PROCHAIN ANNIVERSAIRE</p>
      <div className="home-card__event">
        <span><Icon name="gift" /></span>
        <p><b>Anniversaire de Bob</b><small>jeu. 22 oct.</small></p>
        <em>J-16</em>
      </div>
    </>,
  },
];

const start = 0; // The reunion card, as in the store visual.

export default function HeroPhone({ screen, alt }: { screen: string; alt: string }) {
  // Three copies make the loop seamless: we jump back by one set, without transition, after the last slide.
  const [index, setIndex] = useState(cards.length + start);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      // A hidden tab runs no transition, so no transitionend would bring the track back.
      if (document.hidden) return;
      setAnimate(true);
      // Past the last copy means a transitionend was missed: the next slide leaves from the middle copy.
      setIndex(value => (value >= cards.length * 2 ? value - cards.length : value) + 1);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [paused]);

  const settle = (event: TransitionEvent<HTMLUListElement>) => {
    if (event.target !== event.currentTarget || index < cards.length * 2) return;
    setAnimate(false);
    setIndex(index - cards.length);
  };

  return (
    // Only a mouse pauses it: a tap on a phone fires mouseenter and never the mouseleave that would resume.
    <div className="hero-phone" onPointerEnter={event => event.pointerType === "mouse" && setPaused(true)} onPointerLeave={() => setPaused(false)}>
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
            <li className={`home-card${card.cover ? "" : " home-card--list"}`} key={`${copy}-${card.key}`} style={card.cover ? { backgroundImage: `url(${card.cover})` } : undefined}>
              {card.cover && (
                <div className="home-card__top">
                  <span className="home-card__pill"><Icon name={card.icon} />{card.label}</span>
                  <span className="home-card__actions"><span><Icon name="camera" /></span><span><Icon name="options" /></span></span>
                </div>
              )}
              <div>{card.body}</div>
            </li>
          )))}
        </ul>
      </div>
      <p className="hero-phone__note" aria-hidden="true">choisis ta carte ↑</p>
    </div>
  );
}
