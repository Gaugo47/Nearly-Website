import { pageAlternates } from "../../language";
import type { Metadata } from "next";
import { sitePath } from "../../site";
import JoinInvite from "../../JoinInvite";

// A personal link, not a page to find: kept out of search and the sitemap.
export const metadata: Metadata = {
  title: "Rejoindre un espace",
  description: "Une invitation à rejoindre un espace privé sur Nearly.",
  alternates: pageAlternates("/rejoindre/"),
  robots: { index: false, follow: false },
};

export default function JoinPage() {
  return (
    <main className="join-page">
      <a className="join-brand" href={sitePath("/")} aria-label="Nearly, accueil">
        <img src={sitePath("/media/nearly-app-icon-liquid-glass-v2.png")} alt="Nearly" width={56} height={56} />
      </a>
      <JoinInvite />
    </main>
  );
}
