"use client";

import { useState } from "react";

type GameKey = "questions" | "duo" | "party";

type Answer = {
  label: string;
  detail: string;
  game: GameKey;
};

const questions: Array<{ kicker: string; title: string; answers: Answer[] }> = [
  {
    kicker: "Votre énergie",
    title: "Le meilleur moment à partager, c’est plutôt…",
    answers: [
      { label: "Une vraie discussion", detail: "On oublie l’heure en parlant", game: "questions" },
      { label: "Un duel complice", detail: "On adore se challenger", game: "duo" },
      { label: "Un fou rire collectif", detail: "Plus on est, mieux c’est", game: "party" },
    ],
  },
  {
    kicker: "Votre terrain de jeu",
    title: "La question qui vous donne le plus envie ?",
    answers: [
      { label: "Ce que tu n’as jamais osé me dire ?", detail: "Pour aller un peu plus loin", game: "questions" },
      { label: "Qui connaît le mieux l’autre ?", detail: "Pour régler ça une bonne fois", game: "duo" },
      { label: "Qui ferait ça en premier ?", detail: "Pour désigner les coupables", game: "party" },
    ],
  },
  {
    kicker: "Votre mood du soir",
    title: "Vous avez dix minutes. Vous choisissez…",
    answers: [
      { label: "Se redécouvrir", detail: "Une réponse qui rapproche", game: "questions" },
      { label: "Marquer des points", detail: "Avec un peu de mauvaise foi", game: "duo" },
      { label: "Mettre l’ambiance", detail: "Un défi que personne n’oublie", game: "party" },
    ],
  },
];

const games: Record<GameKey, { label: string; title: string; description: string; prompt: string; tag: string }> = {
  questions: {
    label: "Questions du jour",
    title: "Entre nous",
    description: "Des questions inattendues pour ouvrir les discussions qu’on repousse toujours et créer un vrai moment de proximité.",
    prompt: "Quel souvenir de nous te fait sourire instantanément ?",
    tag: "À deux · 5 min · Connexion",
  },
  duo: {
    label: "Quiz de complicité",
    title: "Duo décrypté",
    description: "Répondez chacun de votre côté, comparez vos réponses et découvrez qui connaît vraiment l’autre sur le bout des doigts.",
    prompt: "Mon plan parfait pour un dimanche pluvieux, c’est…",
    tag: "À deux · 10 min · Challenge",
  },
  party: {
    label: "Party Lab",
    title: "Qui de nous ?",
    description: "Des votes, des révélations et juste ce qu’il faut de chaos pour lancer une soirée et faire parler toute la bande.",
    prompt: "Qui pourrait disparaître 48 h pour partir sur un coup de tête ?",
    tag: "3+ joueurs · 15 min · Ambiance",
  },
};

function getWinner(answers: GameKey[]) {
  const counts: Record<GameKey, number> = { questions: 0, duo: 0, party: 0 };
  answers.forEach((answer) => counts[answer]++);
  return (Object.keys(counts) as GameKey[]).reduce((winner, key) =>
    counts[key] > counts[winner] ? key : winner,
  );
}

export default function GameMatch() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<GameKey[]>([]);
  const isResult = step === questions.length;
  const result = games[getWinner(answers)];

  function choose(game: GameKey) {
    setAnswers((current) => [...current.slice(0, step), game]);
    setStep((current) => current + 1);
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  function restart() {
    setAnswers([]);
    setStep(0);
  }

  return (
    <div className="game-match">
      <div className="game-match__topline">
        <span>{isResult ? "Votre recommandation" : `Question ${step + 1} sur ${questions.length}`}</span>
        <div className="game-match__progress" aria-label={`${Math.min(step + 1, questions.length)} étape sur ${questions.length}`}>
          {questions.map((_, index) => (
            <i key={index} className={index <= step ? "is-active" : ""} />
          ))}
        </div>
      </div>

      {!isResult ? (
        <div className="game-match__question" key={step}>
          <p className="game-match__kicker">{questions[step].kicker}</p>
          <h3>{questions[step].title}</h3>
          <div className="game-match__answers">
            {questions[step].answers.map((answer, index) => (
              <button type="button" onClick={() => choose(answer.game)} key={answer.label}>
                <span className="game-match__letter">{String.fromCharCode(65 + index)}</span>
                <span><strong>{answer.label}</strong><small>{answer.detail}</small></span>
                <span className="game-match__arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
          <div className="game-match__footer">
            <button className="game-match__back" type="button" onClick={goBack} disabled={step === 0}>← Retour</button>
            <span>Répondez instinctivement</span>
          </div>
        </div>
      ) : (
        <div className="game-result" aria-live="polite">
          <div className="game-result__copy">
            <p className="game-match__kicker">Votre jeu Nearly</p>
            <span className="game-result__label">{result.label}</span>
            <h3>{result.title}</h3>
            <p>{result.description}</p>
            <div className="game-result__actions">
              <a className="button button--primary" href="#telecharger">Télécharger Nearly <span aria-hidden="true">↗</span></a>
              <button type="button" onClick={restart}>Refaire le test</button>
            </div>
          </div>
          <div className="game-result__card">
            <span className="game-result__spark" aria-hidden="true">✦</span>
            <small>À tester ensemble</small>
            <p>“{result.prompt}”</p>
            <span>{result.tag}</span>
          </div>
        </div>
      )}
    </div>
  );
}
