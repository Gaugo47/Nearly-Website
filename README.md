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

Le workflow vérifie automatiquement les modifications de `main` et les pull requests. **La publication est manuelle** : aucun push ne met le site en ligne.

## Publier sur GitHub Pages

1. Compléter les informations publiques de l’éditeur dans **Settings → Secrets and variables → Actions → Variables** : `PUBLISHER_NAME`, `PUBLISHER_STATUS`, `PUBLISHER_ADDRESS`, `PUBLICATION_DIRECTOR`, `CONTACT_EMAIL`. Ces valeurs apparaîtront sur le site et dans les artefacts ; utiliser les coordonnées professionnelles destinées à être publiques. Les obligations applicables à l’éditeur restent à vérifier avant publication.
2. Dans **Settings → Pages → Build and deployment → Source**, sélectionner **GitHub Actions**.
3. Dans **Actions → Verify and publish GitHub Pages → Run workflow**, choisir `main` et cocher `publish`.
4. L’adresse par défaut est `https://gaugo47.github.io/Nearly-Website/`. Le workflow calcule le chemin à partir du nom du dépôt ; les images, liens, pages, sitemap et métadonnées utilisent ce chemin.

La publication est bloquée si les informations d’éditeur ci-dessus sont absentes ; une simple compilation reste possible.

Pour un domaine personnalisé, configurer le domaine dans Settings → Pages et ajouter `SITE_URL=https://votre-domaine.fr` aux variables Actions. Le workflow en déduit automatiquement un chemin vide. Reconstruire après tout changement d’adresse. Ne pas ajouter un fichier CNAME contenant un domaine dont vous n’êtes pas propriétaire.

Références : [export statique Next.js](https://nextjs.org/docs/app/guides/static-exports), [publication par Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Démonstrations

Les frais, pseudonymes et questions tirées restent dans le stockage de session de l’onglet, sans base de données et sans empreinte IP créée par Nearly. Les limites de trois frais et quatre questions sont des limites de démonstration côté navigateur. Effacer la session permet un nouvel essai. Les navigateurs peuvent restaurer une session après fermeture.

Les conversions de devises interrogent directement l’API publique Frankfurter. Aucun prénom ni montant n’est transmis à ce fournisseur. Le calcul en euros fonctionne sans service de taux ; une conversion indisponible affiche une erreur et ne substitue pas un taux fictif.

## Liste d’attente (facultative)

GitHub Pages ne peut pas recevoir ni conserver des inscriptions. Par défaut, le formulaire et la désinscription sont désactivés et aucune adresse n’est collectée.

Pour ouvrir les inscriptions, héberger séparément la passerelle [n8n/gateway.mjs](n8n/gateway.mjs) et le workflow n8n décrit dans [n8n/README.md](n8n/README.md), puis définir `WAITLIST_API_URL` et `WAITLIST_HOST` en plus des informations légales. Le site n’active la collecte que si cette configuration publique est complète et l’URL en HTTPS.

Les secrets `N8N_WAITLIST_TOKEN` et `N8N_WAITLIST_WEBHOOK_URL` appartiennent exclusivement au serveur de la passerelle. Ne jamais les placer dans GitHub Pages, dans le navigateur ou dans une variable `NEXT_PUBLIC_*`.

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
