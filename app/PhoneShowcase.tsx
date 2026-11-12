"use client";

import { useEffect, useState, type CSSProperties } from "react";
import IPhoneMockup from "./IPhoneMockup";
import { sitePath } from "./site";

const icons = {
  work: <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 12.5h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  home: <path d="M4 11.5 12 5l8 6.5M6.5 10v9.5h11V10M10 19.5v-5h4v5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />,
  coins: <><ellipse cx="9" cy="7" rx="5" ry="2.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 7v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7M10 16.4c.9.4 2.2.6 3.5.6 2.8 0 5-1.1 5-2.5v-4c0-1.2-1.6-2.2-3.8-2.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  check: <><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m8.2 12.3 2.6 2.6 5-5.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>,
  unlock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 6.8-1.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" fill="none" stroke="currentColor" strokeWidth="2" /></>,
};
type Icon = keyof typeof icons;
const Svg = ({ name }: { name: Icon }) => <svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>;

/** One moment of the card: what it says, and the state of its visual at that moment. */
type Step = { title: string; detail: string; progress?: number; marks?: string[]; locked?: boolean };
/**
 * What the screen does not show: what happens next, live. The visual is a route filling up between two
 * icons, people with their state (a tick, points, an emoji), or photos that stay blurred until unlocked.
 */
export type FloatCard = { label: string; lead: string; round?: boolean; route?: [Icon, Icon]; people?: string[]; photos?: string[]; steps: Step[] };
export type ShowcaseScreen = { src: string; alt: string; label: string; card?: FloatCard };

function Card({ card, step, shown, quiet }: { card: FloatCard; step: number; shown: boolean; quiet: boolean }) {
  const now = card.steps[step] ?? card.steps[0];
  return (
    <div className={`showcase__card${shown ? " is-shown" : ""}`} aria-hidden={!shown} aria-live={shown && !quiet ? "polite" : "off"} style={{ "--progress": now.progress ?? 0 } as CSSProperties}>
      <img className={card.round ? "is-round" : undefined} src={sitePath(card.lead)} alt="" width={96} height={96} />
      <div className="showcase__card-text">
        <small><i />{card.label}</small>
        {card.steps.map((item, index) => (
          <p key={item.title} className={index === step ? "is-current" : undefined} aria-hidden={index !== step}><b>{item.title}</b>{item.detail}</p>
        ))}
      </div>
      {card.route && (
        <div className="showcase__route">
          <Svg name={card.route[0]} />
          <span><i /></span>
          <Svg name={card.route[1]} />
        </div>
      )}
      {card.people && (
        <div className="showcase__people">
          {card.people.map((person, index) => (
            <span key={person}>
              <img src={sitePath(person)} alt="" width={96} height={96} />
              {now.marks?.[index] && <b key={now.marks[index]}>{now.marks[index]}</b>}
            </span>
          ))}
        </div>
      )}
      {card.photos && (
        <div className={`showcase__photos${now.locked ? " is-locked" : ""}`}>
          {card.photos.map(photo => <img key={photo} src={sitePath(photo)} alt="" width={120} height={120} />)}
          <Svg name={now.locked ? "lock" : "unlock"} />
        </div>
      )}
    </div>
  );
}

// A 3D carousel of phones: the chosen screen in front, the others turned away behind it. Only
// transforms and opacity move, so the browser sorts the depth and keeps it smooth. Above the phone,
// a card plays what the screen cannot show. It turns on its own until the visitor picks a screen.
export default function PhoneShowcase({ screens, label }: { screens: ShowcaseScreen[]; label: string }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const steps = screens[active]?.card?.steps.length ?? 0;
  const playing = auto && !hovered && !focused && !reducedMotion && visible;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || screens.length < 2) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % screens.length), 5200);
    return () => window.clearInterval(timer);
  }, [playing, screens.length]);

  // The card starts over each time its screen comes to the front.
  useEffect(() => {
    setStep(0);
  }, [active]);

  useEffect(() => {
    if (!playing || step >= steps - 1) return;
    const timer = window.setTimeout(() => setStep(value => Math.min(value + 1, steps - 1)), 2400);
    return () => window.clearTimeout(timer);
  }, [active, playing, step, steps]);

  const choose = (index: number) => { setActive(index); setAuto(false); };
  const slot = (index: number) => {
    const place = (index - active + screens.length) % screens.length;
    return place === 0 ? "front" : place === 1 && screens.length > 2 ? "right" : "left";
  };

  if (!screens.length) return null;

  return (
    <div
      className="showcase"
      data-paused={!playing}
      onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    >
      <div className="showcase__stage" role="group" aria-label={label}>
        {screens.map((screen, index) => (
          <div key={screen.src} className={`showcase__phone showcase__phone--${slot(index)}`} aria-hidden={index !== active} onClick={() => choose(index)}>
            <IPhoneMockup src={screen.src} alt={screen.alt} />
          </div>
        ))}
        {/* Every card stays mounted, so the one leaving fades out while the next one comes in. */}
        {screens.map((screen, index) => screen.card && screen.card.steps.length > 0 && (
          <Card key={screen.src} card={screen.card} step={index === active ? step : 0} shown={index === active} quiet={auto} />
        ))}
      </div>
      <div className="showcase__tabs" role="group" aria-label={label}>
        {screens.map((screen, index) => (
          <button key={screen.src} type="button" aria-pressed={index === active} onClick={() => choose(index)}>{screen.label}</button>
        ))}
      </div>
      {screens.length > 1 && (
        <div className="showcase__playback">
          {reducedMotion ? <span>Défilement manuel</span> : (
            <button type="button" className="showcase__pause" onClick={() => setAuto(value => !value)}>
              <span aria-hidden="true">{auto ? "Ⅱ" : "▷"}</span>
              {auto ? "Mettre en pause" : "Reprendre le défilement"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
