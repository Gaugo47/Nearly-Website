"use client";

import { waitlistEndpoint } from "./site";
import { useState, type FormEvent } from "react";

export default function WaitlistUnsubscribe() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    setStatus("sending");
    try {
      const response = await fetch(waitlistEndpoint, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        credentials: "omit",
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({ email }),
      });
      const payload = await response.json() as { removed?: boolean; error?: string };
      if (!response.ok || !payload.removed) throw new Error(payload.error);
      setStatus("done");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error && error.message ? error.message : "La demande n’a pas abouti. Réessayez dans un instant.");
    }
  }

  if (!waitlistEndpoint) return <p>La liste d’attente n’est pas ouverte. Aucune inscription n’est collectée sur cette version du site.</p>;

  if (status === "done") {
    return <p className="legal-unsubscribe__done" role="status">✓ C’est fait. Si cette adresse figurait sur la liste d’attente, elle et les réponses associées ont été supprimées.</p>;
  }

  return (
    <form className="legal-unsubscribe" onSubmit={submit}>
      <label htmlFor="unsubscribe-email">Adresse e-mail inscrite</label>
      <div>
        <input id="unsubscribe-email" name="email" type="email" autoComplete="email" required placeholder="vous@exemple.fr" />
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Envoi…" : "Me désinscrire"}</button>
      </div>
      <p role="alert">{status === "error" ? message : ""}</p>
    </form>
  );
}
