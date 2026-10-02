"use client";

import Script from "next/script";
import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";
import { analyticsToken, basePath, sitePath, siteUrl } from "./site";
import { ANALYTICS_CHOICE_KEY, analyticsPageAllowed, readAnalyticsChoice } from "./analytics-settings.mjs";

type Choice = "accepted" | "refused" | null;
const choiceChanged = "nearly-analytics-choice-changed";
let memoryChoice: string | null = null;
const SettingsContext = createContext<(() => void) | null>(null);

function getChoice(): Choice {
  try { return readAnalyticsChoice(memoryChoice ?? window.localStorage.getItem(ANALYTICS_CHOICE_KEY)); }
  catch { return readAnalyticsChoice(memoryChoice); }
}

function subscribe(callback: () => void) {
  const syncStorage = () => {
    memoryChoice = null;
    if (document.getElementById("nearly-web-analytics") && getChoice() !== "accepted") window.location.reload();
    else callback();
  };
  window.addEventListener(choiceChanged, callback);
  window.addEventListener("storage", syncStorage);
  return () => {
    window.removeEventListener(choiceChanged, callback);
    window.removeEventListener("storage", syncStorage);
  };
}

function saveChoice(choice: Exclude<Choice, null>) {
  const value = JSON.stringify({ choice, savedAt: Date.now() });
  try { window.localStorage.setItem(ANALYTICS_CHOICE_KEY, value); memoryChoice = null; }
  catch { memoryChoice = value; /* Keep the choice for this page. */ }
  window.dispatchEvent(new Event(choiceChanged));
}

export function AnalyticsSettingsButton() {
  const open = useContext(SettingsContext);
  return open ? <button type="button" className="analytics-settings" onClick={open}>Choix des statistiques</button> : null;
}

export default function AnalyticsConsent({ children }: { children: ReactNode }) {
  const choice = useSyncExternalStore(subscribe, getChoice, () => null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const canMeasure = Boolean(analyticsToken && choice === "accepted" && typeof window !== "undefined"
    && analyticsPageAllowed(window.location.href, siteUrl, basePath));

  function choose(nextChoice: Exclude<Choice, null>) {
    saveChoice(nextChoice);
    setSettingsOpen(false);
    // Cloudflare has no stop API: reload stops the already-running beacon.
    // Refusal is saved first, so it cannot be loaded on the next page.
    if (nextChoice === "refused" && choice === "accepted") window.location.reload();
  }

  return (
    <SettingsContext.Provider value={analyticsToken ? () => setSettingsOpen(true) : null}>
      {children}
      {canMeasure && <Script
        id="nearly-web-analytics"
        type="module"
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon={JSON.stringify({ token: analyticsToken, spa: false })}
        strategy="afterInteractive"
      />}
      {analyticsToken && (choice === null || settingsOpen) && <aside className="analytics-consent" aria-labelledby="analytics-choice-title">
        <div>
          <h2 id="analytics-choice-title">Un peu de recul pour faire mieux.</h2>
          <p>Acceptez-vous les statistiques de visite Cloudflare, sans cookies publicitaires ? Elles nous aident à améliorer Nearly. Votre choix n’affecte pas l’inscription.</p>
          <a href={`${sitePath("/confidentialite")}#statistiques`}>En savoir plus</a>
        </div>
        <div className="analytics-consent__actions">
          <button type="button" onClick={() => choose("refused")}>Refuser</button>
          <button type="button" onClick={() => choose("accepted")}>Accepter</button>
          {settingsOpen && choice !== null && <button type="button" className="analytics-consent__close" onClick={() => setSettingsOpen(false)}>Conserver mon choix</button>}
        </div>
      </aside>}
    </SettingsContext.Provider>
  );
}
