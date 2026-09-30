// Helpers CSV partagés : injectés en tête de chaque nœud Code par build-workflow.mjs.
const CSV_FILE_NAME = 'nearly-waitlist.csv';
const DELIMITER = ',';
const COLUMNS = [
  'created_at',
  'updated_at',
  'email',
  'reason',
  'reason_label',
  'expectations',
  'consent_launch',
  'consent_feedback',
  'policy_version',
  'consent_at',
  'source',
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const input = text.replace(/^﻿/, '');
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (quoted) {
      if (char !== '"') field += char;
      else if (input[i + 1] === '"') { field += '"'; i++; }
      else quoted = false;
    } else if (char === '"') {
      quoted = true;
    } else if (char === DELIMITER) {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((cell) => cell !== ''));
}

// Une ligne par e-mail : si deux inscriptions simultanées ont créé un doublon, la plus récente l'emporte.
function readRecords(text) {
  const [header, ...lines] = parseCsv(text);
  if (!header) return [];
  const byEmail = new Map();
  for (const line of lines) {
    const record = Object.fromEntries(header.map((name, index) => [name, line[index] ?? '']));
    if (!record.email) continue;
    const previous = byEmail.get(record.email);
    byEmail.set(record.email, previous ? { ...record, created_at: previous.created_at } : record);
  }
  return [...byEmail.values()];
}

// Préfixe les cellules qui ressemblent à une formule pour empêcher l'injection CSV dans Excel/Sheets.
function csvCell(value) {
  let text = value == null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return /["\r\n]/.test(text) || text.includes(DELIMITER) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

function csvLine(record) {
  return COLUMNS.map((column) => csvCell(record[column])).join(DELIMITER) + '\r\n';
}

function toCsv(records) {
  return '﻿' + COLUMNS.join(DELIMITER) + '\r\n' + records.map(csvLine).join('');
}

function csvBinary(text) {
  return {
    data: Buffer.from(text, 'utf8').toString('base64'),
    mimeType: 'text/csv',
    fileName: CSV_FILE_NAME,
    fileExtension: 'csv',
  };
}

// Retourne le contenu du CSV lu par le nœud précédent, ou null si le fichier n'existe pas encore.
async function loadExistingCsv(context, items) {
  const index = items.findIndex((item) => item.binary && item.binary.data);
  if (index === -1) return null;
  const buffer = await context.helpers.getBinaryDataBuffer(index, 'data');
  return buffer.toString('utf8');
}
