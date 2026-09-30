// Exécute les nœuds Code du workflow avec un environnement qui imite celui de n8n.
// Usage : node --test n8n/workflow.test.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildWorkflow, codeNodeSource } from "./build-workflow.mjs";

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

async function runCodeNode(file, { csv = null, body = {} } = {}) {
  const code = await codeNodeSource(file);
  const items = csv === null ? [{ json: {} }] : [{ json: {}, binary: { data: { data: Buffer.from(csv).toString("base64") } } }];
  const context = {
    helpers: { getBinaryDataBuffer: async (index, property) => Buffer.from(items[index].binary[property].data, "base64") },
  };
  const $input = { all: () => items };
  const $ = (name) => {
    assert.equal(name, "Webhook inscription");
    return { first: () => ({ json: { headers: {}, body } }) };
  };
  return new AsyncFunction("$input", "$", code).call(context, $input, $);
}

const fileText = (output) => Buffer.from(output.binary.data.data, "base64").toString("utf8");
const withoutBom = (text) => text.replace(/^﻿/, "");

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
  const [second] = await runCodeNode("process-request.js", { csv: fileText(first), body: signup({ email: "bob@exemple.fr", reason: "amis", reasonLabel: "Groupe d’amis", expectations: "" }) });
  assert.equal(second.json.statusCode, 201);
  assert.equal(second.json.append, true);
  assert.doesNotMatch(fileText(second), /created_at/);
  assert.match(fileText(second), /^[^,]+,[^,]+,bob@exemple\.fr,amis,Groupe d’amis,,oui,non,/);
});

test("met à jour une adresse déjà inscrite en conservant sa date d'inscription", async () => {
  const csv = withoutBom(fileText((await runCodeNode("process-request.js", { body: signup() }))[0]))
    .replace(/\n(\d{4}-[^,]+),[^,]+,alice/, "\n2025-01-01T00:00:00.000Z,2025-01-01T00:00:00.000Z,alice");
  const [output] = await runCodeNode("process-request.js", { csv, body: signup({ reason: "famille", reasonLabel: "Famille", consentFeedback: true }) });
  assert.equal(output.json.statusCode, 200);
  assert.equal(output.json.append, false);
  const lines = withoutBom(fileText(output)).trim().split("\r\n");
  assert.equal(lines.length, 2);
  assert.match(lines[1], /^2025-01-01T00:00:00\.000Z,20\d\d-.*,alice@exemple\.fr,famille,Famille,.*,oui,oui,/s);
});

test("désinscrit en supprimant la ligne et répond pareil pour une adresse inconnue", async () => {
  const [first] = await runCodeNode("process-request.js", { body: signup() });
  const [second] = await runCodeNode("process-request.js", { csv: fileText(first), body: signup({ email: "bob@exemple.fr" }) });
  const csv = fileText(first) + fileText(second);

  const [removed] = await runCodeNode("process-request.js", { csv, body: { action: "unsubscribe", email: "ALICE@exemple.fr" } });
  assert.deepEqual(removed.json.response, { ok: true });
  assert.equal(removed.json.append, false);
  assert.doesNotMatch(fileText(removed), /alice@/);
  assert.match(fileText(removed), /bob@exemple\.fr/);

  const [unknown] = await runCodeNode("process-request.js", { csv, body: { action: "unsubscribe", email: "personne@exemple.fr" } });
  assert.deepEqual(unknown.json, { statusCode: 200, response: { ok: true }, write: false });
});

test("refuse les requêtes invalides sans toucher au fichier", async () => {
  for (const body of [
    {},
    signup({ action: "delete-all" }),
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
});
