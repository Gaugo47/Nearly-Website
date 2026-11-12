import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import test from "node:test";
const root = resolve(process.env.NEARLY_BUILD_DIR || "out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://gaugo47.github.io/Nearly-Website").replace(/\/$/, "");
const blogArticles = JSON.parse(await readFile(resolve("content/blog.fr.json"), "utf8"));
const frenchPages = ["", "calculateur-remboursement", "questions-couple", "outils", "tester-un-jeu", "devine-la-couleur", "test-langage-amour", "contact", "confidentialite", "conditions-liste-attente", "mentions-legales", "cgu", "confidentialite-app", "blog", ...blogArticles.map(article => `blog/${article.slug}`)];
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
  assert.match(html, /<h1>Proches,<br\/><span class="store-pill">même à distance\.<\/span><\/h1>/);
  assert.match(html, /SoftwareApplication/);
  assert.ok(html.includes(`${origin}/media/nearly-social-en-v7.png`));
  assert.match(html, /property="og:title" content="Nearly — Close, even far apart\."/);
  assert.match(html, /name="twitter:title" content="Nearly — Close, even far apart\."/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
  for (const page of pages) assert.ok(sitemap.includes(`${origin}${page ? `/${page}` : ""}`));
  assert.ok((await readFile(join(root, "robots.txt"), "utf8")).includes(`${origin}/sitemap.xml`));
  await stat(join(root, ".nojekyll"));
  // AdMob reads this from the developer website listed in the stores.
  assert.match(await readFile(join(root, "app-ads.txt"), "utf8"), /^google\.com, pub-7432159492130512, DIRECT, f08c47fec0942fa0$/m);
  // iOS and Android read these to open invite links straight in the app.
  const aasa = JSON.parse(await readFile(join(root, ".well-known", "apple-app-site-association"), "utf8"));
  assert.deepEqual(aasa.applinks.details[0].appIDs, ["APCGNQNUQS.com.nearlyapp.nearlyapp"]);
  const assetLinks = JSON.parse(await readFile(join(root, ".well-known", "assetlinks.json"), "utf8"));
  assert.equal(assetLinks[0].target.package_name, "com.nearlyapp.nearlyapp");
  await stat(join(root, "404.html"));
});
test("each tool page is shared and described as itself, not as the home page", async () => {
  for (const [prefix, language] of [["", "fr"], ["/en", "en"]]) {
    for (const page of ["questions-couple", "calculateur-remboursement", "tester-un-jeu", "devine-la-couleur", "test-langage-amour", "outils"]) {
      const path = `${prefix}/${page}/`;
      const html = await readFile(join(root, path, "index.html"), "utf8");
      assert.ok(html.includes(`property="og:url" content="${origin}${path}"`), `${path}: og:url`);
      assert.match(html, /property="og:image" content="[^"]+\/og\.png"/);
      const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
      assert.ok(graph.some(item => item["@type"] === "BreadcrumbList"), `${path}: breadcrumb`);
      if (page === "outils") continue;
      assert.equal(graph.find(item => item["@type"] === "WebApplication").inLanguage, language);
      // Structured answers must be the ones a visitor can read on the page.
      for (const item of graph.find(item => item["@type"] === "FAQPage").mainEntity) {
        assert.ok(html.includes(item.name.replaceAll("&", "&amp;").replaceAll("'", "&#x27;")), `${path}: ${item.name}`);
      }
    }
  }
  const legal = await readFile(join(root, "mentions-legales/index.html"), "utf8");
  assert.match(legal, /aria-label="Navigation principale"/);
  assert.ok(legal.includes(`href="${base}/blog/"`), "legal pages link back to the rest of the site");
});
test("llms.txt and the RSS feeds list every article at the configured address", async () => {
  const llms = await readFile(join(root, "llms.txt"), "utf8");
  const full = await readFile(join(root, "llms-full.txt"), "utf8");
  const feeds = { fr: await readFile(join(root, "feed.xml"), "utf8"), en: await readFile(join(root, "en/feed.xml"), "utf8") };
  assert.match(llms, /^# Nearly\n/);
  assert.match(llms, /pas encore téléchargeable/);
  for (const article of blogArticles) {
    assert.ok(llms.includes(`${origin}/blog/${article.slug}/`), `llms.txt: ${article.slug}`);
    assert.ok(llms.includes(`${origin}/en/blog/${article.slug}/`), `llms.txt (en): ${article.slug}`);
    assert.ok(full.includes(article.summary), `llms-full.txt: ${article.slug}`);
    assert.ok(feeds.fr.includes(`<link>${origin}/blog/${article.slug}/</link>`), `feed.xml: ${article.slug}`);
    assert.ok(feeds.en.includes(`<link>${origin}/en/blog/${article.slug}/</link>`), `en/feed.xml: ${article.slug}`);
  }
  const blog = await readFile(join(root, "en/blog/index.html"), "utf8");
  assert.ok(blog.includes(`type="application/rss+xml" href="${origin}/en/feed.xml"`));
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
