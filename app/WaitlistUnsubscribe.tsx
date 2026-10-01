"use client";
import { waitlistEndpoint } from "./site";
import { legal } from "./legal";
import { useEffect, useState, type FormEvent } from "react";
import { clearReceipt, readReceipt, sendWaitlist, tokenFromFragment } from "./waitlist-client";
export default function WaitlistUnsubscribe() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fromLink = tokenFromFragment(window.location.hash);
    setToken(fromLink || readReceipt()?.token || "");
    if (fromLink) {
      // The fragment token is not sent to GitHub or in a referrer.
      history.replaceState(null, "", `${location.pathname}${location.search}#desinscription`);
      document.getElementById("desinscription")?.scrollIntoView();
    }
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending");
    try {
      await sendWaitlist(waitlistEndpoint, { action: "unsubscribe", managementToken: token });
      clearReceipt(); setToken(""); setStatus("done");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "La demande n’a pas abouti. Réessayez.");
    }
  }
  if (!waitlistEndpoint) return <p>La liste d’attente n’est pas ouverte. Aucune inscription n’est collectée sur cette version du site.</p>;
  if (status === "done") return <p className="legal-unsubscribe__done" role="status">✓ Votre demande est traitée. Toute inscription associée à ce lien a été supprimée.</p>;
  if (!token) return <p>Ouvrez votre lien personnel de désinscription, fourni lors de l’inscription ou dans nos e-mails. Si vous l’avez perdu, écrivez à <a href={`mailto:${legal.contactEmail}?subject=D%C3%A9sinscription%20Nearly`}>{legal.contactEmail}</a> depuis l’adresse inscrite.</p>;
  return <form className="legal-unsubscribe" onSubmit={submit}>
    <p>Confirmez la suppression de votre inscription et des réponses associées.</p>
    <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Suppression…" : "Me désinscrire"}</button>
    <p role="alert">{status === "error" ? message : ""}</p>
  </form>;
}
