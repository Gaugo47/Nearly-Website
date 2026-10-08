// Generate static English pages from the same JSX and interactive logic as French.
// Only text nodes/literals are translated; identifiers, user input and API payloads stay intact.
import ts from "typescript";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const root = resolve(".");
const outputRoot = "app/(en)";
const components = ["SiteNav", "SiteFooter", "LegalLayout", "RelationPreview", "WaitlistForm", "WaitlistUnsubscribe", "Turnstile", "AnalyticsConsent", "CoupleQuestions", "GameMatch", "ExpenseDemo", "AppLegalSections"];
const pages = ["", "outils", "questions-couple", "tester-un-jeu", "calculateur-remboursement", "contact", "mentions-legales", "confidentialite", "conditions-liste-attente", "cgu", "confidentialite-app"];
const targets = new Map([
  ["app/(fr)/layout.tsx", `${outputRoot}/layout.tsx`],
  ...pages.map(page => [`app/(fr)/${page ? `${page}/` : ""}page.tsx`, `${outputRoot}/en/${page ? `${page}/` : ""}page.tsx`]),
  ...components.map(name => [`app/${name}.tsx`, `${outputRoot}/en/_components/${name}.tsx`]),
  ...["legal", "waitlist-client"].map(name => [`app/${name}.ts`, `${outputRoot}/en/_components/${name}.ts`]),
]);
const imports = new Map([...targets].map(([source, destination]) => [resolve(source), resolve(destination)]));
imports.set(resolve("app/site.ts"), resolve(`${outputRoot}/en/_components/site.ts`));
imports.set(resolve("app/language.ts"), resolve(`${outputRoot}/en/_components/language.ts`));
const catalog = existsSync("translations/en.json") ? JSON.parse(readFileSync("translations/en.json", "utf8")) : {};
const normalize = value => value.replace(/\s+/g, " ").trim();
const isText = node => ts.isJsxText(node) || ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node);
const technical = new Set(["use client", "use server", "noopener noreferrer", "Nearly", "Party", "Spicy", "Party Lab", "Mochi", "FAQ", "Euro", "CHF", "n8n", "Frankfurter", "Gauthier DEFOY", "Contact", "Conversations", "Rectification", "Opposition", "Limitation", "Portabilité"]);
function needsTranslation(node, value) {
  if (!/[a-zA-ZÀ-ÿ]/.test(value) || technical.has(value)) return false;
  if (ts.isJsxText(node)) return true;
  if (value.startsWith("/") || value.startsWith("http") || value.includes("@") || /^\.?\.\//.test(value)) return false;
  if (ts.isJsxAttribute(node.parent) && !["alt", "title", "placeholder", "aria-label", "intro", "eyebrow", "updated"].includes(node.parent.name.getText())) return false;
  return /[àâäéèêëîïôöùûüçœ]/i.test(value) || /[a-zA-Z] [a-zA-Z]/.test(value) && !/^[\w-]+ [\w -]*--[\w -]*$/.test(value);
}
const missing = new Set();
const inventory = new Set();
const outputs = [];
for (const [source, destination] of targets) {
  const code = readFileSync(source, "utf8");
  const ast = ts.createSourceFile(source, code, ts.ScriptTarget.Latest, true);
  const replacements = [];
  function visit(node) {
    if (isText(node)) {
      const value = normalize(node.text);
      if (needsTranslation(node, value)) inventory.add(value);
      if (Object.hasOwn(catalog, value) && (value !== "en" || ts.isJsxText(node))) {
        const translated = catalog[value];
        if (typeof translated !== "string") throw new Error(`Invalid translation: ${value}`);
        const start = node.getStart(ast);
        const end = node.end;
        const spaces = text => `${/^\s/.test(node.text) ? " " : ""}${text}${/\s$/.test(node.text) ? " " : ""}`;
        let text;
        if (ts.isJsxText(node)) {
          // getFullStart includes leading whitespace, which can separate inline elements.
          text = spaces(translated.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
          replacements.push([node.getFullStart(), end, text]);
        } else if (ts.isStringLiteral(node)) {
          text = JSON.stringify(translated);
          replacements.push([start, end, text]);
        } else {
          const escaped = spaces(translated).replaceAll("\\", "\\\\").replaceAll("`", "\\`").replaceAll("${", "\\${");
          text = ts.isNoSubstitutionTemplateLiteral(node) ? `\`${escaped}\`` : ts.isTemplateHead(node) ? `\`${escaped}\${` : ts.isTemplateMiddle(node) ? `}${escaped}\${` : `}${escaped}\``;
          replacements.push([start, end, text]);
        }
      } else if (needsTranslation(node, value)) missing.add(value);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  let generated = code;
  for (const [start, end, replacement] of replacements.sort((a, b) => b[0] - a[0])) generated = generated.slice(0, start) + replacement + generated.slice(end);
  generated = generated.replace(/(from\s+|import\s+)("(?:\.\.?\/)[^"\n]+")/g, (full, prefix, quoted) => {
    const imported = resolve(dirname(source), JSON.parse(quoted));
    const original = [imported, `${imported}.tsx`, `${imported}.ts`, `${imported}.mjs`, `${imported}.css`].find(existsSync) || imported;
    const target = imports.get(original) || original;
    let path = relative(dirname(destination), target).replaceAll("\\", "/").replace(/\.(tsx|ts)$/, "");
    if (!path.startsWith(".")) path = `./${path}`;
    return `${prefix}${JSON.stringify(path)}`;
  });
  generated = generated.replaceAll('<LanguageSwitch language="fr"', '<LanguageSwitch language="en"')
    .replaceAll('<html lang="fr">', '<html lang="en">')
    .replaceAll('"fr-FR"', '"en-GB"').replaceAll('"fr_FR"', '"en_GB"')
    .replaceAll('language: "fr"', 'language: "en"');
  if (source === "app/AppLegalSections.tsx") generated = generated.replaceAll("APP_TERMS.fr", "APP_TERMS.en");
  if (source === "app/(fr)/layout.tsx") generated = generated.replace('url: `${siteUrl}/`,', 'url: `${siteUrl}/en/`,');
  outputs.push([destination, `// Generated by scripts/generate-english.mjs; edit the source or translations/en.json.\n${generated}`]);
}
if (process.argv.includes("--inventory")) {
  writeFileSync("work-translation-inventory.json", JSON.stringify([...inventory], null, 2) + "\n");
  console.log(`${inventory.size} translatable texts (${missing.size} missing).`);
  process.exit(0);
}
if (missing.size) throw new Error(`Missing English translations:\n${[...missing].map(text => JSON.stringify(text)).join("\n")}`);
outputs.push([`${outputRoot}/en/_components/site.ts`, `import { sitePath as originalPath, absoluteUrl as originalUrl } from "../../../site";
import { languagePath } from "../../../language";
export * from "../../../site";
export const sitePath = (path: string) => originalPath(languagePath(path, "en"));
export const absoluteUrl = (path: string) => originalUrl(languagePath(path, "en"));
`]);
outputs.push([`${outputRoot}/en/_components/language.ts`, `import { pageAlternates as originalAlternates } from "../../../language";
export const pageAlternates = (path: string) => originalAlternates(path, "en");
`]);
for (const [file, content] of outputs) {
  if (!resolve(file).startsWith(`${root}/`.replaceAll("/", process.platform === "win32" ? "\\" : "/"))) throw new Error("Output outside workspace");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}
console.log(`Generated ${pages.length} English pages and their shared components.`);
