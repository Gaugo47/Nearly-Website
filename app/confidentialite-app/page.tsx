import { absoluteUrl, sitePath } from "../site";
import type { Metadata } from "next";
import LegalLayout from "../LegalLayout";
import AppLegalSections, { appSections, appTermsDate } from "../AppLegalSections";
import { APP_TERMS_VERSION } from "../app-legal-content";

export const metadata: Metadata = {
  title: "Politique de confidentialité de l’application",
  description: "Quelles données l’application Nearly traite, pourquoi, avec quels prestataires, combien de temps, et comment exercer vos droits.",
  alternates: { canonical: absoluteUrl("/confidentialite-app/") },
};

/** Publisher, personal data, retention, rights and deletion: the privacy part of the app's terms. */
const PRIVACY_SECTIONS = [1, 8, 9, 10, 11] as const;

export default function AppPrivacyPage() {
  return (
    <LegalLayout
      current="/confidentialite-app"
      eyebrow="Application · Vos données"
      title={<>Confidentialité de<br /><em>l’application.</em></>}
      intro="Comment l’application Nearly traite vos données, conformément au RGPD. Ce texte fait partie des conditions que vous acceptez dans l’application."
      updated={`${appTermsDate()} (version ${APP_TERMS_VERSION})`}
    >
      <p className="legal-callout">
        Cette page concerne l’application. Les données de la liste d’attente et du site sont décrites dans la{" "}
        <a href={sitePath("/confidentialite/")}>politique de confidentialité du site</a>. Le texte complet se trouve dans les{" "}
        <a href={sitePath("/cgu/")}>conditions générales d’utilisation</a>.
      </p>
      <AppLegalSections sections={appSections(PRIVACY_SECTIONS)} />
    </LegalLayout>
  );
}
