# Formulaires GitHub Pages → n8n → CSV privé

Cette page décrit la variante historique CSV. Pour le stockage Google Sheets retenu pour Nearly, suivre [SHEETS.md](SHEETS.md).

Le navigateur appelle directement `POST /webhook/nearly-waitlist-public` sur l'instance n8n existante. Aucune passerelle ni hébergement supplémentaire.

Le workflow `nearly-waitlist.workflow.json` est importé **non publié**. Il comporte :

- une validation stricte de l'origine, du format, de la taille, des champs et des consentements avant accès au CSV ;
- une vérification Cloudflare Turnstile côté n8n (succès, hostname et action `waitlist`) pour les inscriptions ;
- une désinscription par jeton personnel aléatoire de 256 bits, sans suppression par simple adresse e-mail ;
- une purge quotidienne à 3 h, après 36 mois ;
- un export CSV protégé par un identifiant Header Auth distinct. Aucune donnée n'est renvoyée par le webhook public.

## Configurer Turnstile

Créer un widget **Managed** dans [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile), pour le hostname `hellonearly.com` (sans chemin). Le workflow vérifie par défaut cette origine exacte et ce hostname. `www.hellonearly.com` doit rediriger vers le domaine principal dans GitHub Pages. Pour des essais sur l'adresse GitHub, ajouter aussi `gaugo47.github.io` dans Turnstile et reconstruire le workflow avec `WAITLIST_ALLOWED_ORIGIN=https://gaugo47.github.io node n8n/build-workflow.mjs` ; ne pas mélanger le workflow d'essai avec celui du domaine final.

1. La **site key**, publique, va dans la variable GitHub Actions `TURNSTILE_SITE_KEY`.
2. La **secret key** reste dans n8n : créer un identifiant **Custom Auth**, nommé `Nearly – Turnstile`, avec ce JSON, en remplaçant la valeur directement dans n8n :

   ```json
   { "body": { "secret": "REMPLACER_DANS_N8N_SEULEMENT" } }
   ```

3. Associer cet identifiant au nœud **Vérifier Turnstile**. Si n8n propose une restriction de domaines, autoriser seulement `challenges.cloudflare.com` pour cet identifiant.

Le navigateur transmet uniquement le jeton temporaire du challenge. n8n n'envoie à Cloudflare ni l'e-mail ni les réponses. Toute vérification absente, expirée, réutilisée ou erronée est refusée. Ne jamais publier la clé secrète dans le workflow JSON ou une variable `NEXT_PUBLIC_*`.

Références : [validation serveur Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [Custom Auth n8n](https://docs.n8n.io/integrations/builtin/credentials/httprequest/#using-custom-auth).

## Installer le workflow

1. Sauvegarder le workflow actuel et le CSV privé avant toute migration. Importer le nouveau JSON comme workflow distinct pour préparer le raccordement. Ne pas activer simultanément deux tâches de purge sur le même CSV.
2. Associer l'identifiant Turnstile ci-dessus.
3. Créer un identifiant **Header Auth** pour **Webhook export**, Name `X-Nearly-Token`, Value = un secret long, différent de la clé Turnstile. Ne jamais utiliser l'URL d'export dans le site.
4. Vérifier un volume persistant, inscriptible, à `/home/node/.n8n-files`. Le CSV doit rester inaccessible depuis le Web. Le nœud de lecture version 1 accepte un fichier absent lors de la première inscription ; les autres erreurs de disque arrêtent le traitement.
5. **Sérialiser les exécutions qui modifient le CSV.** Pour une instance n8n unique en mode standard, configurer `N8N_CONCURRENCY_PRODUCTION_LIMIT=1` côté hébergement avant activation. Cela s'applique à toute l'instance ; ne pas modifier une instance partagée sans accord de son administrateur. Ne pas lancer manuellement des écritures pendant les exécutions de production. Pour plusieurs workers ou une instance à forte activité, remplacer le CSV par un stockage transactionnel avant publication.
6. Limiter au niveau du reverse proxy la taille des requêtes et leur fréquence. Turnstile et CORS ne limitent pas les connexions entrantes ni les exécutions rejetées ; les contrôles du workflow ne remplacent pas ces limites d'hébergement.
7. Après configuration et vérification, publier le workflow, puis renseigner les variables publiques GitHub Actions : `WAITLIST_API_URL=https://n8n.votre-domaine.fr/webhook/nearly-waitlist-public`, `TURNSTILE_SITE_KEY`, `WAITLIST_HOST` (identité du prestataire), ainsi que les coordonnées d'éditeur décrites dans le README principal. Reconstruire le site.

Les journaux d'exécution réussie, en erreur et manuelle de ce workflow ne sont pas conservés, pour éviter de stocker les e-mails et liens personnels dans n8n. Les journaux du serveur et les sauvegardes restent à gérer côté hébergement.

Référence pour la sérialisation : [contrôle de concurrence n8n](https://docs.n8n.io/deploy/host-n8n/configure-n8n/scaling/control-concurrency.md). Un collage dans le canevas importe les nœuds et connexions, mais pas tous les paramètres du workflow : vérifier explicitement **Settings → Save failed / successful / manual executions → Do not save**, puis sauvegarder.

## Contrat HTTP et désinscription

Le site utilise un POST `application/x-www-form-urlencoded`, contenant un champ `payload` JSON. Ce format ne nécessite pas de requête CORS OPTIONS supplémentaire. L'origine permise est explicite, jamais `*`, y compris dans les réponses d'erreur.

Inscription : `action: "subscribe"`, `email`, `reason`, `expectations`, `consentLaunch`, `consentFeedback`, `website` (piège robots vide), `startedAt`, `challengeToken`, `managementToken` (64 caractères hexadécimaux, générés par Web Crypto). Les libellés, dates et version de politique sont définis côté n8n. Réponse : `201 { "ok": true }`, identique pour une adresse déjà inscrite.

Désinscription : `action: "unsubscribe"`, `managementToken`. Aucun e-mail seul ne donne accès à cette action. Réponse identique pour un lien absent du CSV ou déjà supprimé : `200 { "ok": true }`. La suppression ne se produit que pour la ligne possédant le jeton.

Le lien personnel a la forme `https://hellonearly.com/confidentialite/#token=<management_token>`. Le fragment n'est pas envoyé à GitHub ni dans le Referer. L'ouverture du lien affiche un bouton de confirmation et ne supprime rien automatiquement. Un reçu local permet de retrouver ce lien dans le même navigateur ; le visiteur peut également conserver le lien ou demander une suppression par e-mail.

**Chaque e-mail envoyé ultérieurement doit inclure ce lien individuel**, issu du CSV privé. Ne jamais exposer l'export ni les jetons publiquement. Une adresse existante conserve ses réponses et son jeton initial ; une demande publique ne permet pas de les remplacer.

Le CSV comprend les colonnes historiques et une nouvelle colonne `management_token`. L'ancien en-tête est migré au premier ajout ou à la première purge qui réécrit le fichier, en préservant les lignes existantes. Une ancienne inscription sans jeton reste privée et se supprime sur demande adressée depuis l'e-mail inscrit ; ne pas lui attribuer un nouveau jeton sur simple demande publique.

## Développement et vérification

```sh
node n8n/build-workflow.mjs
node --test n8n/workflow.test.mjs
```

Les tests couvrent les refus avant écriture, les vérifications Turnstile, les tentatives de modification d'une autre inscription, les jetons de désinscription, la migration CSV, la neutralisation des formules et la purge. Une configuration réelle des identifiants et du proxy est nécessaire pour valider l'intégration de production.
