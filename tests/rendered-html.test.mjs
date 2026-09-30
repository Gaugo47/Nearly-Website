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

async function callWaitlist(method, body, env = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("https://nearly.example/api/waitlist", {
      method,
      headers: { "content-type": "application/json", host: "nearly.example" },
      body: JSON.stringify(body),
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) }, ...env },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const n8nEnv = { N8N_WAITLIST_WEBHOOK_URL: "https://n8n.example/webhook/nearly-waitlist", N8N_WAITLIST_TOKEN: "secret-test" };
const validSignup = { email: " Alice@Exemple.fr", reason: "couple-distance", expectations: "Des rituels", consentLaunch: true, consentFeedback: true, startedAt: 0 };

test("renders the waitlist form at the top of the landing page", async () => {
  const html = await (await render()).text();
  const waitlistIndex = html.indexOf('id="liste-attente"');
  assert.ok(waitlistIndex > 0 && waitlistIndex < html.indexOf('id="experience"'));
  assert.match(html, /Rejoindre la liste d’attente/);
  assert.match(html, /name="consentLaunch"/);
  assert.match(html, /href="\/confidentialite"/);
  assert.match(html, /href="\/conditions-liste-attente"/);
});

test("renders the legal pages", async () => {
  for (const [path, text] of [
    ["/confidentialite", /Politique de/],
    ["/conditions-liste-attente", /Conditions de la/],
    ["/mentions-legales", /Mentions/],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), text);
  }
  assert.match(await (await render("/confidentialite")).text(), /id="desinscription"/);
});

test("forwards a valid waitlist signup to n8n with the shared token", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    calls.push({ url: String(url), init });
    return Response.json({ ok: true }, { status: 201 });
  });

  const response = await callWaitlist("POST", validSignup, n8nEnv);
  assert.equal(response.status, 201);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, n8nEnv.N8N_WAITLIST_WEBHOOK_URL);
  assert.equal(calls[0].init.headers["x-nearly-token"], "secret-test");
  const sent = JSON.parse(calls[0].init.body);
  assert.equal(sent.action, "subscribe");
  assert.equal(sent.email, "alice@exemple.fr");
  assert.equal(sent.reasonLabel, "Couple à distance");
  assert.equal(sent.consentFeedback, true);
  assert.equal(sent.policyVersion, "2026-09-30");

  const removed = await callWaitlist("DELETE", { email: "alice@exemple.fr" }, n8nEnv);
  assert.equal(removed.status, 200);
  assert.equal(JSON.parse(calls[1].init.body).action, "unsubscribe");
});

test("rejects invalid signups and silently drops bots", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => Response.json({ ok: true }));

  assert.equal((await callWaitlist("POST", { ...validSignup, email: "nope" }, n8nEnv)).status, 400);
  assert.equal((await callWaitlist("POST", { ...validSignup, reason: "autre" }, n8nEnv)).status, 400);
  assert.equal((await callWaitlist("POST", { ...validSignup, consentLaunch: false }, n8nEnv)).status, 400);
  assert.equal((await callWaitlist("POST", { ...validSignup, expectations: "x".repeat(601) }, n8nEnv)).status, 400);

  const bot = await callWaitlist("POST", { ...validSignup, website: "https://spam.example" }, n8nEnv);
  assert.equal(bot.status, 200);
  assert.deepEqual(await bot.json(), { joined: true });
  assert.equal(fetchMock.mock.callCount(), 0);

  assert.equal((await callWaitlist("POST", validSignup)).status, 503);
});
