import { pageAlternates } from "../language";
import type { Metadata, Viewport } from "next";
import { Caveat, Inter } from "next/font/google";
import { siteUrl, sitePath, absoluteUrl } from "../site";
import "../globals.css";
import AnalyticsConsent from "../AnalyticsConsent";
import { shareTitle, shareDescription, shareImage } from "../social-preview";

// Same typefaces as the App Store visuals, self-hosted at build time.
const inter = Inter({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], variable: "--font-inter", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: ["600"], variable: "--font-caveat", display: "swap" });

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
    alternates: pageAlternates("/"),
    openGraph: {
      type: "website",
      url: `${siteUrl}/`,
      locale: "en_GB",
      siteName: "Nearly",
      title: shareTitle,
      description: shareDescription,
      images: [{ url: absoluteUrl(shareImage), width: 1200, height: 630, alt: shareTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      images: [absoluteUrl(shareImage)],
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
    <html lang="fr" className={`${inter.variable} ${caveat.variable}`}>
      <body><AnalyticsConsent>{children}</AnalyticsConsent></body>
    </html>
  );
}
