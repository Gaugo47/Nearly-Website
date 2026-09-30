import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import test from "node:test";
const root = resolve("out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://gaugo47.github.io/Nearly-Website").replace(/\/$/, "");
const pages = ["", "calculateur-remboursement", "questions-couple", "confidentialite", "conditions-liste-attente", "mentions-legales"];
test("exports all pages and usable local links/assets under the configured base path", async () => {
  for (const page of pages) {
    const html = await readFile(join(root, page, "index.html"), "utf8");
    assert.match(html, /<html lang="fr"/);
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
test("exports public SEO and GitHub Pages assets", async () => {
  const html = await readFile(join(root, "index.html"), "utf8");
  assert.match(html, /Tous ceux qui comptent/);
  assert.match(html, /SoftwareApplication/);
  assert.ok(html.includes(`${origin}/og.png`));
  const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
  for (const page of pages) assert.ok(sitemap.includes(`${origin}${page ? `/${page}` : ""}`));
  assert.ok((await readFile(join(root, "robots.txt"), "utf8")).includes(`${origin}/sitemap.xml`));
  await stat(join(root, ".nojekyll"));
  await stat(join(root, "404.html"));
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
