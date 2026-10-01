"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { turnstileSiteKey } from "./site";
type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: TurnstileApi } }
export default function Turnstile({ onToken, attempt }: { onToken: (token: string) => void; attempt: number }) {
  const container = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!loaded || !container.current || !window.turnstile) return;
    const api = window.turnstile;
    const widget = api.render(container.current, {
      sitekey: turnstileSiteKey, action: "waitlist", language: "fr", theme: "light", size: "flexible",
      callback: (token: string) => { setFailed(false); onToken(token); },
      "expired-callback": () => onToken(""),
      "error-callback": () => { onToken(""); setFailed(true); },
    });
    return () => { api.remove(widget); onToken(""); };
  }, [loaded, attempt, onToken]);
  return <div className="waitlist-field">
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setLoaded(true)} onError={() => setFailed(true)} />
    <div ref={container} />
    {!loaded && !failed && <p role="status">Chargement de la vérification anti-robots…</p>}
    {failed && <p role="alert">La vérification anti-robots est indisponible. Rechargez la page pour réessayer.</p>}
  </div>;
}
