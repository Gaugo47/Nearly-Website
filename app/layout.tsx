import type { Metadata, Viewport } from "next";
import { siteUrl, sitePath, absoluteUrl } from "./site";
import "./globals.css";
import AnalyticsConsent from "./AnalyticsConsent";

export const metadata: Metadata = {
    metadataBase: new URL(`${siteUrl}/`),
    title: {
      default: "Nearly — Proches, même à distance",
      template: "%s | Nearly",
    },
    description:
      "Vos amis, votre famille, votre couple : un espace privé pour chaque lien. Nearly rapproche vos proches avec des rituels, des souvenirs et des moments partagés.",
    applicationName: "Nearly",
    keywords: [
      "application couple à distance",
      "application relationnelle",
      "hub relationnel privé",
      "hub pour couple amis famille",
      "rester proche à distance",
      "application couple",
      "application amis",
      "application famille",
      "party mode amis",
      "application soirée entre amis",
      "souvenirs partagés",
      "questions de couple",
      "jeux pour couple à distance",
      "mode spicy couple privé",
      "application conversations chiffrées",
      "photos privées chiffrées",
      "protection anti screenshot",
    ],
    authors: [{ name: "Nearly" }],
    creator: "Nearly",
    publisher: "Nearly",
    category: "Lifestyle",
    alternates: { canonical: `${siteUrl}/` },
    openGraph: {
      type: "website",
      url: `${siteUrl}/`,
      locale: "fr_FR",
      siteName: "Nearly",
      title: "Nearly — Proches, même à distance",
      description:
        "Les liens qui comptent. Même de loin. Un espace privé pour vos amis, votre famille et votre couple, avec des rituels et des souvenirs à partager.",
      images: [{ url: absoluteUrl("/og.png"), width: 1536, height: 902, alt: "Nearly — Proches, même à distance" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Nearly — Proches, même à distance",
      description:
        "Votre bande, votre famille, votre moitié. Un espace pour chaque lien, où que la vie vous emmène.",
      images: [absoluteUrl("/og.png")],
    },
    icons: {
      icon: sitePath("/media/nearly-icon.png"),
      apple: sitePath("/media/nearly-icon.png"),
    },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf6ef",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body><AnalyticsConsent>{children}</AnalyticsConsent></body>
    </html>
  );
}
