import { sitePath } from "./site";

export default function SiteNav({ current = "application" }: { current?: "application" | "tools" }) {
  return (
    <nav className="site-nav site-nav--simple" aria-label="Navigation principale">
      <a className="brand" href={sitePath("/")} aria-label="Nearly, accueil">
        <img src={sitePath("/media/nearly-logo.png")} alt="Nearly" />
      </a>
      <div className="nav-links">
        <a href={sitePath("/")} aria-current={current === "application" ? "page" : undefined}>L’application</a>
        <a href={sitePath("/outils/")} aria-current={current === "tools" ? "page" : undefined}>Outils &amp; activités</a>
      </div>
      <a className="nav-cta" href={sitePath("/#liste-attente")}>S’inscrire <span aria-hidden="true">↗</span></a>
    </nav>
  );
}
