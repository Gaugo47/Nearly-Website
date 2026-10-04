import { APP_TERMS, APP_TERMS_VERSION, type AppLegalSection } from "./app-legal-content";

/** "2026-10-04" → "4 octobre 2026", the way the other legal pages date themselves. */
export function appTermsDate(): string {
  return new Date(`${APP_TERMS_VERSION}T12:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
}

/**
 * The French sections whose title starts with one of these numbers, in order.
 * Fails the build rather than publish a policy with a section missing, should
 * the app's text ever be renumbered.
 */
export function appSections(numbers?: readonly number[]): readonly AppLegalSection[] {
  if (!numbers) return APP_TERMS.fr;
  return numbers.map((number) => {
    const section = APP_TERMS.fr.find((item) => item.title.startsWith(`${number}. `));
    if (!section) throw new Error(`Section ${number} introuvable dans les conditions de l’application`);
    return section;
  });
}

export default function AppLegalSections({ sections }: { sections: readonly AppLegalSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.bullets && (
            <ul>
              {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          )}
        </section>
      ))}
    </>
  );
}
