import { sitePath } from "./site";

export default function SiteFooter() {
  return (
    <footer>
      <a className="footer-logo" href={sitePath("/")} aria-label="Nearly, accueil">
        <img src={sitePath("/media/nearly-app-icon-liquid-glass-v2.png")} alt="Nearly" />
      </a>
      <p>Proches, même à distance.</p>
      <div>
        <a href={sitePath("/outils/")}>Outils &amp; activités</a>
        <a href={sitePath("/#faq")}>FAQ</a>
        <a href={sitePath("/conditions-liste-attente")}>Conditions</a>
        <a href={sitePath("/confidentialite")}>Confidentialité</a>
        <a href={sitePath("/mentions-legales")}>Mentions légales</a>
        <span>© 2026 Nearly</span>
      </div>
    </footer>
  );
}
