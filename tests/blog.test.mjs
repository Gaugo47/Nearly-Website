import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://gaugo47.github.io/Nearly-Website").replace(/\/$/, "");
const fr = JSON.parse(await readFile("content/blog.fr.json", "utf8"));
const en = JSON.parse(await readFile("content/blog.en.json", "utf8"));
const escapeHtml = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");

test("French and English article inventories and section anchors agree", () => {
  assert.equal(new Set(fr.map(article => article.slug)).size, fr.length);
  assert.deepEqual(en.map(article => article.slug), fr.map(article => article.slug));
  for (const [index, article] of fr.entries()) {
    assert.deepEqual(en[index].sections.map(section => section.id), article.sections.map(section => section.id));
    assert.deepEqual(en[index].related, article.related);
    assert.equal(new Set(article.sections.map(section => section.id)).size, article.sections.length);
    assert.ok(article.related.every(slug => slug !== article.slug && fr.some(item => item.slug === slug)));
  }
});

test("all articles export readable content and matching metadata, FAQ and ranking schemas in both languages", async () => {
  for (const [language, articles] of [["fr", fr], ["en", en]]) {
    for (const article of articles) {
      const path = `${language === "en" ? "/en" : ""}/blog/${article.slug}/`;
      const html = await readFile(resolve(`out${path}index.html`), "utf8");
      assert.ok(html.includes(escapeHtml(article.summary)), `${path}: readable summary`);
      assert.match(html, /<h1[^>]*>/);
      assert.match(html, /property="og:type" content="article"/);
      assert.ok(html.includes(`property="og:url" content="${origin}${path}"`));
      const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      assert.ok(match, `${path}: JSON-LD`);
      const { "@graph": graph } = JSON.parse(match[1]);
      const post = graph.find(item => item["@type"] === "BlogPosting");
      assert.equal(post.inLanguage, language);
      assert.equal(post.headline, article.title);
      assert.equal(post.url, `${origin}${path}`);
      assert.equal(post.abstract, article.summary);
      assert.equal(post.dateModified, article.updated);
      assert.ok(!graph.some(item => item.aggregateRating || item.review), "no fabricated ratings");
      const faq = graph.find(item => item["@type"] === "FAQPage");
      assert.deepEqual(faq.mainEntity.map(item => item.name), article.faqs.map(item => item.question));
      for (const item of faq.mainEntity) assert.ok(html.includes(escapeHtml(item.name)));
      if (article.kind === "comparison") {
        assert.ok(article.methodology);
        assert.equal(article.ranking[0].name, "Nearly");
        assert.match(article.ranking[0].limitation, language === "fr" ? /venir|pas encore/ : /coming soon|not yet/);
        const ranking = graph.find(item => item["@type"] === "ItemList");
        assert.equal(ranking.numberOfItems, article.ranking.length);
        assert.deepEqual(ranking.itemListElement.map(item => item.name), article.ranking.map(item => item.name));
        for (const item of ranking.itemListElement) assert.ok(html.includes(`id="${item.url.split("#")[1]}"`));
      }
    }
  }
});
