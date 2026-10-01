const request = $('Valider la requête').first().json.request || {};
let records;
try { records = sheetRecords($input.first().json); }
catch { return [{ json: unavailable() }]; }

if (!['subscribe', 'unsubscribe'].includes(request.action) || !/^[a-f0-9]{64}$/.test(request.managementToken || '')) {
  return [{ json: { operation: 'none', statusCode: 400, response: { ok: false, error: 'invalid_request' } } }];
}
if (request.action === 'unsubscribe') {
  const managed = records.filter(({ record }) => record.management_token === request.managementToken);
  return [{ json: {
    operation: managed.length ? 'erase' : 'none', statusCode: 200, response: { ok: true },
    ...(managed.length ? { writeBody: eraseRows(managed), expectedRows: managed.length } : {}),
  } }];
}

const email = typeof request.email === 'string' ? request.email.trim().toLowerCase() : '';
if (!/^(?![=+\-@])[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[a-z]{2,}$/i.test(email) || email.length > 254 || request.consentLaunch !== true || !['couple-distance', 'couple', 'amis', 'famille', 'curiosite'].includes(request.reason) || typeof request.expectations !== 'string' || request.expectations.length > 600) {
  return [{ json: { operation: 'none', statusCode: 400, response: { ok: false, error: 'invalid_request' } } }];
}
if (records.some(({ record }) => record.email.toLowerCase() === email)) {
  return [{ json: { operation: 'none', statusCode: 201, response: { ok: true } } }];
}
// Un même lien personnel ne peut pas être attribué à deux adresses.
if (records.some(({ record }) => record.management_token === request.managementToken)) {
  return [{ json: { operation: 'none', statusCode: 400, response: { ok: false, error: 'invalid_request' } } }];
}
const now = new Date().toISOString();
const record = {
  created_at: now, updated_at: now, email, reason: request.reason,
  reason_label: String(request.reasonLabel || request.reason).slice(0, 60), expectations: request.expectations,
  consent_launch: 'oui', consent_feedback: request.consentFeedback === true ? 'oui' : 'non',
  policy_version: String(request.policyVersion || '').slice(0, 20), consent_at: now,
  source: 'site-web', management_token: request.managementToken,
};
return [{ json: { operation: 'append', statusCode: 201, response: { ok: true }, expectedRows: 1,
  writeBody: { range: `'${SHEET_NAME}'!A1:L`, majorDimension: 'ROWS', values: [COLUMNS.map(column => safeCell(record[column]))] },
} }];
