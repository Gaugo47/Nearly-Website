// Génère n8n/nearly-waitlist.workflow.json à partir des sources des nœuds Code.
// Usage : node n8n/build-workflow.mjs
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const CSV_PATH = "/home/node/.n8n-files/nearly-waitlist.csv";
const here = (path) => new URL(path, import.meta.url);

// Identifiants stables pour que chaque régénération produise le même fichier.
function stableId(name) {
  const hex = createHash("sha256").update(`nearly-waitlist:${name}`).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

export async function codeNodeSource(file) {
  const [helpers, body] = await Promise.all([
    readFile(here("./src/csv-helpers.js"), "utf8"),
    readFile(here(`./src/${file}`), "utf8"),
  ]);
  return `${helpers.trim()}\n\n${body.trim()}\n`;
}

function node(name, type, typeVersion, position, parameters, extra = {}) {
  return { id: stableId(name), name, type, typeVersion, position, parameters, ...extra };
}

function headerAuth(credentialName) {
  return { httpHeaderAuth: { id: stableId(`credential:${credentialName}`), name: credentialName } };
}

export async function buildWorkflow() {
  const nodes = [
    node("Webhook inscription", "n8n-nodes-base.webhook", 2, [0, 0], {
      httpMethod: "POST",
      path: "nearly-waitlist",
      authentication: "headerAuth",
      responseMode: "responseNode",
      options: {},
    }, { webhookId: stableId("webhook:subscribe"), credentials: headerAuth("Nearly – jeton du site") }),
    node("Lire le CSV", "n8n-nodes-base.readWriteFile", 1, [240, 0], {
      fileSelector: CSV_PATH,
      options: {},
    }, { alwaysOutputData: true }),
    node("Traiter la demande", "n8n-nodes-base.code", 2, [480, 0], {
      mode: "runOnceForAllItems",
      jsCode: await codeNodeSource("process-request.js"),
    }),
    node("Fichier à écrire ?", "n8n-nodes-base.if", 2, [720, 0], {
      conditions: {
        options: { caseSensitive: true, leftValue: "", typeValidation: "strict" },
        conditions: [{
          id: stableId("condition:write"),
          leftValue: "={{ $json.write }}",
          rightValue: true,
          operator: { type: "boolean", operation: "true", singleValue: true },
        }],
        combinator: "and",
      },
      options: {},
    }),
    node("Écrire le CSV", "n8n-nodes-base.readWriteFile", 1, [960, -100], {
      operation: "write",
      fileName: CSV_PATH,
      dataPropertyName: "data",
      options: { append: "={{ $('Traiter la demande').first().json.append }}" },
    }),
    node("Répondre au site", "n8n-nodes-base.respondToWebhook", 1.1, [1200, 0], {
      respondWith: "json",
      responseBody: "={{ $('Traiter la demande').first().json.response }}",
      options: { responseCode: "={{ $('Traiter la demande').first().json.statusCode }}" },
    }),

    node("Chaque nuit à 3 h", "n8n-nodes-base.scheduleTrigger", 1.2, [0, 320], {
      rule: { interval: [{ field: "days", triggerAtHour: 3 }] },
    }),
    node("Lire le CSV (purge)", "n8n-nodes-base.readWriteFile", 1, [240, 320], {
      fileSelector: CSV_PATH,
      options: {},
    }, { alwaysOutputData: true }),
    node("Supprimer les inscriptions expirées", "n8n-nodes-base.code", 2, [480, 320], {
      mode: "runOnceForAllItems",
      jsCode: await codeNodeSource("purge-expired.js"),
    }),
    node("Réécrire le CSV (purge)", "n8n-nodes-base.readWriteFile", 1, [720, 320], {
      operation: "write",
      fileName: CSV_PATH,
      dataPropertyName: "data",
      options: { append: false },
    }),

    node("Webhook export", "n8n-nodes-base.webhook", 2, [0, 600], {
      httpMethod: "GET",
      path: "nearly-waitlist-export",
      authentication: "headerAuth",
      responseMode: "responseNode",
      options: {},
    }, { webhookId: stableId("webhook:export"), credentials: headerAuth("Nearly – jeton d’export") }),
    node("Lire le CSV (export)", "n8n-nodes-base.readWriteFile", 1.1, [240, 600], {
      fileSelector: CSV_PATH,
      options: {},
    }),
    node("Télécharger le CSV", "n8n-nodes-base.respondToWebhook", 1.1, [480, 600], {
      respondWith: "binary",
      responseDataSource: "set",
      inputFieldName: "data",
      options: {
        responseHeaders: {
          entries: [
            { name: "Content-Type", value: "text/csv; charset=utf-8" },
            { name: "Content-Disposition", value: "attachment; filename=\"nearly-waitlist.csv\"" },
            { name: "Cache-Control", value: "no-store" },
          ],
        },
      },
    }),

    node("À lire", "n8n-nodes-base.stickyNote", 1, [-80, -300], {
      width: 620,
      height: 240,
      content: [
        "## Liste d’attente Nearly",
        "1. Créez deux identifiants **Header Auth** : nom d’en-tête `X-Nearly-Token`, valeur = un long secret (site / export).",
        "2. Sélectionnez-les dans « Webhook inscription » et « Webhook export ».",
        `3. Le CSV est écrit dans \`${CSV_PATH}\` (montez ce dossier en volume Docker).`,
        "4. Activez le workflow puis copiez l’URL de production du webhook dans `N8N_WAITLIST_WEBHOOK_URL` côté site.",
        "Les exécutions réussies ne sont pas conservées (RGPD) : voir Paramètres du workflow.",
      ].join("\n"),
    }),
  ];

  const main = (...targets) => ({ main: targets.map((list) => list.map((target) => ({ node: target, type: "main", index: 0 }))) });

  return {
    name: "Nearly – Liste d’attente (CSV)",
    nodes,
    connections: {
      "Webhook inscription": main(["Lire le CSV"]),
      "Lire le CSV": main(["Traiter la demande"]),
      "Traiter la demande": main(["Fichier à écrire ?"]),
      "Fichier à écrire ?": main(["Écrire le CSV"], ["Répondre au site"]),
      "Écrire le CSV": main(["Répondre au site"]),
      "Chaque nuit à 3 h": main(["Lire le CSV (purge)"]),
      "Lire le CSV (purge)": main(["Supprimer les inscriptions expirées"]),
      "Supprimer les inscriptions expirées": main(["Réécrire le CSV (purge)"]),
      "Webhook export": main(["Lire le CSV (export)"]),
      "Lire le CSV (export)": main(["Télécharger le CSV"]),
    },
    active: false,
    settings: {
      executionOrder: "v1",
      saveDataSuccessExecution: "none",
      saveDataErrorExecution: "all",
      saveManualExecutions: false,
      timezone: "Europe/Paris",
    },
    pinData: {},
    meta: { templateCredsSetupCompleted: false },
    tags: [],
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const workflow = await buildWorkflow();
  await writeFile(here("./nearly-waitlist.workflow.json"), `${JSON.stringify(workflow, null, 2)}\n`);
  console.log("n8n/nearly-waitlist.workflow.json généré.");
}
