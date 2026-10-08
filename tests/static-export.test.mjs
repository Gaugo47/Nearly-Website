import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import test from "node:test";
const root = resolve("out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://gaugo47.github.io/Nearly-Website").replace(/\/$/, "");
const frenchPages = ["", "calculateur-remboursement", "questions-couple", "outils", "tester-un-jeu", "contact", "confidentialite", "conditions-liste-attente", "mentions-legales", "cgu", "confidentialite-app"];
const pages = [...frenchPages, ...frenchPages.map(page => `en${page ? `/${page}` : ""}`)];
test("exports all pages and usable local links/assets under the configured base path", async () => {
  for (const page of pages) {
    const html = await readFile(join(root, page, "index.html"), "utf8");
    assert.ok(html.includes(`<html lang="${page === "en" || page.startsWith("en/") ? "en" : "fr"}"`));
    assert.doesNotMatch(html, /chatgpt\.site|oai-authenticated|\/api\/expense-trial|\/api\/couple-questions/);
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
      if (!raw.startsWith("/") || raw.startsWith("//")) continue;
      const url = new URL(raw, "https://example.test");
      assert.ok(url.pathname.startsWith(`${base}/`), `${page}: ${raw} must use basePath ${base}`);
      let file = join(root, decodeURIComponent(url.pathname.slice(base.length)));
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      await stat(file);
      if (url.hash && file.endsWith(".html")) {
        const target = await readFile(file, "utf8");
        assert.ok(target.includes(`id="${url.hash.slice(1)}"`), `Missing anchor: ${raw}`);
      }
    }
  }
});
test("both languages expose matching pages, canonical URLs and alternate language links", async () => {
  for (const page of frenchPages) {
    const path = page ? `/${page}/` : "/";
    for (const language of ["fr", "en"]) {
      const local = language === "en" ? `en/${page}` : page;
      const html = await readFile(join(root, local, "index.html"), "utf8");
      const canonical = `${origin}${language === "en" ? "/en" : ""}${path}`;
      assert.ok(html.includes(`rel="canonical" href="${canonical}"`), `${local}: canonical`);
      for (const [lang, prefix] of [["fr", ""], ["en", "/en"], ["x-default", ""]]) {
        assert.ok(html.includes(`hrefLang="${lang}" href="${origin}${prefix}${path}"`), `${local}: alternate ${lang}`);
      }
      assert.ok(html.includes('aria-label="English"') && html.includes('aria-label="Français"'));
    }
  }
  const contact = await readFile(join(root, "en/contact/index.html"), "utf8");
  assert.match(contact, /Contact Nearly support/);
  assert.match(contact, /href="mailto:support@hellonearly.com"/);
  const terms = await readFile(join(root, "en/cgu/index.html"), "utf8");
  assert.match(terms, /Publisher and contact/);
  assert.doesNotMatch(terms, /Éditeur et contact/);
});
test("exports public SEO and GitHub Pages assets", async () => {
  const html = await readFile(join(root, "index.html"), "utf8");
  assert.match(html, /Tous ceux qui comptent/);
  assert.match(html, /SoftwareApplication/);
  assert.ok(html.includes(`${origin}/og.png`));
  const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
  for (const page of pages) assert.ok(sitemap.includes(`${origin}${page ? `/${page}` : ""}`));
  assert.ok((await readFile(join(root, "robots.txt"), "utf8")).includes(`${origin}/sitemap.xml`));
  await stat(join(root, ".nojekyll"));
  // AdMob reads this from the developer website listed in the stores.
  assert.match(await readFile(join(root, "app-ads.txt"), "utf8"), /^google\.com, pub-7432159492130512, DIRECT, f08c47fec0942fa0$/m);
  await stat(join(root, "404.html"));
});
test("does not preload or execute the analytics beacon before visitor consent", async () => {
  for (const page of pages) {
    const html = await readFile(join(root, page, "index.html"), "utf8");
    assert.doesNotMatch(html, /<(?:script|link)\b[^>]*(?:src|href)="https:\/\/static\.cloudflareinsights\.com\//);
  }
});
test("does not export backend source, personal records or source maps", async () => {
  async function walk(dir) {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      assert.doesNotMatch(item.name, /^(?:\.env|\.openai|\.claude|n8n|api|db|work)$|\.(?:map|csv|sqlite|pem)$/i);
      if (item.isDirectory()) await walk(join(dir, item.name));
    }
  }
  await walk(root);
});
