// Après la réponse HTTP : seul un ajout réellement confirmé autorise un e-mail.
const result = $input.first().json;
const plan = $('Préparer la demande').first().json;
if (result.statusCode !== 201 || result.response?.ok !== true || plan.operation !== 'append') return [];
const request = $('Valider la requête').first().json.request;
const email = typeof request?.email === 'string' ? request.email.trim().toLowerCase() : '';
if (request?.action !== 'subscribe' || !/^[a-f0-9]{64}$/.test(request.managementToken || '') || !/^(?![=+\-@])[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[a-z]{2,}$/i.test(email) || email.length > 254) return [];
const unsubscribeUrl = `https://hellonearly.com/confidentialite/#token=${request.managementToken}`;
return [{ json: {
  sendTo: email,
  subject: 'Merci d’avoir rejoint Nearly 💜',
  message: [
    'Bonjour,', '',
    'Merci d’avoir rejoint la liste d’attente de Nearly ! Votre inscription a bien été enregistrée.', '',
    'Nous vous préviendrons dès que Nearly sera disponible.', '',
    'Vous pouvez quitter la liste à tout moment avec votre lien personnel :',
    unsubscribeUrl, '',
    'À bientôt,', 'L’équipe Nearly', 'https://hellonearly.com/',
  ].join('\n'),
} }];
