const plan = $('Préparer la demande').first().json;
const result = $input.first().json;
const writtenRows = plan.operation === 'append' ? result?.updates?.updatedRows : result?.totalUpdatedRows;
// Un quota dépassé ou un refus OAuth ne doit jamais produire un faux succès.
if (result?.error || writtenRows !== plan.expectedRows) return [{ json: unavailable() }];
return [{ json: { statusCode: plan.statusCode, response: plan.response } }];
