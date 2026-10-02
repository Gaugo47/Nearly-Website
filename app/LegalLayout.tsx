
import { sitePath } from "./site";
import type { ReactNode } from "react";
import { legal } from "./legal";
import { AnalyticsSettingsButton } from "./AnalyticsConsent";

const legalLinks = [
  { href: "/conditions-liste-attente", label: "Conditions" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/mentions-legales", label: "Mentions légales" },
];

type LegalLayoutProps = {
  current: string;
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  children: ReactNode;
};

export default function LegalLayout({ current, eyebrow, title, intro, children }: LegalLayoutProps) {
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
        <small>Dernière mise à jour : {legal.lastUpdated}</small>
      </header>

      <article className="legal-body">{children}</article>

      <footer className="legal-footer">
        <a href={sitePath("/")}>← Retour à Nearly</a>
        <AnalyticsSettingsButton />
        <span>Une question sur vos données ? <strong>{legal.contactEmail}</strong></span>
      </footer>
    </main>
  );
}
