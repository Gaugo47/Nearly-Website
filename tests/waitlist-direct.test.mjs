import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const source = await readFile(new URL('../app/waitlist-client.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const { sendWaitlist, tokenFromFragment, newManagementToken, readReceipt, saveReceipt } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('le navigateur envoie directement un POST sans secret et attend une confirmation JSON', async (t) => {
  const calls = [];
  const server = createServer(async (req, res) => {
    let body = ''; for await (const chunk of req) body += chunk;
    calls.push({ method: req.method, headers: req.headers, payload: JSON.parse(new URLSearchParams(body).get('payload')) });
    res.writeHead(201, { 'content-type': 'application/json' }); res.end('{"ok":true}');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const endpoint = `http://127.0.0.1:${server.address().port}/webhook/nearly-waitlist-public`;
  await sendWaitlist(endpoint, { action: 'subscribe', email: 'alice@example.test', challengeToken: 'temporary', managementToken: newManagementToken() });
  await sendWaitlist(endpoint, { action: 'unsubscribe', managementToken: newManagementToken() });
  assert.equal(calls.length, 2);
  for (const call of calls) {
    assert.equal(call.method, 'POST');
    assert.match(call.headers['content-type'], /^application\/x-www-form-urlencoded/);
    assert.equal(call.headers['x-nearly-token'], undefined);
    assert.equal(call.headers.authorization, undefined);
  }
  assert.equal(calls[0].payload.action, 'subscribe');
  assert.equal(calls[1].payload.action, 'unsubscribe');
  assert.equal(calls[1].payload.email, undefined);
});

test('un refus ou une réponse mal formée ne s’affiche jamais comme une inscription réussie', async (t) => {
  let reply = new Response('{"ok":false,"error":"challenge_failed"}', { status: 400 });
  t.mock.method(globalThis, 'fetch', async () => reply);
  await assert.rejects(sendWaitlist('https://example.test', {}), /anti-robots/);
  reply = new Response('{"joined":true}');
  await assert.rejects(sendWaitlist('https://example.test', {}));
  reply = new Response('not-json');
  await assert.rejects(sendWaitlist('https://example.test', {}));
});

test('les liens personnels exigent un jeton complet et restent utilisables sans stockage local', () => {
  const token = newManagementToken();
  assert.match(token, /^[a-f0-9]{64}$/);
  assert.notEqual(token, newManagementToken());
  assert.equal(tokenFromFragment(`#token=${token}`), token);
  assert.equal(tokenFromFragment('#token=short'), '');
  assert.equal(tokenFromFragment('#desinscription'), '');
  assert.equal(readReceipt(), null);
  assert.doesNotThrow(() => saveReceipt({ email: 'alice@example.test', token, createdAt: Date.now() }));
});
