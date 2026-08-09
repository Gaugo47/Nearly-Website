import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://nearly.example${path}`, {
      headers: {
        accept: "text/html",
        host: "nearly.example",
        "x-forwarded-host": "nearly.example",
        "x-forwarded-proto": "https",
      },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Nearly landing page and SEO content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Nearly — Proches, même à distance<\/title>/i);
  assert.match(html, /Tous ceux qui comptent/);
  assert.match(html, /Le hub privé de toutes vos relations/);
  assert.match(html, /Les bons comptes/);
  assert.match(html, /Préparation automatique/);
  assert.match(html, /sans bouton intermédiaire/);
  assert.match(html, /security-core__icon--lock/);
  assert.match(html, /footer-logo/);
  assert.match(html, /nearly-app-icon-liquid-glass-v2\.png/);
  assert.match(html, /SoftwareApplication/);
  assert.match(html, /FAQPage/);
  assert.match(html, /https:\/\/nearly\.example\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/i);
});

test("server-renders the searchable tool pages", async () => {
  const calculator = await render("/calculateur-remboursement");
  assert.equal(calculator.status, 200);
  assert.match(await calculator.text(), /Calculateur de remboursement entre amis/);

  const questions = await render("/questions-couple");
  assert.equal(questions.status, 200);
  const questionsHtml = await questions.text();
  assert.match(questionsHtml, /Questions à se poser en couple/);
  assert.match(questionsHtml, /quatre questions par visiteur/);
});

test("ships an AI-readable product summary", async () => {
  const llms = await readFile(new URL("../public/llms.txt", import.meta.url), "utf8");
  assert.match(llms, /^# Nearly/m);
  assert.match(llms, /hub relationnel privé/i);
  assert.match(llms, /relations qui comptent/i);
  assert.match(llms, /Vie privée/);
});
