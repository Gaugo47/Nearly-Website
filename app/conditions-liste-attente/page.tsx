
import { absoluteUrl, sitePath } from "../site";
import type { Metadata } from "next";
import LegalLayout from "../LegalLayout";
import { legal } from "../legal";

export const metadata: Metadata = {
  title: "Conditions de la liste d’attente",
  description: "Les règles simples de la liste d’attente Nearly : inscription gratuite, sans engagement, désinscription à tout moment.",
  alternates: { canonical: absoluteUrl("/conditions-liste-attente/") },
};

export default function WaitlistTermsPage() {
  return (
    <LegalLayout
      current="/conditions-liste-attente"
      eyebrow="Liste d’attente · Conditions"
      title={<>Conditions de la<br /><em>liste d’attente.</em></>}
      intro="Des règles courtes et claires : l’inscription est gratuite, sans engagement, et vous pouvez partir quand vous voulez."
    >
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions encadrent l’inscription à la liste d’attente de l’application {legal.productName}, éditée par {legal.controllerName}
          {" "}(ci-après « nous »). En cochant la case d’acceptation du formulaire, vous reconnaissez les avoir lues et acceptées.
        </p>
      </section>

      <section>
        <h2>2. Inscription</h2>
        <ul>
          <li>L’inscription est <strong>gratuite</strong> et <strong>sans engagement</strong> : elle ne vaut ni achat, ni abonnement, ni création de compte dans l’application.</li>
          <li>Elle est ouverte aux personnes âgées d’<strong>au moins 15 ans</strong>.</li>
          <li>Vous vous engagez à utiliser une adresse e-mail dont vous êtes titulaire et à ne pas inscrire un tiers sans son accord.</li>
          <li>Une seule inscription par adresse : une nouvelle inscription avec la même adresse met à jour vos réponses précédentes.</li>
        </ul>
      </section>

      <section>
        <h2>3. Ce que la liste d’attente vous apporte</h2>
        <p>
          Nous vous préviendrons par e-mail de l’ouverture de {legal.productName} et pourrons vous partager des nouvelles de son développement.
          Si vous l’avez accepté séparément, nous pourrons aussi vous proposer de tester une version bêta ou de donner votre avis.
        </p>
        <p>
          L’inscription ne garantit ni une date de lancement, ni un accès anticipé, ni le maintien des fonctionnalités présentées sur le site, qui
          peuvent évoluer d’ici l’ouverture. Les éventuelles conditions tarifaires de l’application seront présentées avant toute souscription.
        </p>
      </section>

      <section>
        <h2>4. Nos communications</h2>
        <p>
          Nous vous écrirons uniquement au sujet de {legal.productName}, avec une fréquence raisonnable. Chaque e-mail contiendra un lien de
          désinscription. Nous ne transmettons jamais votre adresse à des partenaires commerciaux.
        </p>
      </section>

      <section>
        <h2>5. Vos réponses et suggestions</h2>
        <p>
          Les motivations et attentes que vous partagez nous aident à construire l’application. Vous acceptez que nous puissions nous en inspirer
          librement pour améliorer {legal.productName}, sans contrepartie et sans obligation de les mettre en œuvre. Ne partagez pas d’informations
          confidentielles ou sensibles, ni de contenu illicite, injurieux ou portant atteinte aux droits d’autrui.
        </p>
      </section>

      <section>
        <h2>6. Désinscription et fin de la liste</h2>
        <p>
          Vous pouvez quitter la liste à tout moment, sans justification, depuis la <a href={sitePath("/confidentialite#desinscription")}>page confidentialité</a>,
          via le lien présent dans nos e-mails ou en écrivant à <strong>{legal.contactEmail}</strong>. Nous pouvons clore la liste d’attente, notamment
          après le lancement, ou retirer une inscription manifestement fausse, automatisée ou abusive. Les données sont alors supprimées selon la
          {" "}<a href={sitePath("/confidentialite")}>politique de confidentialité</a>.
        </p>
      </section>

      <section>
        <h2>7. Responsabilité</h2>
        <p>
          Nous faisons nos meilleurs efforts pour que le formulaire et nos communications fonctionnent correctement, sans pouvoir garantir une
          disponibilité permanente du site. Notre responsabilité ne saurait être engagée pour un dommage indirect lié à l’inscription, dans les
          limites prévues par la loi et sans préjudice de vos droits de consommateur.
        </p>
      </section>

      <section>
        <h2>8. Données personnelles</h2>
        <p>
          Le traitement de vos données est détaillé dans la <a href={sitePath("/confidentialite")}>politique de confidentialité</a> : ce que nous collectons, pourquoi,
          combien de temps (au plus {legal.retentionMonths} mois) et comment exercer vos droits.
        </p>
      </section>

      <section>
        <h2>9. Modification des conditions</h2>
        <p>
          Nous pouvons adapter ces conditions. La version applicable est celle publiée sur cette page ; en cas de changement important, les
          personnes inscrites en seront informées par e-mail et pourront se désinscrire si elles ne l’acceptent pas.
        </p>
      </section>

      <section>
        <h2>10. Droit applicable et litiges</h2>
        <p>
          Ces conditions sont soumises au droit français. En cas de difficulté, contactez-nous d’abord à <strong>{legal.contactEmail}</strong> afin de
          trouver une solution amiable. À défaut, le litige sera porté devant les juridictions compétentes, les consommateurs conservant le bénéfice
          des règles protectrices de leur pays de résidence.
        </p>
      </section>
    </LegalLayout>
  );
}
