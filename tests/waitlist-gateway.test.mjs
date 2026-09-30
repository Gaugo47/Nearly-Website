import assert from "node:assert/strict";
import test from "node:test";
import { createGateway } from "../n8n/gateway.mjs";
const env = { WAITLIST_ALLOWED_ORIGIN: "https://example.test", N8N_WAITLIST_WEBHOOK_URL: "https://automation.example.test/webhook/nearly-waitlist", N8N_WAITLIST_TOKEN: "fake-test-token" };
async function fixture(t) {
  const calls = [];
  const server = createGateway(env, async (url, options) => { calls.push({ url, options }); return new Response("OK"); });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/waitlist`;
  const send = (method, body, origin = env.WAITLIST_ALLOWED_ORIGIN) => fetch(url, { method, headers: { origin, "content-type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
  return { send, calls };
}
test("rejects untrusted origins, missing consent and oversized text without forwarding", async (t) => {
  const { send, calls } = await fixture(t);
  const signup = { email: "alice@example.test", reason: "amis", consentLaunch: true };
  assert.equal((await send("POST", signup, "https://attacker.test")).status, 403);
  assert.equal((await send("POST", { ...signup, consentLaunch: false })).status, 400);
  assert.equal((await send("POST", { ...signup, expectations: "a".repeat(601) })).status, 400);
  assert.equal((await send("POST", null)).status, 400);
  assert.equal(calls.length, 0);
});
test("keeps the n8n token on the server and forwards validated consent and deletion", async (t) => {
  const { send, calls } = await fixture(t);
  const preflight = await send("OPTIONS");
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), env.WAITLIST_ALLOWED_ORIGIN);
  const response = await send("POST", { email: " ALICE@EXAMPLE.TEST ", reason: "amis", consentLaunch: true, consentFeedback: true });
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { joined: true });
  const sent = JSON.parse(calls[0].options.body);
  assert.equal(sent.email, "alice@example.test");
  assert.equal(sent.reasonLabel, "Groupe d’amis");
  assert.equal(sent.consentFeedback, true);
  assert.equal(calls[0].options.headers["x-nearly-token"], env.N8N_WAITLIST_TOKEN);
  assert.equal((await send("DELETE", { email: "alice@example.test" })).status, 200);
  assert.equal(JSON.parse(calls[1].options.body).action, "unsubscribe");
});
