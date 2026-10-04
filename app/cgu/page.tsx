import { absoluteUrl, sitePath } from "../site";
import type { Metadata } from "next";
import LegalLayout from "../LegalLayout";
import AppLegalSections, { appSections, appTermsDate } from "../AppLegalSections";
import { APP_TERMS_VERSION } from "../app-legal-content";

export const metadata: Metadata = {
  title: "Conditions générales d’utilisation de l’application",
  description: "Les conditions d’utilisation de l’application Nearly : compte, espaces privés, abonnements, données personnelles et vos droits.",
  alternates: { canonical: absoluteUrl("/cgu/") },
};

export default function AppTermsPage() {
  return (
    <LegalLayout
      current="/cgu"
      eyebrow="Application · Conditions"
      title={<>Conditions générales<br /><em>d’utilisation.</em></>}
      intro="Le texte que vous acceptez en créant votre compte Nearly, identique à celui affiché dans l’application."
      updated={`${appTermsDate()} (version ${APP_TERMS_VERSION})`}
    >
      <p className="legal-callout">
        La partie consacrée à vos données est aussi publiée seule sur la page{" "}
        <a href={sitePath("/confidentialite-app/")}>Confidentialité de l’application</a>.
      </p>
      <AppLegalSections sections={appSections()} />
    </LegalLayout>
  );
}
