import type { Metadata } from "next";
import LegalLayout from "../LegalLayout";
import { legal } from "../legal";
import { absoluteUrl, sitePath } from "../site";

const title = "Contact et assistance";
const description = "Contactez le support Nearly pour une question sur l’application, votre compte, un problème technique ou vos données personnelles.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/contact/") },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${title} | Nearly`,
    description,
    url: absoluteUrl("/contact/"),
  },
  twitter: { title: `${title} | Nearly`, description },
};

export default function ContactPage() {
  return (
    <LegalLayout
      current="/contact"
      eyebrow="Nearly · Assistance"
      title={<>Une question ?<br /><em>Écrivez-nous.</em></>}
      intro="Une question sur Nearly, un souci avec votre compte ou une idée à partager ? Contactez notre équipe par e-mail."
      updated="8 octobre 2026"
    >
      <section className="legal-callout">
        <h2>Contacter le support Nearly</h2>
        <p>
          Pour toute demande d’assistance concernant l’application Nearly ou le site,
          écrivez à <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
        </p>
        <p>Cette adresse est aussi disponible pour vos retours et suggestions.</p>
      </section>

      <section>
        <h2>Signaler un problème</h2>
        <p>Pour nous aider à comprendre votre demande, précisez dans votre e-mail :</p>
        <ul>
          <li>Le problème rencontré et les étapes pour le reproduire.</li>
          <li>Le modèle de votre appareil, la version d’iOS ou d’Android et la version de Nearly.</li>
          <li>Le message d’erreur affiché, le cas échéant.</li>
        </ul>
        <p>Ne communiquez jamais votre mot de passe, vos codes de connexion ou le code de votre coffre privé.</p>
      </section>

      <section>
        <h2>Votre compte et vos données</h2>
        <p>
          Pour une demande concernant votre compte, sa suppression ou vos données personnelles,
          contactez <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a> en décrivant votre demande.
          Retrouvez les informations sur vos droits dans la{" "}
          <a href={sitePath("/confidentialite-app/")}>politique de confidentialité de l’application</a>.
        </p>
      </section>

      <section>
        <h2>Informations utiles</h2>
        <p>
          Consultez les <a href={sitePath("/cgu/")}>conditions générales d’utilisation de Nearly</a>,
          les <a href={sitePath("/mentions-legales/")}>mentions légales du site</a> ou
          les <a href={sitePath("/#faq")}>questions fréquentes</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
