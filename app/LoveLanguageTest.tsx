"use client";

import { useState } from "react";
import { sitePath } from "./site";

type Key = "words" | "time" | "gifts" | "service" | "touch";

const languages: Record<Key, { name: string; description: string; distance: string }> = {
  words: {
    name: "Les paroles valorisantes",
    description: "Vous vous sentez aimé·e quand on vous le dit : un compliment précis, un merci, un encouragement au bon moment.",
    distance: "À distance : un message vocal le matin, ou trois lignes sur ce que vous admirez chez l’autre.",
  },
  time: {
    name: "Les moments de qualité",
    description: "Ce qui compte pour vous, c’est une attention entière : du temps partagé sans écran ni interruption.",
    distance: "À distance : un rendez-vous fixe dans la semaine, avec une activité prévue et une heure de fin.",
  },
  gifts: {
    name: "Les cadeaux",
    description: "Un objet choisi vous dit « j’ai pensé à toi ». Sa valeur compte moins que l’attention qu’il porte.",
    distance: "À distance : une carte postale, un colis surprise ou une photo d’un objet qui vous a fait penser à l’autre.",
  },
  service: {
    name: "Les services rendus",
    description: "Pour vous, l’amour se prouve par des actes : on vous soulage d’une tâche, on anticipe un besoin.",
    distance: "À distance : réserver le billet, commander un repas pour l’autre, s’occuper d’une démarche à sa place.",
  },
  touch: {
    name: "Le toucher",
    description: "La proximité physique vous rassure : une main tenue, une étreinte, une présence tout près.",
    distance: "À distance : un vêtement à garder, et des retrouvailles dont la date est déjà fixée.",
  },
};

// Each pair of languages meets exactly once, so every language can score from 0 to 4.
const pairs: [{ key: Key; text: string }, { key: Key; text: string }][] = [
  [{ key: "words", text: "On me dit précisément ce qu’on apprécie chez moi." }, { key: "time", text: "On passe une soirée ensemble, téléphones rangés." }],
  [{ key: "gifts", text: "On me rapporte un petit quelque chose qui a fait penser à moi." }, { key: "words", text: "Je reçois un message d’encouragement avant une journée difficile." }],
  [{ key: "service", text: "On s’occupe d’une corvée que je redoutais." }, { key: "touch", text: "On me prend dans les bras en arrivant." }],
  [{ key: "time", text: "On m’écoute jusqu’au bout, sans regarder l’heure." }, { key: "gifts", text: "Je reçois une surprise sans occasion particulière." }],
  [{ key: "words", text: "On me dit que l’on est fier de moi." }, { key: "service", text: "On me prépare un repas après une longue journée." }],
  [{ key: "touch", text: "On me tient la main en marchant." }, { key: "time", text: "On prévoit une sortie rien que pour nous." }],
  [{ key: "gifts", text: "On se souvient d’un objet dont j’avais parlé, et on me l’offre." }, { key: "service", text: "On règle un problème pratique à ma place." }],
  [{ key: "touch", text: "On s’installe tout près de moi sur le canapé." }, { key: "words", text: "On me remercie à voix haute pour ce que j’ai fait." }],
  [{ key: "time", text: "On s’appelle longuement, juste pour parler." }, { key: "service", text: "On m’aide sans que j’aie besoin de demander." }],
  [{ key: "gifts", text: "Je reçois une carte ou un colis par la poste." }, { key: "touch", text: "On me fait un câlin quand ça ne va pas." }],
];
const keys = Object.keys(languages) as Key[];

export default function LoveLanguageTest() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Key[]>([]);
  const done = step === pairs.length;
  const scores = keys.map(key => ({ key, score: answers.filter(answer => answer === key).length })).sort((a, b) => b.score - a.score);
  // A tie is a result, not a problem: many people have two main languages.
  const top = scores.filter(item => item.score === scores[0].score);

  function choose(key: Key) {
    setAnswers(current => [...current.slice(0, step), key]);
    setStep(current => current + 1);
  }

  return (
    <div className="game-match love-test">
      <div className="game-match__topline">
        <span>{done ? "Votre résultat" : <>Question {step + 1} sur {pairs.length}</>}</span>
        <div className="game-match__progress love-test__progress" aria-hidden="true">
          {pairs.map((_, index) => <i key={index} className={index <= step ? "is-active" : ""} />)}
        </div>
      </div>

      {!done ? (
        <div className="game-match__question" key={step}>
          <p className="game-match__kicker">Ce qui me touche le plus</p>
          <div className="game-match__answers">
            {pairs[step].map((option, index) => (
              <button type="button" onClick={() => choose(option.key)} key={option.text}>
                <span className="game-match__letter">{String.fromCharCode(65 + index)}</span>
                <span><strong>{option.text}</strong></span>
                <span className="game-match__arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
          <div className="game-match__footer">
            <button className="game-match__back" type="button" onClick={() => setStep(current => Math.max(0, current - 1))} disabled={step === 0}>← Retour</button>
            <span>Choisissez sans trop réfléchir</span>
          </div>
        </div>
      ) : (
        <div className="love-test__result" aria-live="polite">
          <p className="game-match__kicker">{top.length > 1 ? "Vos langages principaux" : "Votre langage principal"}</p>
          {top.map(item => (
            <div className="love-test__language" key={item.key}>
              <h3>{languages[item.key].name}</h3>
              <p>{languages[item.key].description}</p>
              <p className="love-test__distance">{languages[item.key].distance}</p>
            </div>
          ))}
          <ul className="love-test__scores" aria-label="Votre répartition">
            {scores.map(item => (
              <li key={item.key}>
                <span>{languages[item.key].name}</span>
                <i aria-hidden="true"><b style={{ width: `${item.score * 25}%` }} /></i>
                <strong>{item.score} / 4</strong>
              </li>
            ))}
          </ul>
          <p className="love-test__next">Faites passer le test à votre moitié, puis comparez : on donne souvent dans son propre langage, pas dans celui de l’autre.</p>
          <div className="game-result__actions">
            <a className="button button--primary" href={sitePath("/#liste-attente")}>Rejoindre la liste d’attente <span aria-hidden="true">↗</span></a>
            <button type="button" onClick={() => { setAnswers([]); setStep(0); }}>Refaire le test</button>
          </div>
        </div>
      )}
    </div>
  );
}
