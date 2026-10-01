const records = sheetRecords($input.first().json);
const limit = new Date();
limit.setMonth(limit.getMonth() - 36);
const expired = records.filter(({ record }) => Date.parse(record.updated_at) < limit.getTime());
if (!expired.length) return [];
return [{ json: { writeBody: eraseRows(expired), expectedRows: expired.length } }];
