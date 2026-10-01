// Contrat du tableau privé. Ne jamais trier/supprimer physiquement ses lignes.
const SHEET_NAME = 'Inscriptions';
const COLUMNS = ['created_at', 'updated_at', 'email', 'reason', 'reason_label', 'expectations', 'consent_launch', 'consent_feedback', 'policy_version', 'consent_at', 'source', 'management_token'];
const sheetRange = (row) => `'${SHEET_NAME}'!A${row}:L${row}`;
const unavailable = () => ({ operation: 'none', statusCode: 503, response: { ok: false, error: 'storage_unavailable' } });

function sheetRecords(result) {
  if (!result || result.error || result.majorDimension !== 'ROWS' || !Array.isArray(result.values) || result.values.length > 50000) throw new Error('Invalid Sheets response');
  const [header, ...rows] = result.values;
  if (!Array.isArray(header) || JSON.stringify(header) !== JSON.stringify(COLUMNS)) throw new Error('Invalid Sheets header');
  const records = [];
  rows.forEach((row, index) => {
    if (!Array.isArray(row) || row.length > COLUMNS.length || row.some(cell => typeof cell !== 'string')) throw new Error('Invalid Sheets row');
    const cells = COLUMNS.map((_, column) => row[column] || '');
    if (cells[0] === 'deleted' && cells.slice(1).every(cell => !cell)) return;
    // Un trou dans le tableau ou une modification manuelle du schéma bloque les écritures.
    if (!cells[2] || !Number.isFinite(Date.parse(cells[0])) || !Number.isFinite(Date.parse(cells[1])) || !/^[a-f0-9]{64}$/.test(cells[11])) throw new Error('Incomplete Sheets row');
    records.push({ row: index + 2, record: Object.fromEntries(COLUMNS.map((name, column) => [name, cells[column]])) });
  });
  return records;
}

function eraseRows(records) {
  return {
    valueInputOption: 'RAW', includeValuesInResponse: false,
    data: records.map(({ row }) => ({ range: sheetRange(row), majorDimension: 'ROWS', values: [['deleted', ...Array(11).fill('')]] })),
  };
}

// Double protection : écriture RAW dans Sheets et export CSV ultérieur sans formule.
function safeCell(value) {
  const text = String(value ?? '');
  return /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
}
