// Before disk access or external verification: bound and normalize public input.
const headers = $('Webhook inscription').first().json.headers || {};
const incoming = $('Webhook inscription').first().json.body;
let request;
try {
  if (!incoming || typeof incoming.payload !== 'string' || incoming.payload.length > 8192) throw new Error();
  request = JSON.parse(incoming.payload);
} catch { request = null; }
function reject(statusCode, error) {
  return [{ json: { allowed: false, verify: false, statusCode, response: { ok: false, error }, write: false } }];
}
if (headers.origin !== ALLOWED_ORIGIN) return reject(403, 'invalid_request');
if (!request || typeof request !== 'object' || Array.isArray(request)) return reject(400, 'invalid_request');
if (!['subscribe', 'unsubscribe'].includes(request.action) || typeof request.managementToken !== 'string' || !/^[a-f0-9]{64}$/.test(request.managementToken)) return reject(400, 'invalid_request');
if (request.action === 'unsubscribe') return [{ json: { allowed: true, verify: false, request: { action: 'unsubscribe', managementToken: request.managementToken } } }];
const email = typeof request.email === 'string' ? request.email.trim().toLowerCase() : '';
const reasons = { 'couple-distance': 'Couple à distance', couple: 'Vie de couple', amis: 'Groupe d’amis', famille: 'Famille', curiosite: 'Simple curiosité' };
const expectations = typeof request.expectations === 'string' ? request.expectations.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') : '';
if (email.length > 254 || !/^(?![=+\-@])[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[a-z]{2,}$/i.test(email) || !Object.hasOwn(reasons, request.reason) || request.consentLaunch !== true || expectations.length > 600) return reject(400, 'invalid_request');
if (request.website || typeof request.startedAt !== 'number' || Date.now() - request.startedAt < 1500) return reject(400, 'invalid_request');
if (typeof request.challengeToken !== 'string' || !request.challengeToken || request.challengeToken.length > 2048) return reject(400, 'challenge_failed');
return [{ json: { allowed: true, verify: true, challengeToken: request.challengeToken, request: {
  action: 'subscribe', email, managementToken: request.managementToken, reason: request.reason,
  reasonLabel: reasons[request.reason], expectations, consentLaunch: true, consentFeedback: request.consentFeedback === true,
  consentAt: new Date().toISOString(), policyVersion: '2026-10-01', source: 'site-web',
} } }];
