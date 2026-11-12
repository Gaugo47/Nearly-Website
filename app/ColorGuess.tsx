"use client";

import { useEffect, useState } from "react";
import { sitePath } from "./site";

type Color = { h: number; s: number; l: number };
// "memory": one player recreates a colour seen for a few seconds.
// "clue": one player picks a colour and gives a clue, the other guesses it.
type Mode = "memory" | "clue";
type Phase = "menu" | "pick" | "handover" | "memorize" | "guess" | "reveal" | "end";

const MEMORY_ROUNDS = 5;
const CLUE_ROUNDS = 4;
const MEMORIZE_MS = 3000;
const neutral: Color = { h: 180, s: 50, l: 50 };
const players = ["Joueur 1", "Joueur 2"];

const css = (color: Color) => `hsl(${color.h} ${color.s}% ${color.l}%)`;

function rgb({ h, s, l }: Color) {
  const saturation = s / 100, lightness = l / 100;
  const chroma = saturation * Math.min(lightness, 1 - lightness);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    return 255 * (lightness - chroma * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
  };
  return [channel(0), channel(8), channel(4)];
}

/** 100 for the same colour, 0 once the two are about as far apart as red and green. */
function closeness(target: Color, guess: Color) {
  const [a, b] = [rgb(target), rgb(guess)];
  const distance = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 441.673;
  return Math.max(0, Math.round((1 - distance * 2.2) * 100));
}

function randomColor(): Color {
  return { h: Math.floor(Math.random() * 360), s: 45 + Math.floor(Math.random() * 50), l: 35 + Math.floor(Math.random() * 35) };
}

function verdict(points: number) {
  if (points >= 90) return "Œil de lynx.";
  if (points >= 70) return "Très proche.";
  if (points >= 40) return "Dans la bonne famille.";
  return "Ça arrive aux meilleurs.";
}

function Sliders({ value, onChange }: { value: Color; onChange: (color: Color) => void }) {
  return (
    <div className="color-game__sliders">
      <label>
        <span>Teinte</span>
        <input className="color-game__hue" type="range" min={0} max={359} value={value.h} onChange={event => onChange({ ...value, h: Number(event.target.value) })} />
      </label>
      <label>
        <span>Saturation</span>
        <input type="range" min={0} max={100} value={value.s} style={{ background: `linear-gradient(90deg, ${css({ ...value, s: 0 })}, ${css({ ...value, s: 100 })})` }} onChange={event => onChange({ ...value, s: Number(event.target.value) })} />
      </label>
      <label>
        <span>Luminosité</span>
        <input type="range" min={10} max={90} value={value.l} style={{ background: `linear-gradient(90deg, ${css({ ...value, l: 10 })}, ${css({ ...value, l: 50 })}, ${css({ ...value, l: 90 })})` }} onChange={event => onChange({ ...value, l: Number(event.target.value) })} />
      </label>
    </div>
  );
}

export default function ColorGuess() {
  const [mode, setMode] = useState<Mode>("memory");
  const [phase, setPhase] = useState<Phase>("menu");
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState<Color>(neutral);
  const [guess, setGuess] = useState<Color>(neutral);
  const [clue, setClue] = useState("");
  const [scores, setScores] = useState([0, 0]);

  const rounds = mode === "memory" ? MEMORY_ROUNDS : CLUE_ROUNDS;
  // In a two-player game the roles swap every round.
  const chooser = round % 2;
  const guesser = mode === "clue" ? 1 - chooser : 0;
  const points = closeness(target, guess);

  useEffect(() => {
    if (phase !== "memorize") return;
    const timer = setTimeout(() => setPhase("guess"), MEMORIZE_MS);
    return () => clearTimeout(timer);
  }, [phase, round]);

  function startRound(nextMode: Mode, nextRound: number) {
    setRound(nextRound);
    setGuess(neutral);
    setClue("");
    if (nextMode === "memory") {
      setTarget(randomColor());
      setPhase("memorize");
    } else {
      setTarget(neutral);
      setPhase("pick");
    }
  }

  function start(nextMode: Mode) {
    setMode(nextMode);
    setScores([0, 0]);
    startRound(nextMode, 0);
  }

  function validate() {
    setScores(current => current.map((score, index) => index === guesser ? score + points : score));
    setPhase("reveal");
  }

  function next() {
    if (round + 1 >= rounds) setPhase("end");
    else startRound(mode, round + 1);
  }

  const winner = scores[0] === scores[1] ? null : scores[0] > scores[1] ? 0 : 1;

  return (
    <div className="color-game" aria-live="polite">
      <div className="color-game__topline">
        <span>{phase === "menu" || phase === "end" ? "Devine la couleur" : <>Manche {round + 1} / {rounds}</>}</span>
        <span>{phase === "menu" ? "Gratuit · sans compte" : mode === "memory" ? <>{scores[0]} points</> : <>{scores[0]} – {scores[1]}</>}</span>
      </div>

      {phase === "menu" && (
        <div className="color-game__menu">
          <h3>Choisissez votre partie.</h3>
          <div className="color-game__modes">
            <button type="button" onClick={() => start("memory")}>
              <strong>Solo</strong>
              <small>Mémorisez une couleur trois secondes, puis retrouvez-la. Cinq manches.</small>
            </button>
            <button type="button" onClick={() => start("clue")}>
              <strong>À deux</strong>
              <small>L’un choisit une couleur et donne un indice, l’autre devine. Quatre manches.</small>
            </button>
          </div>
        </div>
      )}

      {phase === "memorize" && (
        <div className="color-game__stage">
          <h3>Mémorisez cette couleur.</h3>
          <div className="color-game__swatch color-game__swatch--large" style={{ background: css(target) }}><i className="color-game__timer" /></div>
          <button className="color-game__action" type="button" onClick={() => setPhase("guess")}>Je l’ai <span aria-hidden="true">→</span></button>
        </div>
      )}

      {phase === "pick" && (
        <form className="color-game__stage" onSubmit={event => { event.preventDefault(); if (clue.trim()) setPhase("handover"); }}>
          <h3>{players[chooser]}, choisissez une couleur en secret.</h3>
          <div className="color-game__swatch" style={{ background: css(target) }} />
          <Sliders value={target} onChange={setTarget} />
          <label className="color-game__clue">
            <span>Votre indice</span>
            <input value={clue} onChange={event => setClue(event.target.value)} maxLength={40} placeholder="Ex. ton pull préféré" required />
          </label>
          <button className="color-game__action" type="submit">Cacher et passer le téléphone <span aria-hidden="true">→</span></button>
        </form>
      )}

      {phase === "handover" && (
        <div className="color-game__stage">
          <h3>Passez le téléphone à {players[guesser]}.</h3>
          <p>La couleur est cachée. Seul l’indice sera affiché.</p>
          <button className="color-game__action" type="button" onClick={() => setPhase("guess")}>C’est moi <span aria-hidden="true">→</span></button>
        </div>
      )}

      {phase === "guess" && (
        <div className="color-game__stage">
          {mode === "memory" ? <h3>Retrouvez la couleur.</h3> : <h3>{players[guesser]}, devinez la couleur.</h3>}
          {mode === "clue" && <p className="color-game__hint"><span>Indice</span>{clue}</p>}
          <div className="color-game__swatch" style={{ background: css(guess) }} />
          <Sliders value={guess} onChange={setGuess} />
          <button className="color-game__action" type="button" onClick={validate}>Valider <span aria-hidden="true">→</span></button>
        </div>
      )}

      {phase === "reveal" && (
        <div className="color-game__stage">
          <h3>{points} points. {verdict(points)}</h3>
          <div className="color-game__compare">
            <figure><div className="color-game__swatch" style={{ background: css(target) }} /><figcaption>La couleur</figcaption></figure>
            <figure><div className="color-game__swatch" style={{ background: css(guess) }} /><figcaption>La réponse</figcaption></figure>
          </div>
          <button className="color-game__action" type="button" onClick={next}>{round + 1 >= rounds ? "Voir le résultat" : "Manche suivante"} <span aria-hidden="true">→</span></button>
        </div>
      )}

      {phase === "end" && (
        <div className="color-game__stage">
          {mode === "memory"
            ? <><h3>{scores[0]} points sur {MEMORY_ROUNDS * 100}.</h3><p>{verdict(Math.round(scores[0] / MEMORY_ROUNDS))} Rejouez pour battre votre score, ou défiez quelqu’un à deux.</p></>
            : <><h3>{winner === null ? "Égalité parfaite." : <>{players[winner]} l’emporte.</>}</h3><p>{players[0]} : {scores[0]} points. {players[1]} : {scores[1]} points.</p></>}
          <div className="color-game__end">
            <button className="color-game__action" type="button" onClick={() => start(mode)}>Rejouer <span aria-hidden="true">→</span></button>
            <button className="color-game__link" type="button" onClick={() => setPhase("menu")}>Changer de mode</button>
            <a className="color-game__link" href={sitePath("/#liste-attente")}>Rejoindre la liste d’attente <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      )}
    </div>
  );
}
