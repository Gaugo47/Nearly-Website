// Variante Google Sheets : aucun fichier local et aucun secret dans le navigateur.
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { buildWorkflow } from './build-workflow.mjs';
const here = path => new URL(path, import.meta.url);
const id = name => createHash('sha256').update(`nearly-sheets:${name}`).digest('hex').slice(0, 32);
export async function sheetsCode(file) {
  const [helpers, body] = await Promise.all(['sheets-helpers.js', file].map(name => readFile(here(`./src/${name}`), 'utf8')));
  return `${helpers}\n${body}`;
}
export async function buildSheetsWorkflow({ spreadsheetId = 'REMPLACER_PAR_ID_DU_TABLEAU' } = {}) {
  const legacy = await buildWorkflow();
  const nodes = legacy.nodes.slice(0, 8);
  const connections = Object.fromEntries(Object.entries(legacy.connections).filter(([name]) => nodes.some(node => node.name === name)));
  const main = (...outputs) => ({ main: outputs.map(names => names.map(node => ({ node, type: 'main', index: 0 }))) });
  connections['Vérification nécessaire ?'] = main(['Vérifier Turnstile'], ['Configuration Sheets']);
  connections['Anti-robots validé ?'] = main(['Configuration Sheets'], ['Refuser la requête']);
  const node = (name, type, version, position, parameters, extra = {}) => ({ name, id: id(name), type: `n8n-nodes-base.${type}`, typeVersion: version, position, parameters, ...extra });
  const code = async (name, file, position) => node(name, 'code', 2, position, { mode: 'runOnceForAllItems', jsCode: await sheetsCode(file) });
  const config = (name, position) => node(name, 'code', 2, position, { mode: 'runOnceForAllItems', jsCode: `return [{ json: { spreadsheetId: ${JSON.stringify(spreadsheetId)}, range: "'Inscriptions'!A1:L" } }];` });
  const baseUrl = configName => `"https://sheets.googleapis.com/v4/spreadsheets/" + encodeURIComponent($('${configName}').first().json.spreadsheetId)`;
  const credentials = { googleSheetsOAuth2Api: { id: id('google-credential'), name: 'Google Sheets account' } };
  const http = (name, method, url, position, body) => node(name, 'httpRequest', 4.2, position, {
    method, url, authentication: 'predefinedCredentialType', nodeCredentialType: 'googleSheetsOAuth2Api',
    ...(body ? { sendBody: true, specifyBody: 'json', jsonBody: body } : {}),
    options: { timeout: 15000, response: { response: { responseFormat: 'json' } } },
  }, { credentials, onError: 'continueRegularOutput' });
  const read = (name, configName, position) => http(name, 'GET', `={{ ${baseUrl(configName)} + "/values/" + encodeURIComponent($('${configName}').first().json.range) + "?valueRenderOption=UNFORMATTED_VALUE&majorDimension=ROWS" }}`, position);
  const condition = (name, operation, position) => node(name, 'if', 2, position, {
    conditions: { options: { typeValidation: 'strict' }, conditions: [{ id: id(name+'condition'), leftValue: '={{ $json.operation }}', rightValue: operation, operator: { type: 'string', operation: 'equals' } }], combinator: 'and' }, options: {},
  });
  nodes.push(
    config('Configuration Sheets', [1400, 80]),
    read('Lire les inscriptions', 'Configuration Sheets', [1620, 80]),
    await code('Préparer la demande', 'sheets-process.js', [1840, 80]),
    condition('Inscription à ajouter ?', 'append', [2060, 80]),
    http('Ajouter l’inscription', 'POST', `={{ ${baseUrl('Configuration Sheets')} + "/values/" + encodeURIComponent($('Configuration Sheets').first().json.range) + ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS&includeValuesInResponse=false" }}`, [2300, -100], '={{ $json.writeBody }}'),
    condition('Données à effacer ?', 'erase', [2300, 180]),
    http('Effacer les données', 'POST', `={{ ${baseUrl('Configuration Sheets')} + "/values:batchUpdate" }}`, [2520, 120], '={{ $json.writeBody }}'),
    await code('Vérifier l’écriture', 'sheets-confirm.js', [2740, -20]),
    node('Répondre au site', 'respondToWebhook', 1.1, [2960, 100], {
      respondWith: 'json', responseBody: '={{ $json.response }}',
      options: { ...nodes.find(node => node.name === 'Refuser la requête').parameters.options },
    }),
    node('Chaque nuit à 3 h', 'scheduleTrigger', 1.2, [1400, 480], { rule: { interval: [{field:'days',triggerAtHour:3}] } }),
    config('Configuration Sheets (purge)', [1620, 480]),
    read('Lire les inscriptions (purge)', 'Configuration Sheets (purge)', [1840, 480]),
    await code('Préparer la purge', 'sheets-purge.js', [2060, 480]),
    http('Effacer les inscriptions expirées', 'POST', `={{ ${baseUrl('Configuration Sheets (purge)')} + "/values:batchUpdate" }}`, [2300, 480], '={{ $json.writeBody }}'),
    await code('Vérifier la purge', 'sheets-confirm-purge.js', [2520, 480]),
    node('À lire – Sheets', 'stickyNote', 1, [1400, -480], { width: 920, height: 300, content: '## Tableau privé Nearly\n1. Renseigner l’ID du tableau dans les deux nœuds « Configuration Sheets ». Onglet : **Inscriptions**, colonnes A:L inchangées.\n2. Sélectionner le compte Google Sheets existant dans les cinq requêtes Google et le Custom Auth Turnstile.\n3. Ne jamais trier, insérer ou supprimer des lignes physiquement : utiliser des vues filtrées. « deleted » indique une ligne dont les données personnelles ont été effacées.\n4. Vérifier les paramètres : aucune conservation des exécutions réussies, en erreur, manuelles ou de leur progression.\n5. Tester les écritures et la désinscription avant publication. La déduplication exige des exécutions sérialisées (voir README). Aucun secret ni lien personnel dans le dépôt.' }),
  );
  const chain = names => names.slice(0,-1).forEach((name,index) => { connections[name] = main([names[index+1]]); });
  chain(['Configuration Sheets','Lire les inscriptions','Préparer la demande','Inscription à ajouter ?']);
  connections['Inscription à ajouter ?'] = main(['Ajouter l’inscription'], ['Données à effacer ?']);
  connections['Données à effacer ?'] = main(['Effacer les données'], ['Répondre au site']);
  connections['Ajouter l’inscription'] = main(['Vérifier l’écriture']);
  chain(['Effacer les données', 'Vérifier l’écriture', 'Répondre au site']);
  chain(['Chaque nuit à 3 h','Configuration Sheets (purge)','Lire les inscriptions (purge)','Préparer la purge','Effacer les inscriptions expirées','Vérifier la purge']);
  return { ...legacy, name:'Nearly – Liste d’attente (Google Sheets)', nodes, connections, settings:{...legacy.settings, saveExecutionProgress:false} };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await writeFile(here('./nearly-waitlist.sheets.workflow.json'), JSON.stringify(await buildSheetsWorkflow(), null, 2)+'\n');
  console.log('n8n/nearly-waitlist.sheets.workflow.json généré.');
}
