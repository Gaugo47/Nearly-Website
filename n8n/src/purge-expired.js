// Nœud « Supprimer les inscriptions expirées » : applique la durée de conservation annoncée dans la politique de confidentialité.
const RETENTION_MONTHS = 36;

const existingText = await loadExistingCsv(this, $input.all());
if (!existingText) return [];

const limit = new Date();
limit.setMonth(limit.getMonth() - RETENTION_MONTHS);

const records = readRecords(existingText);
const kept = records.filter((record) => {
  const lastConsent = Date.parse(record.updated_at || record.created_at);
  return Number.isNaN(lastConsent) || lastConsent >= limit.getTime();
});

// Rien à supprimer : on n'écrit pas le fichier.
if (kept.length === records.length) return [];

return [{
  json: { removed: records.length - kept.length, kept: kept.length },
  binary: { data: csvBinary(toCsv(kept)) },
}];
