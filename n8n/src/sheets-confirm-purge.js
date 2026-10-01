const plan = $('Préparer la purge').first().json;
const result = $input.first().json;
if (result?.error || result?.totalUpdatedRows !== plan.expectedRows) throw new Error('Sheets purge failed');
return [{ json: { removed: plan.expectedRows } }];
