"use client";

import { useEffect, useState } from "react";

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
  const [status, setStatus] = useState<"loading" | "active" | "complete" | "error">("loading");

  async function drawQuestion() {
    setStatus("loading");
    try {
      const response = await fetch("/api/couple-questions", { method: "POST" });
      const payload = await response.json() as { questionIndex?: number; remaining?: number; error?: string };
      if (response.status === 429) {
        setStatus("complete");
        return;
      }
      if (!response.ok || typeof payload.questionIndex !== "number" || typeof payload.remaining !== "number") {
        throw new Error(payload.error || "Impossible de piocher une question.");
      }
      setIndex(payload.questionIndex % questions.length);
      setSeen(4 - payload.remaining);
      setStatus("active");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => { void drawQuestion(); }, []);
  const question = index === null ? null : questions[index];

  return (
    <div className="couple-deck" aria-live="polite">
      <div className="couple-deck__topline">
        <span>{status === "active" ? `Question ${seen} / 4` : "Essai de questions"}</span>
        <span>{question?.category || "Nearly"}</span>
      </div>
      {status === "complete" ? <p>Vous avez utilisé vos quatre questions. Retrouvez un nouveau rituel chaque jour dans Nearly.</p>
        : status === "error" ? <p>Le tirage est momentanément indisponible. Réessayez dans un instant.</p>
          : <p>{question ? `“${question.text}”` : "Votre première question arrive…"}</p>}
      {status === "active" && seen < 4 && <button type="button" onClick={() => void drawQuestion()}>Une autre question <span aria-hidden="true">→</span></button>}
      {status === "active" && seen === 4 && <a className="couple-deck__cta" href="/#telecharger">Découvrir Nearly <span aria-hidden="true">↗</span></a>}
      {status === "complete" && <a className="couple-deck__cta" href="/#telecharger">Découvrir Nearly <span aria-hidden="true">↗</span></a>}
      {status === "error" && <button type="button" onClick={() => void drawQuestion()}>Réessayer <span aria-hidden="true">→</span></button>}
    </div>
  );
}
