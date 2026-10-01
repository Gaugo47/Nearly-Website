"use client";

import { sitePath, waitlistReady, waitlistEndpoint } from "./site";

import { useRef, useState, type FormEvent } from "react";
import { waitlistReasons, WAITLIST_EXPECTATIONS_MAX } from "./legal";
import Turnstile from "./Turnstile";
import { newManagementToken, readReceipt, saveReceipt, sendWaitlist } from "./waitlist-client";

type Status = "idle" | "sending" | "joined" | "error";
type Field = "email" | "reason" | "expectations" | "consentLaunch";

export default function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [invalidField, setInvalidField] = useState<Field | null>(null);
  const [expectations, setExpectations] = useState("");
  const startedAt = useRef(0);
  const [challengeToken, setChallengeToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [managementToken, setManagementToken] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    setMessage("");
    setInvalidField(null);

    try {
      const email = String(data.get("email") || "").trim().toLowerCase();
      const receipt = readReceipt();
      const token = receipt?.email === email ? receipt.token : newManagementToken();
      await sendWaitlist(waitlistEndpoint, {
          action: "subscribe", email, managementToken: token, challengeToken,
          reason: data.get("reason"),
          expectations,
          consentLaunch: data.get("consentLaunch") === "on",
          consentFeedback: data.get("consentFeedback") === "on",
          website: data.get("website"),
          startedAt: startedAt.current,
      });
      saveReceipt({ email, token, createdAt: Date.now() });
      setManagementToken(token);
      setStatus("joined");
    } catch (error) {
      setChallengeToken("");
      setAttempt((value) => value + 1);
      setStatus("error");
      setMessage(error instanceof Error && error.message ? error.message : "L’inscription n’a pas abouti. Réessayez dans un instant.");
    }
  }

  if (!waitlistReady) {
    return <div className="waitlist-card" role="status"><h3>Nearly arrive bientôt.</h3><p>Les inscriptions ouvriront prochainement. Aucune adresse e-mail n’est collectée pour le moment.</p></div>;
  }

  if (status === "joined") {
    return (
      <div className="waitlist-card waitlist-card--done" role="status">
        <span className="waitlist-done-mark" aria-hidden="true">✓</span>
        <h3>Vous êtes sur la liste.</h3>
        <p>Merci ! Nous vous écrirons dès que Nearly ouvre ses portes.</p>
        <p>Conservez votre <a href={`${sitePath("/confidentialite")}#token=${managementToken}`}>lien personnel de désinscription</a>. Si votre adresse était déjà inscrite, vos réponses et votre lien initial sont conservés.</p>
      </div>
    );
  }

  return (
    <form className="waitlist-card" onSubmit={submit} onFocusCapture={() => { startedAt.current ||= Date.now(); }}>
      <div className="waitlist-field">
        <label htmlFor="waitlist-email">Votre e-mail</label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={254}
          placeholder="vous@exemple.fr"
          required
          aria-invalid={invalidField === "email" || undefined}
        />
      </div>

      <fieldset className="waitlist-field" aria-invalid={invalidField === "reason" || undefined}>
        <legend>Pourquoi Nearly vous intéresse ?</legend>
        <div className="waitlist-reasons">
          {waitlistReasons.map((reason) => (
            <label key={reason.value}>
              <input type="radio" name="reason" value={reason.value} required />
              <span>{reason.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="waitlist-field">
        <label htmlFor="waitlist-expectations">Vos attentes <small>facultatif</small></label>
        <textarea
          id="waitlist-expectations"
          name="expectations"
          rows={3}
          maxLength={WAITLIST_EXPECTATIONS_MAX}
          value={expectations}
          onChange={(event) => setExpectations(event.target.value)}
          placeholder="Ce que vous aimeriez retrouver dans Nearly, ce qui vous manque aujourd’hui…"
          aria-describedby="waitlist-expectations-hint"
          aria-invalid={invalidField === "expectations" || undefined}
        />
        <p className="waitlist-hint" id="waitlist-expectations-hint">
          <span>N’indiquez aucune information sensible (santé, vie intime, opinions…).</span>
          <span>{expectations.length}/{WAITLIST_EXPECTATIONS_MAX}</span>
        </p>
      </div>

      <div className="waitlist-honeypot" aria-hidden="true">
        <label htmlFor="waitlist-website">Site web</label>
        <input id="waitlist-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="waitlist-consent">
        <input type="checkbox" name="consentLaunch" required aria-invalid={invalidField === "consentLaunch" || undefined} />
        <span>
          J’accepte que Nearly utilise mon e-mail et mes réponses pour me prévenir du lancement et m’envoyer des nouvelles de la liste d’attente.
          J’ai lu les <a href={sitePath("/conditions-liste-attente")}>conditions</a> et la <a href={sitePath("/confidentialite")}>politique de confidentialité</a>.
        </span>
      </label>
      <label className="waitlist-consent">
        <input type="checkbox" name="consentFeedback" />
        <span>Facultatif : j’accepte d’être recontacté·e pour tester la bêta ou donner mon avis.</span>
      </label>

      <Turnstile onToken={setChallengeToken} attempt={attempt} />
      <button className="button button--primary waitlist-submit" type="submit" disabled={status === "sending" || !challengeToken}>
        {status === "sending" ? "Inscription…" : <>Rejoindre la liste d’attente <span aria-hidden="true">↗</span></>}
      </button>

      <p className="waitlist-message" role="alert">{status === "error" ? message : ""}</p>
      <p className="waitlist-legal">
        Gratuit et sans engagement. Désinscription en un clic à tout moment. Vos données ne sont jamais vendues.
      </p>
    </form>
  );
}
