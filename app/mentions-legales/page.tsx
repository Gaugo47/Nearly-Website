
import { absoluteUrl, sitePath } from "../site";
import type { Metadata } from "next";
import LegalLayout from "../LegalLayout";
import { legal } from "../legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergement et propriété intellectuelle du site Nearly.",
  alternates: { canonical: absoluteUrl("/mentions-legales/") },
};

export default function LegalNoticePage() {
  return (
    <LegalLayout
      current="/mentions-legales"
      eyebrow="Informations légales"
      title={<>Mentions<br /><em>légales.</em></>}
      intro="Les informations disponibles sur l’éditeur et l’hébergement du site Nearly."
    >
      <section>
        <h2>Éditeur du site</h2>
        <p>
          <strong>{legal.controllerName}</strong><br />
          {legal.controllerStatus}<br />
          {legal.controllerSiret && <>SIRET : {legal.controllerSiret}<br /></>}
          {legal.controllerAddress}<br />
          Contact : <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>
        </p>
        <p>Directeur de la publication : {legal.publicationDirector}.</p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>Site : {legal.siteHost}.</p>
        <p>Outil d’automatisation de la liste d’attente (n8n) : {legal.automationHost}.</p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Le nom {legal.productName}, les logos, visuels, captures d’écran et textes du site sont protégés. Toute reproduction ou réutilisation sans
          autorisation préalable est interdite, sauf dans les limites prévues par la loi.
        </p>
      </section>

      <section>
        <h2>Données personnelles</h2>
        <p>
          Le traitement des données collectées sur ce site est décrit dans la <a href={sitePath("/confidentialite")}>politique de confidentialité</a>. La liste
          d’attente est régie par ses propres <a href={sitePath("/conditions-liste-attente")}>conditions</a>.
        </p>
      </section>
    </LegalLayout>
  );
}
