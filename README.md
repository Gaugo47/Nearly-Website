# Nearly — site vitrine

Site français de présentation de Nearly, avec questions de couple, calculateur de frais et pages légales. L’export Next.js est entièrement statique et compatible avec GitHub Pages, y compris sous `/Nearly-Website/`.

## Développement et vérification

Node.js 22.13 ou supérieur, npm :

```sh
npm ci
npm run dev
npm run lint
npm test
npm run typecheck
npm run check:public
```

`npm run build` produit `out/`. `npm start` sert cet export sur `http://localhost:3000`. Pour prévisualiser exactement GitHub Pages, copier `.env.example` en `.env.local` avant de construire et définir aussi `NEXT_PUBLIC_BASE_PATH=/Nearly-Website` dans le terminal de prévisualisation. `.env.local` est ignoré.

Le workflow vérifie automatiquement les modifications de `main` et les pull requests. **Chaque push sur `main` publie automatiquement le site**, après réussite des contrôles de configuration publique, de confidentialité, du lint, de la compilation, des tests et de TypeScript. Les pull requests exécutent les vérifications sans publier.

## Publier sur GitHub Pages

1. Compléter les informations publiques de l’éditeur dans **Settings → Secrets and variables → Actions → Variables** : `PUBLISHER_NAME`, `PUBLISHER_STATUS`, `PUBLISHER_ADDRESS`, `PUBLICATION_DIRECTOR`, `CONTACT_EMAIL`. Ces valeurs apparaîtront sur le site et dans les artefacts ; utiliser les coordonnées professionnelles destinées à être publiques. Les obligations applicables à l’éditeur restent à vérifier avant publication.
2. Dans **Settings → Pages → Build and deployment → Source**, sélectionner **GitHub Actions**.
3. Pousser les modifications sur `main` pour lancer les vérifications et la publication automatique. Pour republier manuellement, dans **Actions → Verify and publish GitHub Pages → Run workflow**, choisir `main` et cocher `publish`. Sans cette case, le lancement manuel effectue uniquement les vérifications ; la publication reste réservée à `main`.
4. L’adresse par défaut est `https://gaugo47.github.io/Nearly-Website/`. Le workflow calcule le chemin à partir du nom du dépôt ; les images, liens, pages, sitemap et métadonnées utilisent ce chemin.

Le site peut être publié avec des informations d’éditeur incomplètes : les champs absents sont affichés comme non communiqués. Le formulaire s’ouvre seulement lorsqu’une URL HTTPS valide et une clé publique Turnstile sont configurées.

Le contact public par défaut est `support@hellonearly.com` et le directeur de la publication est Gauthier DEFOY. Les variables `CONTACT_EMAIL` et `PUBLICATION_DIRECTOR` permettent de les remplacer. La page `/contact/` est accessible sans connexion, liée depuis le pied de page et incluse dans le sitemap. Après publication sur le domaine final, l’URL d’assistance à renseigner dans App Store Connect est `https://hellonearly.com/contact/`. La page autorise l’indexation ; son apparition dans les moteurs dépend de leur exploration du site.

Le domaine final est `hellonearly.com`. Configurer le domaine dans Settings → Pages et ajouter `SITE_URL=https://hellonearly.com` aux variables Actions. Le workflow en déduit automatiquement un chemin vide. Suivre [les étapes OVH et GitHub](docs/publication-hellonearly.md) pour vérifier le domaine, configurer les DNS et le HTTPS. Reconstruire après tout changement d’adresse. Ne pas ajouter un fichier CNAME contenant un domaine dont vous n’êtes pas propriétaire.

Le numéro SIRET public de l'éditeur peut être renseigné dans `PUBLISHER_SIRET` ; il est affiché dans les mentions légales. Les identifiants administratifs personnels et les secrets restent hors du site.

Références : [export statique Next.js](https://nextjs.org/docs/app/guides/static-exports), [publication par Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Démonstrations

### Parcours du site

L’accueil présente les amis, la famille et le couple avec trois espaces de même importance et un aperçu interactif de leurs captures réelles. Les fonctionnalités communes, Party, Spicy et la confidentialité ont chacun une section visible ; un sommaire permet d’y accéder directement. La FAQ et l’inscription suivent cette présentation. Les essais sont regroupés dans `/outils/` : questions de couple, test de jeu dans `/tester-un-jeu/` et calculateur de remboursement. La navigation commune permet de passer de la présentation aux activités sans mélanger les deux parcours. Les liens des anciennes sections de démonstration de l’accueil restent accessibles via des renvois vers les outils.

### Captures de l’application

Les images du site sont des fichiers copiés dans `public/media`, indépendants du dépôt de l’application. Les onze captures réelles du 1er octobre et les deux accueils amis et famille du 2 octobre sont pris depuis `localhost:8081` en JPEG natif de 393 × 758 pixels. La barre d’état (59 pixels) et l’indicateur d’accueil (34 pixels) complètent le format d’écran 393 × 852 dans le composant `IPhoneMockup`. Le cadre garde ce rapport largeur/hauteur ; les captures ne sont pas étirées.

Pour importer ce lot, utiliser `npm run screenshots:sync`. Le script lit par défaut le dossier local `work/iphone-captures`, ignoré par Git ; un autre dossier peut être fourni avec `npm run screenshots:sync -- "chemin/vers/captures"`. Il vérifie le format des treize images avant copie et met à jour les versions de cache selon le contenu des quatorze visuels. Construire puis déployer le site après synchronisation.

La capture `app-party-photos.png` est conservée à la demande du propriétaire. Elle garde son fichier original et s’affiche en entier, sans déformation, dans le même cadre. Aucun code secret n’est saisi ou affiché dans les captures du coffre Spicy verrouillé.

Les frais, pseudonymes et questions tirées restent dans le stockage de session de l’onglet, sans base de données et sans empreinte IP créée par Nearly. Les limites de trois frais et quatre questions sont des limites de démonstration côté navigateur. Effacer la session permet un nouvel essai. Les navigateurs peuvent restaurer une session après fermeture.

Les conversions de devises interrogent directement l’API publique Frankfurter. Aucun prénom ni montant n’est transmis à ce fournisseur. Le calcul en euros fonctionne sans service de taux ; une conversion indisponible affiche une erreur et ne substitue pas un taux fictif.

## Statistiques de visite (facultatives)

Cloudflare Web Analytics est compatible avec cet export statique, sans changement DNS, serveur supplémentaire ni cookies publicitaires. Dans le compte Cloudflare, ouvrir **Web Analytics → Add a site**, ajouter `hellonearly.com` puis copier uniquement le token public de 32 caractères du script `data-cf-beacon`. Définir la variable Actions `CLOUDFLARE_ANALYTICS_TOKEN` (ou `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` localement), reconstruire et publier. Ne pas activer une injection automatique en parallèle : le site contrôle lui-même le consentement.

Le bandeau propose Accepter et Refuser avec le même poids visuel. Aucun beacon n’est chargé avant acceptation. Le choix est conservé 180 jours dans le stockage local, sans identifiant visiteur, et modifiable dans le pied de page. Retirer son accord recharge la page pour arrêter le script en cours ; les autres onglets appliquent aussi le changement. Les pages légales, les URL avec paramètres et les prévisualisations locales sont exclues. L’outil mesure les visites, pages, provenance et performances ; il ne mesure pas les clics personnalisés ni les conversions. Le nombre exact de nouvelles inscriptions se lit séparément dans le tableau Google Sheets privé, sans croiser les personnes avec les visites. Sans token valide, les statistiques et le bandeau sont désactivés.

Références : [mise en place Cloudflare](https://developers.cloudflare.com/web-analytics/get-started/), [limites et données](https://developers.cloudflare.com/web-analytics/faq/), [CNIL : mesure d’audience et consentement](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience).

## Liste d’attente (facultative)

GitHub Pages ne peut pas recevoir ni conserver des inscriptions. Par défaut, le formulaire et la désinscription sont désactivés et aucune adresse n’est collectée.

Les formulaires envoient directement leurs demandes au webhook public n8n : aucune passerelle ni serveur supplémentaire. Suivre [n8n/SHEETS.md](n8n/SHEETS.md), connecter Google Sheets et Gmail, puis définir `WAITLIST_API_URL` et `TURNSTILE_SITE_KEY` (clé publique). Renseigner les informations publiques disponibles, notamment `WAITLIST_HOST`. La collecte reste désactivée tant que l’URL ou la clé manque. La vérification anti-robots est obligatoire côté n8n. Un remerciement Gmail avec lien de désinscription suit chaque nouvel ajout confirmé ; les doublons ne déclenchent aucun envoi.

Le stockage retenu est un tableau Google Sheets privé. La connexion Google et la clé secrète Turnstile restent uniquement dans les identifiants n8n. La désinscription exige un lien personnel ; une nouvelle demande publique ne remplace jamais les réponses ni le lien d’une adresse existante. Les secrets ne doivent jamais apparaître dans GitHub Pages, dans le navigateur ou dans une variable `NEXT_PUBLIC_*`. L’ancienne variante CSV reste documentée dans `n8n/README.md`.

## Publication du dépôt et confidentialité

Les fichiers locaux des assistants, identifiants de l’ancien hébergement, bases, CSV, logs, fichiers d’environnement et sorties de compilation sont exclus. L’ancienne implémentation serveur est conservée uniquement dans `work/legacy-server/`, ignoré par Git.

```sh
npm run check:public
node scripts/check-public.mjs --history
npm audit
```

Le premier contrôle analyse les sources et l’export ; le second examine les objets des branches, étiquettes et références distantes ainsi que les adresses des auteurs (les captures locales privées de Codex sont exclues). Il signale les valeurs sans les afficher. Ce contrôle ciblé ne garantit pas l’absence de tout secret imaginable.

L’historique assaini a été publié sur GitHub : les adresses personnelles des auteurs ont été remplacées par leurs adresses GitHub noreply et les fichiers d’hébergement privés ont été retirés. GitHub Support a confirmé la purge des anciens objets et des vues en cache ; la vérification du 1er octobre 2026 ne retrouve plus les trois anciens commits contrôlés. Dependabot est configuré.

Utiliser l’historique actuel pour les prochains changements et conserver la sauvegarde de l’ancien historique hors du dépôt public. Les contrôles disponibles sur GitHub, notamment la détection de secrets, peuvent compléter les vérifications locales.

Les visuels et textes Nearly restent soumis à leurs droits respectifs. Le dépôt ne fournit aucune licence générale de réutilisation.
