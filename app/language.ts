import { basePath, sitePath, absoluteUrl } from "./site";

export type Language = "fr" | "en";

export const publicPages = ["", "outils", "questions-couple", "tester-un-jeu", "calculateur-remboursement", "contact", "mentions-legales", "confidentialite", "conditions-liste-attente", "cgu", "confidentialite-app"] as const;

export function languagePath(path: string, language: Language) {
  // Media files stay shared; only pages receive a language prefix.
  if (path.startsWith("/media/") || /\.[a-z0-9]+(?:[?#]|$)/i.test(path)) return path;
  const neutral = path.replace(/^\/en(?=\/|#|$)/, "") || "/";
  return language === "en" ? `/en${neutral.startsWith("/") ? neutral : `/${neutral}`}` : neutral;
}

export function pageAlternates(path: string, language: Language = "fr") {
  return {
    canonical: absoluteUrl(languagePath(path, language)),
    languages: {
      fr: absoluteUrl(languagePath(path, "fr")),
      en: absoluteUrl(languagePath(path, "en")),
      "x-default": absoluteUrl(languagePath(path, "fr")),
    },
  };
}

export function switchLanguagePath(pathname: string, language: Language) {
  const path = basePath && pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
  return sitePath(languagePath(path, language));
}
