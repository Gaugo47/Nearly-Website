import { sitePath } from "./site";
import type { ReactNode } from "react";
import { legal } from "./legal";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

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
      {/* Same navigation and footer as the rest of the site: a reader of the terms can go back to the app, the tools or the blog. */}
      <SiteNav current="none" />

      <header className="legal-hero">
        <p className="eyebrow"><span /> {eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        <small>Dernière mise à jour : {updated ?? legal.lastUpdated}</small>
      </header>

      <nav className="legal-tabs" aria-label="Pages légales et assistance">
        {legalLinks.map((link) => (
          <a key={link.href} href={sitePath(link.href)} aria-current={link.href === current ? "page" : undefined}>{link.label}</a>
        ))}
      </nav>

      <article className="legal-body">{children}</article>

      <p className="legal-contact">Une question ? <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a></p>
      <SiteFooter />
    </main>
  );
}
