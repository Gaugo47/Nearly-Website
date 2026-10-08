"use client";

import { usePathname } from "next/navigation";
import { switchLanguagePath, type Language } from "./language";

export default function LanguageSwitch({ language }: { language: Language }) {
  const pathname = usePathname() || "/";
  return (
    <div className="language-switch" role="group" aria-label={language === "fr" ? "Langue du site" : "Website language"}>
      {(["fr", "en"] as const).map(target => (
        <a
          key={target}
          href={switchLanguagePath(pathname, target)}
          hrefLang={target}
          lang={target}
          aria-label={target === "fr" ? "Français" : "English"}
          aria-current={language === target ? "true" : undefined}
          onClick={event => { event.currentTarget.href = `${switchLanguagePath(pathname, target)}${window.location.hash}`; }}
        >{target.toUpperCase()}</a>
      ))}
    </div>
  );
}
