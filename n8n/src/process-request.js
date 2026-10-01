// Nœud « Traiter la demande » : valide la requête du site puis inscrit, met à jour ou supprime la ligne du CSV.
const EXPECTATIONS_MAX = 600;
const EMAIL_PATTERN = /^(?![=+\-@])[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[a-z]{2,}$/i;
const now = new Date().toISOString();
const request = $('Valider la requête').first().json.request || {};

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
if (!['subscribe', 'unsubscribe'].includes(action) || typeof request.managementToken !== 'string' || !/^[a-f0-9]{64}$/.test(request.managementToken) || (action === 'subscribe' && (email.length > 254 || !EMAIL_PATTERN.test(email)))) {
  return respond(400, { ok: false, error: 'invalid_request' });
}

const existingText = await loadExistingCsv(this, $input.all());
const hasHeader = existingText !== null && parseCsv(existingText).length > 0;
const currentSchema = hasHeader && parseCsv(existingText)[0].join(',') === COLUMNS.join(',');
const records = hasHeader ? readRecords(existingText) : [];
const current = records.find((record) => record.email === email);

if (action === 'unsubscribe') {
  // Réponse identique que l'adresse soit inscrite ou non.
  const managed = records.find((record) => record.management_token === request.managementToken);
  if (!managed) return respond(200, { ok: true });
  return respond(200, { ok: true }, { append: false, text: toCsv(records.filter((record) => record.management_token !== request.managementToken)) });
}

const expectations = typeof request.expectations === 'string' ? request.expectations.trim() : '';
const validReason = ['couple-distance', 'couple', 'amis', 'famille', 'curiosite'].includes(request.reason);
if (!validReason || request.consentLaunch !== true || expectations.length > EXPECTATIONS_MAX) {
  return respond(400, { ok: false, error: 'invalid_request' });
}
// A public signup must never replace an existing person's answers, consent or private token.
if (current) return respond(201, { ok: true });

const consentAt = typeof request.consentAt === 'string' && !Number.isNaN(Date.parse(request.consentAt))
  ? new Date(request.consentAt).toISOString()
  : now;

const record = {
  created_at: now,
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
  management_token: request.managementToken,
};

// Nouvelle adresse dans un fichier existant : simple ajout en fin de fichier.
if (currentSchema) {
  return respond(201, { ok: true }, { append: true, text: csvLine(record) });
}

return respond(201, { ok: true }, { append: false, text: toCsv([...records, record]) });
