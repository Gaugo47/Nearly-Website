# Publication sur hellonearly.com

Adresse principale : `https://hellonearly.com/`. Le domaine reste chez OVH ; GitHub Pages héberge l'export statique. `www.hellonearly.com` redirige vers le domaine principal.

## Préparer GitHub

Avec GitHub Free, GitHub Pages nécessite un dépôt public. Pour garder le code privé, le propriétaire doit disposer d'une offre compatible (GitHub Pro pour ce compte personnel).

Compléter les variables Actions publiques de l'éditeur : `PUBLISHER_NAME`, `PUBLISHER_STATUS`, `PUBLISHER_ADDRESS`, `PUBLICATION_DIRECTOR`, `CONTACT_EMAIL`, et le SIRET dans `PUBLISHER_SIRET` si applicable. Définir `SITE_URL=https://hellonearly.com`.

La liste d'attente reste facultative. Pour publier la vitrine sans collecte pendant la préparation du stockage n8n, laisser `WAITLIST_API_URL` vide. Ne l'activer qu'après validation du stockage et du parcours inscription/désinscription. Les variables Turnstile peuvent rester configurées sans ouvrir la collecte.

## Vérifier la propriété du domaine

Dans les paramètres du **compte GitHub**, ouvrir **Pages → Add a domain**, entrer `hellonearly.com`, puis copier le nom et la valeur du TXT demandés par GitHub.

Dans **OVH → Web Cloud → Noms de domaine → hellonearly.com → Zone DNS**, ajouter ce TXT (la valeur est propre au compte ; ne pas en inventer). Revenir dans GitHub et cliquer sur **Verify** après propagation. Conserver ce TXT.

## Configurer Pages et les DNS

Après vérification, dans les paramètres du **dépôt** : **Pages → Source → GitHub Actions**, puis **Custom domain → hellonearly.com**.

Dans la zone DNS OVH, remplacer uniquement les entrées Web incompatibles après sauvegarde de la zone. Ne pas réinitialiser toute la zone et conserver les entrées de messagerie (MX, SPF, DKIM et DMARC).

| Type | Sous-domaine OVH | Cible |
| --- | --- | --- |
| A | vide (racine) | `185.199.108.153` |
| A | vide (racine) | `185.199.109.153` |
| A | vide (racine) | `185.199.110.153` |
| A | vide (racine) | `185.199.111.153` |
| AAAA | vide (racine) | `2606:50c0:8000::153` |
| AAAA | vide (racine) | `2606:50c0:8001::153` |
| AAAA | vide (racine) | `2606:50c0:8002::153` |
| AAAA | vide (racine) | `2606:50c0:8003::153` |
| CNAME | `www` | `gaugo47.github.io.` |

Le CNAME ne comporte ni protocole ni nom de dépôt. Un workflow GitHub Actions n'a pas besoin de fichier `CNAME` dans le code source. GitHub gère la redirection entre le domaine principal et `www` lorsque les deux sont correctement configurés.

## Activer et vérifier

Chaque push sur `main` lance les vérifications puis publie automatiquement le site si elles réussissent. Pour republier manuellement, dans **Actions → Verify and publish GitHub Pages → Run workflow**, sélectionner `main` et `publish=true`. Après propagation DNS et émission du certificat, activer **Enforce HTTPS** dans Pages.

Vérifier le HTTPS, la redirection de `www`, les six pages, leurs images, liens et métadonnées, puis les démonstrations. Si la collecte est activée, tester une inscription et sa désinscription, ainsi que le refus d'un challenge invalide. Ne pas confondre un build réussi avec une intégration n8n validée.

Références : [offres GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [vérification du domaine](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages), [DNS GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [zone DNS OVH](https://docs.ovhcloud.com/fr/guides/web-cloud/domains/dns-zone-edit).
