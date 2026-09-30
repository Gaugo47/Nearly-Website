import { absoluteUrl } from "../site";
import type { Metadata } from "next";
import LegalLayout from "../LegalLayout";
import WaitlistUnsubscribe from "../WaitlistUnsubscribe";
import { waitlistEndpoint } from "../site";
import { legal } from "../legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Comment Nearly collecte, utilise et protège les données de la liste d’attente et du site, conformément au RGPD.",
  alternates: { canonical: absoluteUrl("/confidentialite/") },
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
      {!waitlistEndpoint && <p className="legal-callout">La liste d’attente est actuellement désactivée. Les traitements d’inscription décrits ci-dessous ne seront activés qu’à son ouverture.</p>}
      <section className="legal-summary" aria-label="L’essentiel">
        <div><strong>Le strict minimum</strong><span>Un e-mail, votre motivation et, si vous le souhaitez, vos attentes.</span></div>
        <div><strong>Aucune revente</strong><span>Vos données ne sont ni vendues, ni louées, ni utilisées pour de la publicité.</span></div>
        <div><strong>Supprimées automatiquement</strong><span>Au plus tard {retentionYears} ans après l’inscription, ou dès votre désinscription.</span></div>
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
          Lorsque vous validez le formulaire, vos réponses sont transmises en connexion chiffrée (HTTPS) à un service externe de liste d’attente, qui les vérifie puis
          les envoie à notre outil d’automatisation <strong>n8n</strong>, protégé par un jeton secret. n8n enregistre l’inscription dans un fichier
          CSV stocké sur un serveur privé, non accessible publiquement et consulté uniquement par l’équipe {legal.productName}.
          Une désinscription supprime la ligne correspondante de ce fichier, et une tâche quotidienne efface automatiquement les inscriptions
          de plus de {legal.retentionMonths} mois.
        </p>
      </section>

      <section>
        <h2>4. Qui peut y accéder ?</h2>
        <p>Seule l’équipe {legal.productName} a accès à vos données. Elles sont hébergées par des prestataires qui agissent uniquement sur nos instructions (sous-traitants au sens de l’article 28 du RGPD) :</p>
        <ul>
          <li><strong>Hébergement du site</strong> : {legal.siteHost}</li>
          <li><strong>Automatisation et stockage de la liste</strong> : {legal.automationHost}</li>
          <li><strong>Envoi des e-mails</strong> : le prestataire d’envoi retenu au lancement sera ajouté ici avant tout envoi.</li>
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
          Chiffrement des échanges (HTTPS), jeton secret entre le service de liste d’attente et n8n, validation stricte des données reçues, filtrage des robots,
          accès au fichier restreint à l’équipe et minimisation : nous ne conservons ni votre nom, ni votre adresse IP avec votre inscription.
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
        <p>Indiquez l’adresse utilisée lors de l’inscription : elle sera supprimée de la liste avec toutes les réponses associées.</p>
        <WaitlistUnsubscribe />
      </section>

      <section>
        <h2>7. Cookies et traceurs</h2>
        <p>
          Le site n’utilise <strong>aucun cookie publicitaire ni outil de mesure d’audience</strong>. Les démonstrations utilisent le stockage de
          session de votre navigateur pour retrouver les données dans le même onglet. Elles ne sont pas envoyées à Nearly ; vous pouvez les
          effacer depuis les réglages du navigateur. Pour une conversion de devises, le navigateur interroge <a href="https://frankfurter.dev/" target="_blank" rel="noopener noreferrer">Frankfurter</a> :
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
          haut de page et chaque inscription enregistre la version acceptée (version actuelle : {legal.policyVersion}). En cas de changement important,
          vous serez informé·e par e-mail avant son application.
        </p>
      </section>
    </LegalLayout>
  );
}
