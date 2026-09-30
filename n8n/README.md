# Liste d'attente Nearly → n8n → CSV

```
Formulaire (#liste-attente)
   │  POST HTTPS vers la passerelle externe (validation, anti-robots)
   ▼
Passerelle n8n/gateway.mjs ── POST + en-tête X-Nearly-Token ──▶ Webhook n8n « nearly-waitlist »
                                                       │
                                  Lire le CSV → Traiter la demande → Écrire le CSV → Réponse
                                                       │
                              /home/node/.n8n-files/nearly-waitlist.csv
```

Le workflow [`nearly-waitlist.workflow.json`](nearly-waitlist.workflow.json) contient trois branches :

| Branche | Déclencheur | Rôle |
| --- | --- | --- |
| Inscription / désinscription | `POST /webhook/nearly-waitlist` | Valide la requête, ajoute la ligne (ou la met à jour si l'e-mail existe déjà) ou la supprime (`action: "unsubscribe"`). |
| Purge RGPD | Tous les jours à 3 h | Supprime les inscriptions dont la dernière mise à jour date de plus de 36 mois. |
| Export | `GET /webhook/nearly-waitlist-export` | Télécharge le CSV (jeton d'export distinct). |

Colonnes du CSV (UTF-8 avec BOM, séparateur virgule) :
`created_at, updated_at, email, reason, reason_label, expectations, consent_launch, consent_feedback, policy_version, consent_at, source`.
Les cellules qui commencent par `= + - @` sont préfixées d'une apostrophe pour éviter l'injection de formules dans Excel / Sheets.

## Mise en place

Le workflow lit et écrit un fichier sur le disque : il faut une instance n8n **auto-hébergée** (n8n Cloud n'autorise pas l'accès au disque).

1. Démarrer n8n (ou utiliser votre instance existante en montant un volume sur `/home/node/.n8n-files`) :
   ```bash
   docker compose -f n8n/docker-compose.yml up -d
   ```
2. Dans n8n : **Workflows → Import from File** → `n8n/nearly-waitlist.workflow.json`.
3. Créer deux identifiants **Header Auth** (Credentials → New → Header Auth) :
   - `Nearly – jeton du site` : Name `X-Nearly-Token`, Value = un secret long (ex. `openssl rand -hex 32`) ;
   - `Nearly – jeton d’export` : Name `X-Nearly-Token`, Value = un **autre** secret.
   Les sélectionner dans les nœuds « Webhook inscription » et « Webhook export ».
4. Activer le workflow et copier l'**URL de production** du nœud « Webhook inscription ».
5. Héberger `n8n/gateway.mjs` sur un serveur Node.js séparé, derrière un reverse proxy HTTPS. Le serveur GitHub Pages ne peut pas exécuter cette passerelle.
   Variables privées sur CE serveur (jamais des variables `NEXT_PUBLIC_*`, jamais dans le dépôt) :
   ```
   WAITLIST_ALLOWED_ORIGIN=https://gaugo47.github.io
   N8N_WAITLIST_WEBHOOK_URL=https://n8n.votre-domaine.fr/webhook/nearly-waitlist
   N8N_WAITLIST_TOKEN=<secret du jeton du site>
   PORT=8787
   ```
   Démarrer avec `node n8n/gateway.mjs`. Le processus écoute uniquement sur `127.0.0.1`.
   Le reverse proxy doit exposer `/waitlist` en HTTPS, limiter les requêtes et la taille des corps. La passerelle valide l’origine, les champs et les consentements ; son limiteur en mémoire est adapté à une seule instance. CORS ne remplace pas une protection anti-abus au niveau du proxy.
6. Configurer la variable PUBLIQUE `WAITLIST_API_URL` dans GitHub Actions avec l’URL de cette passerelle, par exemple `https://inscriptions.votre-domaine.fr/waitlist`. Compléter toutes les variables d’éditeur et `WAITLIST_HOST` décrites dans le README principal, puis reconstruire le site.
   Tant que cette configuration est absente, le site ne présente aucun champ de collecte.

Le webhook d’export n’est jamais exposé via la passerelle. Les données CSV, identifiants n8n, sauvegardes et journaux restent hors du dépôt public.

Télécharger le CSV :

```bash
curl -H "X-Nearly-Token: <secret d'export>" -o nearly-waitlist.csv https://n8n.votre-domaine.fr/webhook/nearly-waitlist-export
```

## RGPD côté n8n

- Les exécutions réussies ne sont pas enregistrées (`saveDataSuccessExecution: none`) : les e-mails ne s'accumulent pas dans la base n8n. Les exécutions en erreur sont gardées pour le débogage et effacées après 7 jours avec `EXECUTIONS_DATA_MAX_AGE=168`.
- Le fichier CSV ne doit pas être servi publiquement ; sauvegardez le dossier `n8n/data/files` de façon chiffrée.
- La durée de conservation (36 mois) est définie dans `src/purge-expired.js` et doit rester alignée sur `retentionMonths` dans `app/legal.ts`.

## Modifier le workflow

Le code des nœuds est dans `src/` (les helpers CSV sont injectés en tête de chaque nœud Code). Après modification :

```bash
node n8n/build-workflow.mjs
```

```bash
node --test n8n/workflow.test.mjs
```
