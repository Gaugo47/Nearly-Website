// Nœud « Traiter la demande » : valide la requête du site puis inscrit, met à jour ou supprime la ligne du CSV.
const EXPECTATIONS_MAX = 600;
const EMAIL_PATTERN = /^(?![=+\-@])[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[a-z]{2,}$/i;
const now = new Date().toISOString();
const request = $('Webhook inscription').first().json.body || {};

function respond(statusCode, response, file) {
  const json = { statusCode, response, write: Boolean(file) };
  if (!file) return [{ json }];
  return [{ json: { ...json, append: file.append }, binary: { data: csvBinary(file.text) } }];
}

function shortText(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

const action = request.action;
const email = typeof request.email === 'string' ? request.email.trim().toLowerCase() : '';
if (!['subscribe', 'unsubscribe'].includes(action) || email.length > 254 || !EMAIL_PATTERN.test(email)) {
  return respond(400, { ok: false, error: 'invalid_request' });
}

const existingText = await loadExistingCsv(this, $input.all());
const hasHeader = existingText !== null && parseCsv(existingText).length > 0;
const records = hasHeader ? readRecords(existingText) : [];
const current = records.find((record) => record.email === email);

if (action === 'unsubscribe') {
  // Réponse identique que l'adresse soit inscrite ou non.
  if (!current) return respond(200, { ok: true });
  return respond(200, { ok: true }, { append: false, text: toCsv(records.filter((record) => record.email !== email)) });
}

const expectations = typeof request.expectations === 'string' ? request.expectations.trim() : '';
const validReason = typeof request.reason === 'string' && /^[a-z][a-z-]{1,29}$/.test(request.reason);
if (!validReason || request.consentLaunch !== true || expectations.length > EXPECTATIONS_MAX) {
  return respond(400, { ok: false, error: 'invalid_request' });
}

const consentAt = typeof request.consentAt === 'string' && !Number.isNaN(Date.parse(request.consentAt))
  ? new Date(request.consentAt).toISOString()
  : now;

const record = {
  created_at: current ? current.created_at : now,
  updated_at: now,
  email,
  reason: request.reason,
  reason_label: shortText(request.reasonLabel, 60) || request.reason,
  expectations,
  consent_launch: 'oui',
  consent_feedback: request.consentFeedback === true ? 'oui' : 'non',
  policy_version: shortText(request.policyVersion, 20),
  consent_at: consentAt,
  source: shortText(request.source, 40) || 'site-web',
};

// Nouvelle adresse dans un fichier existant : simple ajout en fin de fichier.
if (!current && hasHeader) {
  return respond(201, { ok: true }, { append: true, text: csvLine(record) });
}

const nextRecords = current ? records.map((item) => (item.email === email ? record : item)) : [record];
return respond(current ? 200 : 201, { ok: true }, { append: false, text: toCsv(nextRecords) });
