"use client";

import { useState } from "react";

const questions = [
  { category: "Se redécouvrir", text: "Quel petit détail chez moi te fait toujours sourire ?" },
  { category: "Se redécouvrir", text: "Quel souvenir de nous aimerais-tu revivre exactement pareil ?" },
  { category: "Rêver ensemble", text: "Si nous avions un week-end sans contraintes, où irions-nous ?" },
  { category: "Rêver ensemble", text: "Quelle habitude aimerais-tu que nous inventions à deux ?" },
  { category: "Aller plus loin", text: "À quel moment te sens-tu le plus soutenu·e par moi ?" },
  { category: "Aller plus loin", text: "Qu’aimerais-tu que je comprenne mieux de ta journée ?" },
  { category: "Juste pour rire", text: "Quel serait notre nom de duo si nous participions à un jeu télé ?" },
  { category: "Juste pour rire", text: "Quelle règle absurde devrions-nous instaurer à la maison ?" },
  { category: "À distance", text: "Quelle attention à distance te donne vraiment l’impression que je suis près de toi ?" },
  { category: "À distance", text: "Quel rendez-vous aimerais-tu que l’on protège chaque semaine ?" },
];

export default function CoupleQuestions() {
  const [index, setIndex] = useState(0);
  const question = questions[index];

  return (
    <div className="couple-deck" aria-live="polite">
      <div className="couple-deck__topline">
        <span>Question {index + 1} / {questions.length}</span>
        <span>{question.category}</span>
      </div>
      <p>“{question.text}”</p>
      <button type="button" onClick={() => setIndex((current) => (current + 1) % questions.length)}>
        Une autre question <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
