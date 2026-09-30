import type { Metadata, Viewport } from "next";
import { siteUrl, sitePath, absoluteUrl } from "./site";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(`${siteUrl}/`),
    title: {
      default: "Nearly — Proches, même à distance",
      template: "%s | Nearly",
    },
    description:
      "Nearly est le hub relationnel privé des couples, amis et familles pour se sentir proches malgré la distance : rituels, souvenirs, jeux et moments partagés.",
    applicationName: "Nearly",
    keywords: [
      "application couple à distance",
      "application relationnelle",
      "hub relationnel privé",
      "hub pour couple amis famille",
      "rester proche à distance",
      "application couple",
      "application amis",
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
        "Le hub privé qui réunit votre couple, vos meilleurs amis et votre famille pour rester proches malgré la distance.",
      images: [{ url: absoluteUrl("/og.png"), width: 1536, height: 902, alt: "Nearly — Proches, même à distance" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Nearly — Proches, même à distance",
      description:
        "Un seul hub privé pour prendre soin de votre couple, de vos amis et de votre famille, où que vous soyez.",
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
      <body>{children}</body>
    </html>
  );
}
