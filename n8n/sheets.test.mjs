import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { buildSheetsWorkflow, sheetsCode } from './build-sheets-workflow.mjs';
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const columns = ['created_at','updated_at','email','reason','reason_label','expectations','consent_launch','consent_feedback','policy_version','consent_at','source','management_token'];
const signup = (overrides={}) => ({action:'subscribe',email:'alice@example.invalid',managementToken:'a'.repeat(64),reason:'amis',reasonLabel:'Groupe d’amis',expectations:'Rituels',consentLaunch:true,consentFeedback:false,policyVersion:'2026-10-01',...overrides});
const result = rows => ({majorDimension:'ROWS',values:[columns,...rows]});
async function run(file,{data=result([]),request=signup(),plan={}}={}) {
  const code = await sheetsCode(file);
  const $input = {first:()=>({json:data})};
  const $ = name => ({first:()=>({json:name==='Valider la requête'?{request}:plan})});
  return new AsyncFunction('$input','$',code)($input,$);
}
async function created(request=signup()) {
  return (await run('sheets-process.js',{request}))[0].json.writeBody.values[0];
}
test('Sheets : première inscription par ajout RAW, sans données dans la réponse',async()=>{
  const [{json}] = await run('sheets-process.js');
  assert.equal(json.operation,'append'); assert.equal(json.statusCode,201);
  assert.deepEqual(json.response,{ok:true}); assert.equal(json.writeBody.values[0].length,12);
  assert.equal(json.writeBody.values[0][2],'alice@example.invalid');
});
test('Sheets : doublon préservé, ni réponses ni jeton remplacés',async()=>{
  const row = await created();
  const [{json}] = await run('sheets-process.js',{data:result([row]),request:signup({managementToken:'b'.repeat(64),expectations:'Écraser'})});
  assert.equal(json.operation,'none'); assert.equal(json.writeBody,undefined); assert.equal(json.statusCode,201);
});
test('Sheets : effacement uniquement par jeton, sans déplacer les autres lignes',async()=>{
  const a=await created(); const b=await created(signup({email:'bob@example.invalid',managementToken:'b'.repeat(64)}));
  const data=result([a,['deleted'],b,a]);
  const [{json}] = await run('sheets-process.js',{data,request:{action:'unsubscribe',managementToken:'a'.repeat(64)}});
  assert.equal(json.operation,'erase'); assert.equal(json.expectedRows,2);
  assert.deepEqual(json.writeBody.data.map(item=>item.range),["'Inscriptions'!A2:L2","'Inscriptions'!A5:L5"]);
  assert.ok(json.writeBody.data.every(item=>JSON.stringify(item.values)==JSON.stringify([['deleted',...Array(11).fill('')]])));
  const [unknown]=await run('sheets-process.js',{data,request:{action:'unsubscribe',managementToken:'c'.repeat(64)}});
  assert.deepEqual(unknown.json.response,json.response); assert.equal(unknown.json.operation,'none');
});
test('Sheets : erreur OAuth, mauvais en-tête et trou dans la table échouent sans écriture',async()=>{
  for(const data of [{error:'OAuth failed'}, {}, {majorDimension:'ROWS',values:[['email']]},result([[]]),result([['deleted','retained-personal-data']])]) {
    const [{json}]=await run('sheets-process.js',{data});
    assert.equal(json.statusCode,503); assert.equal(json.operation,'none'); assert.equal(json.writeBody,undefined);
  }
});
test('Sheets : requêtes invalides et collision de jeton refusées',async()=>{
  for(const request of [signup({consentLaunch:false}),signup({managementToken:'short'}),signup({expectations:'x'.repeat(601)}),signup({reason:'unknown'})]) {
    assert.equal((await run('sheets-process.js',{request}))[0].json.statusCode,400);
  }
  assert.equal((await run('sheets-process.js',{data:result([await created()]),request:signup({email:'bob@example.invalid'})}))[0].json.statusCode,400);
});
test('Sheets : formules neutralisées même dans un export CSV',async()=>{
  const row = await created(signup({expectations:' \t=IMPORTXML("https://example.invalid")'}));
  assert.ok(row[5].startsWith("'"));
});
test('Sheets : succès seulement après confirmation de Google',async()=>{
  const plan={operation:'append',expectedRows:1,statusCode:201,response:{ok:true}};
  assert.equal((await run('sheets-confirm.js',{plan,data:{updates:{updatedRows:1}}}))[0].json.statusCode,201);
  for(const data of [{error:'quota'}, {}, {updates:{updatedRows:0}}]) assert.equal((await run('sheets-confirm.js',{plan,data}))[0].json.statusCode,503);
  const erased={...plan,operation:'erase',expectedRows:2,statusCode:200};
  assert.equal((await run('sheets-confirm.js',{plan:erased,data:{totalUpdatedRows:2}}))[0].json.statusCode,200);
});
test('Sheets : purge de 36 mois sans toucher les inscriptions récentes',async()=>{
  const old=await created(); old[0]=old[1]='2020-01-01T00:00:00.000Z';
  const recent=await created(signup({email:'bob@example.invalid',managementToken:'b'.repeat(64)}));
  const [{json}]=await run('sheets-purge.js',{data:result([old,['deleted'],recent])});
  assert.equal(json.expectedRows,1); assert.equal(json.writeBody.data[0].range,"'Inscriptions'!A2:L2");
  assert.deepEqual(await run('sheets-purge.js',{data:result([recent])}),[]);
  await assert.rejects(run('sheets-confirm-purge.js',{plan:json,data:{error:'quota'}}),/purge failed/);
  assert.deepEqual((await run('sheets-confirm-purge.js',{plan:json,data:{totalUpdatedRows:1}}))[0].json,{removed:1});
});
test('Sheets : graphe complet, stockage OAuth privé, aucune conservation des exécutions',async()=>{
  const workflow=await buildSheetsWorkflow();
  assert.deepEqual(JSON.parse(await readFile(new URL('./nearly-waitlist.sheets.workflow.json',import.meta.url),'utf8')),workflow);
  assert.equal(workflow.active,false); assert.equal(workflow.nodes.length,24);
  assert.equal(workflow.settings.saveExecutionProgress,false);
  assert.equal(workflow.settings.saveDataErrorExecution,'none'); assert.equal(workflow.settings.saveManualExecutions,false);
  assert.ok(!workflow.nodes.some(node=>['n8n-nodes-base.readWriteFile'].includes(node.type)));
  const google=workflow.nodes.filter(node=>node.parameters.nodeCredentialType==='googleSheetsOAuth2Api');
  assert.equal(google.length,5);
  assert.ok(google.every(node=>node.parameters.authentication==='predefinedCredentialType' && node.onError==='continueRegularOutput'));
  assert.match(google.find(node=>node.name==='Ajouter l’inscription').parameters.url,/valueInputOption=RAW&insertDataOption=INSERT_ROWS/);
  const names=new Set(workflow.nodes.map(node=>node.name));
  for(const [source,connection] of Object.entries(workflow.connections)) {
    assert.ok(names.has(source)); for(const output of connection.main) for(const edge of output) assert.ok(names.has(edge.node));
  }
  assert.deepEqual(workflow.connections['Anti-robots validé ?'].main[0].map(edge=>edge.node),['Configuration Sheets']);
});
