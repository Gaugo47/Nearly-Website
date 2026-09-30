"use client";

import { sitePath } from "./site";

import { useEffect, useRef, useState } from "react";

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
  const [index, setIndex] = useState<number | null>(null);
  const [seen, setSeen] = useState(0);
  const [status, setStatus] = useState<"loading" | "active" | "complete">("loading");

  const drawn = useRef<number[]>([]);
  const initialized = useRef(false);

  function drawQuestion() {
    const available = questions.map((_, i) => i).filter((i) => !drawn.current.includes(i));
    if (drawn.current.length >= 4) { setStatus("complete"); return; }
    const next = available[Math.floor(Math.random() * available.length)];
    drawn.current = [...drawn.current, next];
    try { sessionStorage.setItem("nearly-questions-session-v2", JSON.stringify(drawn.current)); } catch { /* Continue in memory. */ }
    setIndex(next);
    setSeen(drawn.current.length);
    setStatus("active");
  }

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const saved: unknown = JSON.parse(sessionStorage.getItem("nearly-questions-session-v2") || "[]");
      if (Array.isArray(saved) && saved.length <= 4 && saved.every((i) => Number.isInteger(i) && i >= 0 && i < questions.length) && new Set(saved).size === saved.length) drawn.current = saved;
    } catch { /* Continue in memory. */ }
    if (drawn.current.length) {
      setIndex(drawn.current.at(-1)!);
      setSeen(drawn.current.length);
      setStatus("active");
    } else drawQuestion();
  }, []);
  const question = index === null ? null : questions[index];

  return (
    <div className="couple-deck" aria-live="polite">
      <div className="couple-deck__topline">
        <span>{status === "active" ? `Question ${seen} / 4` : "Essai de questions"}</span>
        <span>{question?.category || "Nearly"}</span>
      </div>
      {status === "complete" ? <p>Vous avez utilisé vos quatre questions. Retrouvez un nouveau rituel chaque jour dans Nearly.</p>
        : <p>{question ? `“${question.text}”` : "Votre première question arrive…"}</p>}
      {status === "active" && seen < 4 && <button type="button" onClick={() => void drawQuestion()}>Une autre question <span aria-hidden="true">→</span></button>}
      {status === "active" && seen === 4 && <a className="couple-deck__cta" href={sitePath("/#telecharger")}>Découvrir Nearly <span aria-hidden="true">↗</span></a>}
      {status === "complete" && <a className="couple-deck__cta" href={sitePath("/#telecharger")}>Découvrir Nearly <span aria-hidden="true">↗</span></a>}
    </div>
  );
}
