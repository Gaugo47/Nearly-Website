import { pageAlternates } from "../../language";
import type { Metadata } from "next";
import LegalLayout from "../../LegalLayout";
import WaitlistUnsubscribe from "../../WaitlistUnsubscribe";
import { analyticsToken, waitlistReady } from "../../site";
import { AnalyticsSettingsButton } from "../../AnalyticsConsent";
import { legal } from "../../legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment Nearly collecte, utilise et protège les données de la liste d’attente et du site, conformément au RGPD.",
  alternates: pageAlternates("/confidentialite/"),
};

const retentionYears = legal.retentionMonths / 12;

export default function PrivacyPage() {
  return (
    <LegalLayout
      current="/confidentialite"
      eyebrow="RGPD · Vos données"
      title={<>Politique de<br /><em>confidentialité.</em></>}
      intro="Nous collectons le strict nécessaire, nous l’utilisons uniquement pour ce que nous annonçons ici, et vous gardez la main à tout moment."
    >
      {!waitlistReady && <p className="legal-callout">La liste d’attente est actuellement désactivée. Les traitements d’inscription décrits ci-dessous ne seront activés qu’à son ouverture.</p>}
      <section className="legal-summary" aria-label="L’essentiel">
        <div><strong>Le strict minimum</strong><span>Un e-mail, votre motivation et, si vous le souhaitez, vos attentes.</span></div>
        <div><strong>Aucune revente</strong><span>Vos données ne sont ni vendues, ni louées, ni utilisées pour de la publicité.</span></div>
        <div><strong>Effacées du tableau actif</strong><span>Au plus tard {retentionYears} ans après l’inscription, ou dès votre désinscription.</span></div>
      </section>

      <section>
        <h2>1. Qui est responsable de vos données ?</h2>
        <p>
          Le responsable du traitement est <strong>{legal.controllerName}</strong>, éditeur du site et de l’application {legal.productName},
          {" "}{legal.controllerAddress}. Pour toute question relative à vos données : <strong>{legal.contactEmail}</strong>.
        </p>
      </section>

      <section>
        <h2>2. Quelles données, pour quoi faire, et sur quelle base ?</h2>
        <div className="legal-table" role="table" aria-label="Traitements de données">
          <div role="row" className="legal-table__head">
            <span role="columnheader">Traitement</span>
            <span role="columnheader">Données</span>
            <span role="columnheader">Base légale</span>
            <span role="columnheader">Durée</span>
          </div>
          <div role="row">
            <span role="cell"><strong>Liste d’attente</strong> : vous prévenir du lancement et vous envoyer des nouvelles de Nearly.</span>
            <span role="cell">Adresse e-mail, motif d’intérêt, attentes (facultatif), date d’inscription, version de la politique acceptée.</span>
            <span role="cell">Votre consentement (art. 6.1.a RGPD).</span>
            <span role="cell">Jusqu’à votre désinscription et au plus {legal.retentionMonths} mois après l’inscription.</span>
          </div>
          <div role="row">
            <span role="cell"><strong>Amélioration du produit</strong> : analyser vos attentes pour prioriser les fonctionnalités.</span>
            <span role="cell">Motif d’intérêt et attentes, étudiés de façon groupée.</span>
            <span role="cell">Votre consentement (art. 6.1.a RGPD).</span>
            <span role="cell">Même durée que la liste d’attente.</span>
          </div>
          <div role="row">
            <span role="cell"><strong>Bêta et retours</strong> : vous inviter à tester Nearly ou à répondre à un court questionnaire.</span>
            <span role="cell">Adresse e-mail, uniquement si vous avez coché la case facultative.</span>
            <span role="cell">Votre consentement distinct (art. 6.1.a RGPD).</span>
            <span role="cell">Jusqu’au retrait de ce consentement ou à la désinscription.</span>
          </div>
          <div role="row">
            <span role="cell"><strong>Démos du site</strong> (frais partagés, questions de couple) : faire fonctionner les essais dans votre navigateur.</span>
            <span role="cell">Prénoms ou pseudonymes, dépenses et questions tirées, conservés uniquement dans le stockage de session de votre navigateur. Aucune empreinte IP créée par Nearly.</span>
            <span role="cell">Fonctionnement de la démonstration demandée.</span>
            <span role="cell">Jusqu’à la fermeture de l’onglet ou à l’effacement du stockage de session. Le navigateur peut restaurer cette session après un redémarrage.</span>
          </div>
          <div role="row">
            <span role="cell"><strong>Sécurité et hébergement</strong> : faire fonctionner le site et détecter les attaques.</span>
            <span role="cell">Journaux techniques (adresse IP, navigateur, date, page demandée).</span>
            <span role="cell">Intérêt légitime (art. 6.1.f RGPD).</span>
            <span role="cell">Selon la politique de confidentialité de GitHub, hébergeur du site.</span>
          </div>
        </div>
        <p>
          Le formulaire vous invite à ne communiquer <strong>aucune donnée sensible</strong> (santé, vie ou orientation sexuelle, opinions, religion…).
          Si de telles informations nous parvenaient malgré tout dans le champ « attentes », elles seraient supprimées dès que nous en aurions connaissance.
          Aucune décision automatisée ni aucun profilage produisant des effets juridiques n’est réalisé à partir de vos réponses.
        </p>
      </section>

      <section>
        <h2>3. Comment vos données circulent-elles ?</h2>
        <p>
          Lorsque vous validez le formulaire, vos réponses sont transmises en connexion chiffrée (HTTPS) directement à notre outil d’automatisation <strong>n8n</strong>.
          Celui-ci vérifie les champs, les consentements et la preuve anti-robots avant toute inscription. n8n enregistre l’inscription dans un tableau
          Google Sheets privé, non accessible publiquement et consulté uniquement par l’équipe {legal.productName}.
          Une désinscription efface les données de la ligne correspondante, et une tâche quotidienne efface automatiquement les inscriptions
          de plus de {legal.retentionMonths} mois.
        </p>
        <p>Ces effacements concernent le tableau actif. Des versions antérieures peuvent subsister dans l’historique du prestataire ou les sauvegardes ; leur conservation est gérée séparément. Le remerciement et son lien personnel sont également conservés dans les messageries de l’expéditeur et du destinataire ; la désinscription n’efface pas ces copies.</p>
      </section>

      <section>
        <h2>4. Qui peut y accéder ?</h2>
        <p>Seule l’équipe {legal.productName} a accès à vos données. Elles sont hébergées par des prestataires qui agissent uniquement sur nos instructions (sous-traitants au sens de l’article 28 du RGPD) :</p>
        <ul>
          <li><strong>Hébergement du site</strong> : {legal.siteHost}</li>
          <li><strong>Automatisation</strong> : {legal.automationHost}</li>
          <li><strong>Stockage de la liste</strong> : Google Sheets (Google).</li>
          <li><strong>Protection anti-robots</strong> : Cloudflare Turnstile. La vérification reçoit des données techniques de connexion et un jeton temporaire ; les réponses du formulaire et votre e-mail ne sont pas transmis à Cloudflare par n8n.</li>
          <li><strong>E-mail de remerciement</strong> : Gmail (Google), via n8n, après une nouvelle inscription. Le message contient votre lien personnel de désinscription ; vos réponses au formulaire n’y figurent pas.</li>
        </ul>
        <p>
          Vos données ne sont jamais vendues, louées ni cédées à des fins commerciales. Si un prestataire est situé hors de l’Union européenne,
          le transfert est encadré par une décision d’adéquation (par exemple le Data Privacy Framework UE–États-Unis) ou par les clauses
          contractuelles types de la Commission européenne.
        </p>
      </section>

      <section>
        <h2>5. Comment sont-elles protégées ?</h2>
        <p>
          Chiffrement des échanges (HTTPS), vérification anti-robots côté n8n, validation stricte des données reçues,
          accès au tableau restreint à l’équipe et liens personnels de désinscription. Nous ne conservons ni votre nom, ni votre adresse IP avec votre inscription.
        </p>
      </section>

      <section>
        <h2>6. Vos droits</h2>
        <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez à tout moment des droits suivants :</p>
        <ul>
          <li><strong>Retirer votre consentement</strong>, aussi simplement que vous l’avez donné, sans que cela remette en cause les traitements déjà effectués ;</li>
          <li><strong>Accès</strong> à vos données et obtention d’une copie ;</li>
          <li><strong>Rectification</strong> de données inexactes ;</li>
          <li><strong>Effacement</strong> de vos données ;</li>
          <li><strong>Limitation</strong> et <strong>opposition</strong> au traitement ;</li>
          <li><strong>Portabilité</strong> : recevoir vos données dans un format structuré (CSV) ;</li>
          <li><strong>Directives post-mortem</strong> sur le sort de vos données après votre décès.</li>
        </ul>
        <p>
          Pour les exercer, utilisez le formulaire ci-dessous ou écrivez à <strong>{legal.contactEmail}</strong>. Nous répondons dans un délai d’un mois.
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL
          (3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — <a href="https://www.cnil.fr/fr/plaintes" rel="noopener noreferrer" target="_blank">cnil.fr/plaintes</a>).
        </p>
      </section>

      <section id="desinscription" className="legal-callout">
        <h2>Quitter la liste d’attente</h2>
        <p>Utilisez votre lien personnel pour supprimer votre inscription et toutes les réponses associées. Une adresse e-mail seule ne permet pas de supprimer l’inscription d’un tiers.</p>
        <WaitlistUnsubscribe />
      </section>

      <section id="statistiques">
        <h2>7. Cookies et traceurs</h2>
        {analyticsToken ? <>
          <p>
            Avec votre <strong>consentement facultatif</strong>, Cloudflare Web Analytics mesure les visites, les pages consultées,
            les sites d’origine du trafic et les performances techniques (base légale : art. 6.1.a RGPD).
            Son script est chargé uniquement après « Accepter ». Il n’utilise pas de cookies publicitaires et ne suit pas votre navigation entre différents sites.
            Aucun e-mail, aucune réponse au formulaire et aucun lien personnel de désinscription ne sont envoyés par Nearly à cet outil.
            Les pages légales et les adresses contenant des paramètres sont exclues de cette mesure.
          </p>
          <p>
            Cloudflare reçoit les informations techniques nécessaires à la requête et fournit des statistiques agrégées, consultables pendant six mois.
            Les données ne sont pas rapprochées des inscriptions Google Sheets. Votre acceptation ou votre refus est mémorisé dans le stockage local du navigateur
            pendant 180 jours, sans identifiant de visiteur. Vous pouvez le modifier à tout moment via « Choix des statistiques » en bas de page ;
            le retrait arrête les mesures futures après rechargement. Refuser ne bloque aucune fonctionnalité du site.
            {" "}<a href="https://developers.cloudflare.com/web-analytics/about/" target="_blank" rel="noopener noreferrer">À propos de Cloudflare Web Analytics</a>.
          </p>
          <AnalyticsSettingsButton />
        </> : <p>La mesure d’audience est désactivée : aucun script de statistiques n’est chargé.</p>}
        <p>
          Le site n’utilise <strong>aucun cookie publicitaire</strong>. Les démonstrations utilisent le stockage de
          session de votre navigateur pour retrouver les données dans le même onglet. Elles ne sont pas envoyées à Nearly ; vous pouvez les
          effacer depuis les réglages du navigateur. Après inscription, un reçu contenant votre adresse et votre lien personnel de désinscription peut être conservé localement pour retrouver ce lien. Il est effacé lors de la désinscription ; après 36 mois, il n’est plus utilisé et est effacé à la prochaine consultation. Vous pouvez aussi le supprimer depuis les réglages du navigateur. Cloudflare Turnstile est chargé uniquement lorsque le formulaire est activé pour vérifier les interactions humaines (<a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">politique Cloudflare</a>). Pour une conversion de devises, le navigateur interroge <a href="https://frankfurter.dev/" target="_blank" rel="noopener noreferrer">Frankfurter</a> :
          le fournisseur reçoit les codes de devises et les informations techniques de connexion, mais aucun prénom ni aucune dépense.
        </p>
      </section>

      <section>
        <h2>8. Mineurs</h2>
        <p>
          La liste d’attente est réservée aux personnes âgées d’au moins 15 ans, âge à partir duquel un mineur peut consentir seul au traitement
          de ses données en France. Le mode Spicy de l’application est, lui, strictement réservé aux adultes.
        </p>
      </section>

      <section>
        <h2>9. Évolution de cette politique</h2>
        <p>
          Nous pouvons faire évoluer cette politique, par exemple lors du choix d’un prestataire d’envoi d’e-mails. La date de mise à jour figure en
          haut de page. Chaque inscription enregistre la version du consentement à la liste d’attente (version actuelle : {legal.policyVersion}) ;
          le choix relatif aux statistiques est distinct. En cas de changement important concernant la liste d’attente,
          vous serez informé·e par e-mail avant son application.
        </p>
      </section>
    </LegalLayout>
  );
}
