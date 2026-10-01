const result = $input.first().json;
const valid = result.success === true && result.hostname === ALLOWED_HOSTNAME && result.action === 'waitlist';
return [{ json: valid
  ? { allowed: true, request: $('Valider la requête').first().json.request }
  : { allowed: false, statusCode: 400, response: { ok: false, error: 'challenge_failed' }, write: false }
}];
