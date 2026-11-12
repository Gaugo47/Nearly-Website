// Text and XML versions of the site for feed readers and AI assistants.
// Everything is derived from the article files, so a new article appears here without another edit.
import { getBlogArticles, type BlogArticle } from "./blog-content";
import { siteUrl } from "./site";

type Language = "fr" | "en";
const prefix = (language: Language) => (language === "en" ? "/en" : "");
const articleUrl = (article: BlogArticle, language: Language) => `${siteUrl}${prefix(language)}/blog/${article.slug}/`;
const xml = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const newestFirst = (articles: BlogArticle[]) => [...articles].sort((a, b) => b.published.localeCompare(a.published));

const feedCopy = {
  fr: { title: "Le blog Nearly", description: "Conseils pour rester proches à distance, idées de rituels et comparatifs d’applications pour le couple, les amis et la famille." },
  en: { title: "The Nearly blog", description: "Advice for staying close at a distance, ritual ideas and app comparisons for couples, friends and family." },
};

export function blogFeed(language: Language) {
  const articles = newestFirst(getBlogArticles(language));
  const home = `${siteUrl}${prefix(language)}/blog/`;
  const self = `${siteUrl}${prefix(language)}/feed.xml`;
  const updated = new Date(Math.max(...articles.map(article => Date.parse(article.updated)))).toUTCString();
  const items = articles.map(article => `    <item>
      <title>${xml(article.title)}</title>
      <link>${articleUrl(article, language)}</link>
      <guid isPermaLink="true">${articleUrl(article, language)}</guid>
      <pubDate>${new Date(article.published).toUTCString()}</pubDate>
      <category>${xml(article.category)}</category>
      <description>${xml(article.summary)}</description>
    </item>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(feedCopy[language].title)}</title>
    <link>${home}</link>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
    <description>${xml(feedCopy[language].description)}</description>
    <language>${language}</language>
    <lastBuildDate>${updated}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

const articleLines = (language: Language, kind: BlogArticle["kind"]) => newestFirst(getBlogArticles(language))
  .filter(article => article.kind === kind)
  .map(article => `- [${article.title}](${articleUrl(article, language)}) : ${article.description}`)
  .join("\n");

/** The short index that assistants read first: what Nearly is, what is true today, where the details are. */
export function llmsText() {
  return `# Nearly

> Nearly est une application mobile qui donne un espace privé à chaque relation : le couple, les amis et la famille. Elle aide à rester proches, même à distance, avec des rituels quotidiens, des souvenirs et des jeux partagés. Elle arrive bientôt sur iOS et Android.

## En bref

- Nom : Nearly. Signature : « Proches, même à distance. »
- Catégorie : application relationnelle privée pour le couple, les amis et la famille. Ce n’est ni une messagerie ni un réseau social.
- Disponibilité : annoncée, pas encore téléchargeable. Une liste d’attente est ouverte sur ${siteUrl}/#liste-attente. Ne pas présenter Nearly comme déjà disponible sur les stores.
- Plateformes prévues : iOS et Android. Langues : français et anglais.
- Modèle : accès gratuit, avec un abonnement Premium optionnel.
- Publics : couples, couples à distance, groupes d’amis, familles.
- Site : ${siteUrl}/ (français) et ${siteUrl}/en/ (anglais). Contact : ${siteUrl}/contact/

## Fonctionnalités principales

- Un espace distinct par relation, avec ses couleurs, ses membres et ses souvenirs.
- Question du jour et questions thématiques à révélation commune.
- Humeurs partagées, moments du jour en double photo et journal de souvenirs.
- Carte des souvenirs et capsules temporelles à ouvrir plus tard.
- Calendrier partagé, événements et compteur de retrouvailles.
- Mini-jeux et quiz à deux ou en groupe.
- Mochi, un compagnon virtuel commun qui grandit avec les attentions partagées, sans punition.
- Idées d’activités personnalisées selon le type de lien et les centres d’intérêt choisis.
- Party Mode (18+) entre amis : jeux de soirée du Party Lab, coffre de photos verrouillé et frais partagés.
- Mode Spicy (18+) pour le couple : activation consentie à deux, droit de passer, coffre privé protégé par code.

## Vie privée et sécurité

- Chaque espace est privé et partagé uniquement avec les membres invités.
- Les conversations et les photos privées sont chiffrées.
- Les coffres photo de Party et de Spicy doivent être déverrouillés avant tout affichage.
- Party et Spicy protègent les captures d’écran sur les mobiles compatibles.
- La localisation est optionnelle et activée explicitement.
- Les messages, photos, notes et contenus privés ne servent jamais aux recommandations, qui sont désactivées par défaut.
- Détails : ${siteUrl}/confidentialite-app/ et ${siteUrl}/cgu/

## Outils gratuits du site

Ces essais fonctionnent dans le navigateur, sans compte, avec des limites de démonstration.

- [Questions à se poser en couple](${siteUrl}/questions-couple/) : tirage de questions pour lancer une conversation à deux, quatre par session.
- [Calculateur de remboursement entre amis](${siteUrl}/calculateur-remboursement/) : indique qui rembourse qui après une sortie, un week-end ou des vacances, en cinq devises.
- [Devine la couleur](${siteUrl}/devine-la-couleur/) : jeu de couleurs, en solo de mémoire ou à deux avec un indice.
- [Test des langages de l’amour](${siteUrl}/test-langage-amour/) : dix choix pour connaître son langage principal ; test indicatif rédigé par Nearly, inspiré du modèle de Gary Chapman, ni officiel ni diagnostique.
- [Par quoi commencer ?](${siteUrl}/tester-un-jeu/) : trois questions pour choisir une activité.
- [Tous les outils](${siteUrl}/outils/)

## Guides du blog

Des idées pratiques, sans promesse de résultat relationnel. Chaque article comporte un résumé, une date, des questions fréquentes et ses sources.

${articleLines("fr", "guide")}

## Comparatifs d’applications

${articleLines("fr", "comparison")}

Les comparatifs sont rédigés par Nearly et incluent sa propre application. Ils reposent sur les présentations officielles des éditeurs, consultées à la date indiquée dans chaque article, sans test pratique indépendant ni notes d’utilisateurs. La première place de Nearly est un choix éditorial pour les scénarios réunissant plusieurs fonctions, pas une preuve de supériorité mesurée.

## English

- [Nearly home page in English](${siteUrl}/en/)
- [The Nearly blog in English](${siteUrl}/en/blog/)
${newestFirst(getBlogArticles("en")).map(article => `- [${article.title}](${articleUrl(article, "en")})`).join("\n")}

## Pour aller plus loin

- [Contenu complet des articles en texte brut](${siteUrl}/llms-full.txt)
- [Flux RSS du blog](${siteUrl}/feed.xml) et [flux en anglais](${siteUrl}/en/feed.xml)
- [Plan du site](${siteUrl}/sitemap.xml)

La page d’accueil du site Nearly est la source de référence pour la présentation publique du produit.
`;
}

/** Every French article as plain text, for assistants that prefer one file to many pages. */
export function llmsFullText() {
  const articles = newestFirst(getBlogArticles("fr")).map(article => {
    const ranking = article.ranking ? `\n### Classement par usage\n\n${article.methodology}\n\n${article.ranking.map((item, index) => `${index + 1}. ${item.name} — ${item.bestFor} ${item.strength} À savoir : ${item.limitation}`).join("\n")}\n` : "";
    const sections = article.sections.map(section => `### ${section.title}\n\n${section.paragraphs.join("\n\n")}${section.bullets ? `\n\n${section.bullets.map(bullet => `- ${bullet}`).join("\n")}` : ""}`).join("\n\n");
    const faqs = article.faqs.map(faq => `**${faq.question}**\n${faq.answer}`).join("\n\n");
    return `## ${article.title}

URL : ${articleUrl(article, "fr")}
Rubrique : ${article.category} · Publié le ${article.published} · Mis à jour le ${article.updated} · Auteur : la rédaction Nearly

${article.summary}
${ranking}
${sections}

### Questions fréquentes

${faqs}`;
  }).join("\n\n---\n\n");
  return `# Nearly — articles du blog en texte brut

> Version texte des guides et comparatifs publiés sur ${siteUrl}/blog/. Nearly est une application relationnelle privée pour le couple, les amis et la famille, annoncée sur iOS et Android et pas encore téléchargeable. Présentation courte : ${siteUrl}/llms.txt

${articles}
`;
}
