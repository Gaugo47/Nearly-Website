import { sitePath } from "./site";
import LanguageSwitch from "./LanguageSwitch";

export default function SiteNav({ current = "application" }: { current?: "application" | "tools" | "blog" | "none" }) {
  return (
    <nav className="site-nav site-nav--simple" aria-label="Navigation principale">
      <a className="brand brand--app" href={sitePath("/")} aria-label="Nearly, accueil">
        <img src={sitePath("/media/store/nearly-icon-96.webp")} alt="Nearly" width={48} height={48} />
      </a>
      <div className="nav-links">
        <a href={sitePath("/")} aria-current={current === "application" ? "page" : undefined}>L’application</a>
        <a href={sitePath("/outils/")} aria-current={current === "tools" ? "page" : undefined}>Outils &amp; activités</a>
        <a href={sitePath("/blog/")} aria-current={current === "blog" ? "page" : undefined}>Blog</a>
      </div>
      <div className="nav-actions"><LanguageSwitch language="fr" /><a className="nav-cta" href={sitePath("/#liste-attente")}>S’inscrire <span aria-hidden="true">↗</span></a></div>
    </nav>
  );
}
