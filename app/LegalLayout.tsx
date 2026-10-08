
import { sitePath } from "./site";
import type { ReactNode } from "react";
import { legal } from "./legal";
import { AnalyticsSettingsButton } from "./AnalyticsConsent";

const legalLinks = [
  { href: "/contact", label: "Contact" },
  { href: "/conditions-liste-attente", label: "Conditions" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgu", label: "CGU app" },
  { href: "/confidentialite-app", label: "Données app" },
];

type LegalLayoutProps = {
  current: string;
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  children: ReactNode;
  /** The app's pages carry their own date: the version members accept in the app. */
  updated?: string;
};

export default function LegalLayout({ current, eyebrow, title, intro, children, updated }: LegalLayoutProps) {
  return (
    <main className="tool-page legal-page">
      <nav className="tool-nav" aria-label="Navigation Nearly">
        <a className="tool-nav__brand" href={sitePath("/")} aria-label="Nearly, accueil"><img src={sitePath("/media/nearly-app-icon-liquid-glass-v2.png")} alt="Nearly" /></a>
        <div>
          {legalLinks.map((link) => (
            <a key={link.href} href={sitePath(link.href)} aria-current={link.href === current ? "page" : undefined}>{link.label}</a>
          ))}
        </div>
        <a className="tool-nav__back" href={sitePath("/#liste-attente")}>Liste d’attente <span aria-hidden="true">↗</span></a>
      </nav>

      <header className="legal-hero">
        <p className="eyebrow"><span /> {eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        <small>Dernière mise à jour : {updated ?? legal.lastUpdated}</small>
      </header>

      <article className="legal-body">{children}</article>

      <footer className="legal-footer">
        <a href={sitePath("/")}>← Retour à Nearly</a>
        <AnalyticsSettingsButton />
        <span>Une question ? <a href={`mailto:${legal.contactEmail}`}><strong>{legal.contactEmail}</strong></a></span>
      </footer>
    </main>
  );
}
