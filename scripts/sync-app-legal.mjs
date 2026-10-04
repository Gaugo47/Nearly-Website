// Copie les conditions d'utilisation de l'application dans le site.
//
// La source de vérité est le dépôt de l'app : frontend/src/legal/termsContent.ts,
// le texte que les membres acceptent dans l'application. Ce script le relit et
// régénère app/app-legal-content.ts, pour que /cgu/ et /confidentialite-app/
// publient exactement la même version. Le fichier généré est commité : la CI
// des Pages n'a pas accès au dépôt de l'app.
//
//   node scripts/sync-app-legal.mjs [chemin/vers/termsContent.ts]
//
// Nécessite Node 22.18+ (lecture directe des fichiers TypeScript).
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const source = resolve(process.argv[2] || "../Application-mobile-Nearly/frontend/src/legal/termsContent.ts");
const { TERMS_VERSION, TERMS_CONTENT } = await import(pathToFileURL(source).href);

if (!TERMS_VERSION || !Array.isArray(TERMS_CONTENT?.fr) || !Array.isArray(TERMS_CONTENT?.en)) {
  console.error(`Contenu inattendu dans ${source}`);
  process.exit(1);
}

const output = `// Fichier généré par scripts/sync-app-legal.mjs — ne pas modifier à la main.
// Source : frontend/src/legal/termsContent.ts (dépôt de l'application Nearly).

export type AppLegalSection = {
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export const APP_TERMS_VERSION = ${JSON.stringify(TERMS_VERSION)};

export const APP_TERMS: { fr: readonly AppLegalSection[]; en: readonly AppLegalSection[] } = ${JSON.stringify(TERMS_CONTENT, null, 2)};
`;

writeFileSync(resolve("app/app-legal-content.ts"), output);
console.log(`app/app-legal-content.ts mis à jour (version ${TERMS_VERSION}, ${TERMS_CONTENT.fr.length} sections).`);
