"use client";

import { useEffect, useState } from "react";
import { appStoreUrl, playStoreUrl } from "./site";

// Same shape as the app's codes: six letters or digits, upper case.
function readCode() {
  const raw = new URLSearchParams(window.location.search).get("code") || "";
  const code = raw.replace(/[^0-9a-z]/gi, "").toUpperCase();
  return /^[A-Z0-9]{6}$/.test(code) ? code : null;
}

/**
 * The page a shared invite link lands on. It never opens the app by itself:
 * a custom scheme fired without a tap shows an error on a phone without
 * Nearly, so the visitor chooses. The app keeps the code through sign-up and
 * opens on its join screen with it filled in (`app/join.tsx` in the app).
 */
export default function JoinInvite() {
  // `undefined` until the address is read in the browser: the page is
  // exported statically and knows nothing of its query string at build time.
  const [code, setCode] = useState<string | null | undefined>(undefined);
  const [android, setAndroid] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCode(readCode());
    setAndroid(/android/i.test(navigator.userAgent));
  }, []);

  if (code === undefined) return <div className="join-card join-card--loading" aria-hidden="true" />;

  if (!code) {
    return (
      <div className="join-card">
        <h1>Ce lien d’invitation est incomplet.</h1>
        <p className="join-lead">Demandez à la personne qui vous invite de renvoyer son lien, ou saisissez son code dans Nearly avec « J’ai reçu un code ».</p>
      </div>
    );
  }

  // Android takes an intent URL, which reaches the app even from browsers that
  // ignore custom schemes; iOS takes the scheme itself.
  const appLink = android
    ? `intent://join?code=${code}#Intent;scheme=nearly;package=com.nearlyapp.nearlyapp;end`
    : `nearly://join?code=${code}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const stores = [
    appStoreUrl && !android ? { href: appStoreUrl, label: "Télécharger sur l’App Store" } : null,
    playStoreUrl ? { href: playStoreUrl, label: "Télécharger sur Google Play" } : null,
  ].filter((store): store is { href: string; label: string } => Boolean(store));

  return (
    <div className="join-card">
      <h1>On vous attend<br /><em>sur Nearly.</em></h1>
      <p className="join-lead">Quelqu’un vous invite dans son espace privé : messages, souvenirs, jeux et calendrier à partager.</p>

      <div className="join-code">
        <span className="join-code__label">Votre code d’invitation</span>
        <strong>{code}</strong>
        <button type="button" className="join-code__copy" onClick={copy}>{copied ? "Copié" : "Copier le code"}</button>
      </div>

      <a className="button join-open" href={appLink}>Ouvrir dans Nearly</a>
      <p className="join-note">Valable 48 h. Vous rejoindrez l’espace d’une seule touche, une fois connecté·e.</p>

      <div className="join-install">
        <h2>Pas encore l’application ?</h2>
        {stores.length > 0 ? (
          <>
            <div className="join-stores">
              {stores.map(store => <a key={store.href} className="join-store" href={store.href} rel="noopener noreferrer">{store.label}</a>)}
            </div>
            <p>Une fois Nearly installée, revenez sur ce lien et touchez « Ouvrir dans Nearly ».</p>
          </>
        ) : (
          <p>Nearly arrive très bientôt sur l’App Store et Google Play. Une fois l’application installée, touchez « J’ai reçu un code » et saisissez le code ci-dessus.</p>
        )}
      </div>
    </div>
  );
}
