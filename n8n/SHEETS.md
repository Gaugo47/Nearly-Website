# Liste d’attente dans Google Sheets

Importer `nearly-waitlist.sheets.workflow.json` comme **workflow distinct et inactif**. Cette variante utilise la connexion Google Sheets n8n ; elle ne nécessite ni fichier CSV sur le serveur, ni passerelle. La variante CSV reste disponible pour les anciennes installations.

## Tableau et identifiants

Créer un tableau privé, onglet **Inscriptions**, avec exactement ces douze en-têtes en A1:L1 :

```text
created_at, updated_at, email, reason, reason_label, expectations, consent_launch, consent_feedback, policy_version, consent_at, source, management_token
```

1. Renseigner l’identifiant du tableau dans **Configuration Sheets** et **Configuration Sheets (purge)**. Le tableau et ses données restent privés ; ne pas publier de liens donnant accès aux inscriptions.
2. Sélectionner l’identifiant **Google Sheets OAuth2** dans les cinq nœuds de requête Google. Ces nœuds HTTP utilisent l’API Sheets avec la connexion n8n existante. Les jetons OAuth restent dans le coffre d’identifiants n8n.
3. Sélectionner le **Custom Auth** contenant `body.secret` dans **Vérifier Turnstile**, comme dans la variante CSV. Aucun secret dans un nœud Code ni dans Git.
4. Vérifier dans **Settings** : exécutions réussies, en erreur, manuelles et progression **Do not save**. Le collage du JSON dans le canevas ne configure pas ces paramètres automatiquement.
5. Connecter le compte Gmail d’envoi au nœud **Envoyer le remerciement**. Le message est envoyé uniquement après un nouvel ajout confirmé par Google Sheets, après la réponse au site. Aucun envoi aux doublons, désinscriptions ou demandes refusées. Une panne Gmail conserve l’inscription et ne change pas le résultat du formulaire ; pas de relance automatique de l’envoi.
6. Le domaine autorisé est `https://hellonearly.com`. Il doit aussi être autorisé dans Turnstile. Ne pas activer simultanément deux workflows ayant le chemin de webhook `nearly-waitlist-public`.

## Écritures et effacement

Les nouvelles inscriptions passent par `values.append`, `INSERT_ROWS` et `RAW`. Elles s’ajoutent en fin de tableau ; les champs ressemblant à des formules sont également neutralisés pour un export CSV ultérieur. Une adresse déjà présente conserve ses réponses et son jeton. Une panne Google, un quota dépassé ou un en-tête modifié produit une erreur générique 503, jamais un faux succès.

Une désinscription exige le jeton personnel de 64 caractères hexadécimaux. Toutes les données de la ligne correspondante sont remplacées par des cellules vides ; seul le marqueur technique **deleted** reste en colonne A. La purge quotidienne à 3 h applique le même effacement aux inscriptions de plus de 36 mois. Les lignes gardent leur position afin que deux demandes ne décalent pas les références des autres inscriptions. Les erreurs de purge arrêtent son exécution.

**Ne pas trier, insérer ou supprimer physiquement les lignes de l’onglet alimenté par n8n.** Utiliser des vues filtrées et ignorer les lignes dont A vaut `deleted`. Un tableau modifié ou troué bloque les écritures. Le journal des versions Google et les sauvegardes peuvent conserver des versions antérieures : leur conservation doit être gérée séparément. L’effacement des cellules concerne le tableau courant, pas toutes ses anciennes versions.

Chaque e-mail doit inclure le lien individuel `https://hellonearly.com/confidentialite/#token=JETON`, comme le remerciement Gmail. Le tableau contient ces jetons privés ; ne jamais partager son accès public. L’export CSV se fait directement depuis Google Sheets : cette variante n’expose aucun webhook d’export supplémentaire. Les messages envoyés restent aussi dans Gmail : l’effacement de la ligne Sheets ne supprime pas les copies de l’expéditeur ou du destinataire.

## Concurrence et vérification avant ouverture

L’ajout Google évite les réécritures d’un fichier local complet. **La lecture suivie de l’ajout n’est toutefois pas une transaction : deux demandes simultanées pour la même nouvelle adresse peuvent créer un doublon.** Pour garantir la déduplication et éviter qu’une désinscription croise une nouvelle inscription de la même adresse, faire sérialiser les exécutions de production par l’administrateur n8n (`N8N_CONCURRENCY_PRODUCTION_LIMIT=1` pour une instance standard unique), en coordination avec les autres workflows. Ne pas exécuter manuellement d’écritures pendant les traitements de production. Pour une forte activité ou plusieurs workers, utiliser une base transactionnelle avec une contrainte d’unicité.

Avant publication, tester sur un tableau de test : première inscription, doublon, autre adresse, désinscription, lien inconnu, challenge invalide, erreurs Google et purge. Vérifier que les anciennes versions et journaux sont gérés selon la politique annoncée. Configurer ensuite les variables GitHub `WAITLIST_API_URL`, `TURNSTILE_SITE_KEY`, `WAITLIST_HOST` et les coordonnées légales, puis reconstruire le site.

```sh
npm run n8n:build
node --test n8n/*.test.mjs
```

Références : [ajout Google Sheets](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append), [écriture de plages](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate), [contrôle de concurrence n8n](https://docs.n8n.io/hosting/scaling/concurrency-control/).
