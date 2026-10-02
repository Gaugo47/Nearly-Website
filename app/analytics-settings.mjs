// Only an audience-measurement choice is stored, never a visitor identifier.
export const ANALYTICS_CHOICE_KEY = "nearly-analytics-choice-v1";
export const ANALYTICS_CHOICE_LIFETIME = 180 * 24 * 60 * 60 * 1000;

export function readAnalyticsChoice(raw, now = Date.now()) {
  try {
    const value = JSON.parse(raw || "null");
    if (!value || !["accepted", "refused"].includes(value.choice)) return null;
    if (!Number.isFinite(value.savedAt) || value.savedAt > now || now - value.savedAt >= ANALYTICS_CHOICE_LIFETIME) return null;
    return value.choice;
  } catch { return null; }
}

export function analyticsPageAllowed(href, publicSiteUrl, basePath = "") {
  try {
    const url = new URL(href);
    const site = new URL(publicSiteUrl);
    const pages = ["/", "/outils/", "/tester-un-jeu/", "/calculateur-remboursement/", "/questions-couple/"];
    // Exclude legal/unsubscribe pages and URLs with potentially private parameters.
    return url.origin === site.origin && url.protocol === "https:" && !url.search && !url.hash.includes("=")
      && pages.some((page) => url.pathname === `${basePath}${page}`);
  } catch { return false; }
}
