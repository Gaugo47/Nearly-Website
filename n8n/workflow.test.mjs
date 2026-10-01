// Exécute les nœuds Code du workflow avec un environnement qui imite celui de n8n.
// Usage : node --test n8n/workflow.test.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildWorkflow, codeNodeSource } from "./build-workflow.mjs";

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

async function runCodeNode(file, { csv = null, body = {}, headers = { origin: 'https://hellonearly.com' }, result = {} } = {}) {
  const code = await codeNodeSource(file);
  const items = csv === null ? [{ json: {} }] : [{ json: {}, binary: { data: { data: Buffer.from(csv).toString("base64") } } }];
  const context = {
    helpers: { getBinaryDataBuffer: async (index, property) => Buffer.from(items[index].binary[property].data, "base64") },
  };
  const $input = { all: () => items, first: () => ({ json: result }) };
  const $ = (name) => {
    assert.ok(['Webhook inscription', 'Valider la requête'].includes(name));
    return { first: () => ({ json: { headers, body, request: body } }) };
  };
  return new AsyncFunction("$input", "$", code).call(context, $input, $);
}

const fileText = (output) => Buffer.from(output.binary.data.data, "base64").toString("utf8");

const signup = (overrides = {}) => ({
  action: "subscribe",
  email: "Alice@Exemple.fr ",
  reason: "couple-distance",
  reasonLabel: "Couple à distance",
  expectations: "Des rituels simples, avec \"guillemets\", virgules\net retours à la ligne.",
  consentLaunch: true,
  consentFeedback: false,
  policyVersion: "2026-09-30",
  consentAt: "2026-09-30T10:00:00.000Z",
  source: "site-web",
  managementToken: "a".repeat(64),
  challengeToken: "test-challenge",
  startedAt: Date.now() - 5000,
  ...overrides,
});

test("crée le fichier avec l'en-tête à la première inscription", async () => {
  const [output] = await runCodeNode("process-request.js", { body: signup() });
  assert.equal(output.json.statusCode, 201);
  assert.equal(output.json.write, true);
  assert.equal(output.json.append, false);
  const text = fileText(output);
  assert.ok(text.startsWith("﻿created_at,updated_at,email,reason,"));
  assert.match(text, /alice@exemple\.fr,couple-distance,Couple à distance,"Des rituels simples, avec ""guillemets"", virgules\net retours à la ligne\.",oui,non,2026-09-30/);
});

test("ajoute une nouvelle adresse en fin de fichier sans réécrire", async () => {
  const [first] = await runCodeNode("process-request.js", { body: signup() });
  const [second] = await runCodeNode("process-request.js", { csv: fileText(first), body: signup({ email: "bob@exemple.fr", managementToken: "b".repeat(64), reason: "amis", reasonLabel: "Groupe d’amis", expectations: "" }) });
  assert.equal(second.json.statusCode, 201);
  assert.equal(second.json.append, true);
  assert.doesNotMatch(fileText(second), /created_at/);
  assert.match(fileText(second), /^[^,]+,[^,]+,bob@exemple\.fr,amis,Groupe d’amis,,oui,non,/);
});

test("une inscription publique ne remplace pas les réponses ou le lien d'une autre personne", async () => {
  const [first] = await runCodeNode("process-request.js", { body: signup() });
  const [output] = await runCodeNode("process-request.js", { csv: fileText(first), body: signup({ reason: "famille", consentFeedback: true, managementToken: "c".repeat(64) }) });
  assert.equal(output.json.statusCode, 201);
  assert.equal(output.json.write, false);
  assert.equal(output.binary, undefined);
});

test("désinscrit en supprimant la ligne et répond pareil pour une adresse inconnue", async () => {
  const [first] = await runCodeNode("process-request.js", { body: signup() });
  const [second] = await runCodeNode("process-request.js", { csv: fileText(first), body: signup({ email: "bob@exemple.fr", managementToken: "b".repeat(64) }) });
  const csv = fileText(first) + fileText(second);

  const [removed] = await runCodeNode("process-request.js", { csv, body: { action: "unsubscribe", managementToken: "a".repeat(64) } });
  assert.deepEqual(removed.json.response, { ok: true });
  assert.equal(removed.json.append, false);
  assert.doesNotMatch(fileText(removed), /alice@/);
  assert.match(fileText(removed), /bob@exemple\.fr/);

  const [unknown] = await runCodeNode("process-request.js", { csv, body: { action: "unsubscribe", managementToken: "c".repeat(64) } });
  assert.deepEqual(unknown.json, { statusCode: 200, response: { ok: true }, write: false });
});

test("refuse les requêtes invalides sans toucher au fichier", async () => {
  for (const body of [
    {},
    signup({ action: "delete-all" }),
    signup({ managementToken: "short" }),
    { action: "unsubscribe", email: "alice@exemple.fr" },
    signup({ email: "pas-un-email" }),
    signup({ email: "=HYPERLINK(1)@x.fr" }),
    signup({ consentLaunch: false }),
    signup({ reason: "<script>" }),
    signup({ expectations: "x".repeat(601) }),
  ]) {
    const [output] = await runCodeNode("process-request.js", { body });
    assert.equal(output.json.statusCode, 400, JSON.stringify(body));
    assert.equal(output.json.write, false);
  }
});

test("neutralise les formules dans les cellules", async () => {
  const [output] = await runCodeNode("process-request.js", { body: signup({ expectations: "=IMPORTXML(\"http://x\")" }) });
  assert.match(fileText(output), /"'=IMPORTXML\(""http:\/\/x""\)"/);
});

test("purge les inscriptions de plus de 36 mois et ignore un fichier à jour", async () => {
  const recent = new Date().toISOString();
  const csv = [
    "﻿created_at,updated_at,email,reason,reason_label,expectations,consent_launch,consent_feedback,policy_version,consent_at,source",
    "2020-01-01T00:00:00.000Z,2020-01-01T00:00:00.000Z,ancien@exemple.fr,amis,Amis,,oui,non,v0,2020-01-01T00:00:00.000Z,site-web",
    `2020-01-01T00:00:00.000Z,${recent},reinscrit@exemple.fr,amis,Amis,,oui,non,v1,${recent},site-web`,
    `${recent},${recent},recent@exemple.fr,amis,Amis,,oui,non,v1,${recent},site-web`,
    "",
  ].join("\r\n");

  const [output] = await runCodeNode("purge-expired.js", { csv });
  assert.deepEqual(output.json, { removed: 1, kept: 2 });
  assert.doesNotMatch(fileText(output), /ancien@/);
  assert.match(fileText(output), /reinscrit@/);

  assert.deepEqual(await runCodeNode("purge-expired.js", { csv: fileText(output) }), []);
  assert.deepEqual(await runCodeNode("purge-expired.js"), []);
});

test("le workflow exporté est à jour et correctement câblé", async () => {
  const workflow = await buildWorkflow();
  const exported = JSON.parse(await readFile(new URL("./nearly-waitlist.workflow.json", import.meta.url), "utf8"));
  assert.deepEqual(exported, workflow, "Relancez : node n8n/build-workflow.mjs");

  const names = new Set(workflow.nodes.map((node) => node.name));
  for (const [source, { main }] of Object.entries(workflow.connections)) {
    assert.ok(names.has(source), source);
    for (const target of main.flat()) assert.ok(names.has(target.node), target.node);
  }
  assert.equal(workflow.settings.saveDataSuccessExecution, "none");
  assert.equal(workflow.settings.saveDataErrorExecution, "none");
  assert.equal(workflow.active, false);
  assert.equal(workflow.nodes.find((node) => node.name === 'Webhook inscription').parameters.authentication, 'none');
  assert.equal(workflow.nodes.find((node) => node.name === 'Webhook inscription').parameters.options.allowedOrigins, 'https://hellonearly.com');
  assert.equal(workflow.nodes.find((node) => node.name === 'Webhook export').parameters.authentication, 'headerAuth');
});

test('refuse les origines, pièges robots et champs invalides avant accès au CSV', async () => {
  for (const [body, headers] of [
    [{ payload: JSON.stringify(signup()) }, { origin: 'https://attacker.test' }],
    [{ payload: JSON.stringify(signup()) }, { origin: 'https://gaugo47.github.io' }],
    [{ payload: JSON.stringify(signup()) }, { origin: 'https://www.hellonearly.com' }],
    [{ payload: '{' }], [{ payload: 'x'.repeat(8193) }],
    ...[{ website: 'bot' }, { startedAt: Date.now() }, { startedAt: null }, { challengeToken: '' }, { consentLaunch: false }, { reason: 'unknown' }, { managementToken: '' }, { expectations: 'x'.repeat(601) }].map((override) => [{ payload: JSON.stringify(signup(override)) }]),
  ]) {
    const [output] = await runCodeNode('validate-request.js', { body, ...(headers ? { headers } : {}) });
    assert.equal(output.json.allowed, false);
    assert.equal(output.json.write, false);
  }
  const [accepted] = await runCodeNode('validate-request.js', { body: { payload: JSON.stringify(signup()) } });
  assert.equal(accepted.json.verify, true);
  assert.equal(accepted.json.request.email, 'alice@exemple.fr');
  assert.equal(accepted.json.request.policyVersion, '2026-10-01');
  const [unsubscribe] = await runCodeNode('validate-request.js', { body: { payload: JSON.stringify({ action: 'unsubscribe', managementToken: 'a'.repeat(64) }) } });
  assert.equal(unsubscribe.json.allowed, true);
  assert.equal(unsubscribe.json.verify, false);
});

test('Turnstile échoue fermé : succès, hostname et action doivent correspondre', async () => {
  for (const result of [{}, { success: false }, { success: true, hostname: 'attacker.test', action: 'waitlist' }, { success: true, hostname: 'hellonearly.com', action: 'other' }, { success: true, hostname: 'gaugo47.github.io', action: 'waitlist' }]) {
    const [output] = await runCodeNode('check-challenge.js', { result });
    assert.equal(output.json.allowed, false);
  }
  const [output] = await runCodeNode('check-challenge.js', { body: signup(), result: { success: true, hostname: 'hellonearly.com', action: 'waitlist' } });
  assert.equal(output.json.allowed, true);
});

test('migre un ancien CSV sans perdre les lignes ou mélanger les colonnes', async () => {
  const old = 'created_at,updated_at,email,reason,reason_label,expectations,consent_launch,consent_feedback,policy_version,consent_at,source\r\n2025-01-01,2025-01-01,ancien@exemple.fr,amis,Amis,,oui,non,v1,2025-01-01,site-web\r\n';
  const [output] = await runCodeNode('process-request.js', { csv: old, body: signup() });
  assert.equal(output.json.append, false);
  assert.match(fileText(output), /source,management_token/);
  assert.match(fileText(output), /ancien@exemple.fr/);
});
