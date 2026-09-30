// Informations légales affichées dans les pages RGPD et le formulaire de liste d'attente.
// Les variables NEXT_PUBLIC_* sont publiées dans le site : aucun secret ici.
export const legal = {
  productName: "Nearly",
  controllerName: process.env.NEXT_PUBLIC_PUBLISHER_NAME || "Éditeur à renseigner avant publication",
  controllerStatus: process.env.NEXT_PUBLIC_PUBLISHER_STATUS || "Statut à renseigner avant publication",
  controllerAddress: process.env.NEXT_PUBLIC_PUBLISHER_ADDRESS || "Adresse à renseigner avant publication",
  publicationDirector: process.env.NEXT_PUBLIC_PUBLICATION_DIRECTOR || "Direction de publication à renseigner",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Contact à renseigner avant publication",
  siteHost: "GitHub Pages — GitHub, Inc. (https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement)",
  automationHost: process.env.NEXT_PUBLIC_WAITLIST_HOST || "Non activé",
  policyVersion: "2026-09-30",
  lastUpdated: "30 septembre 2026",
  retentionMonths: 36,
};

export const waitlistReasons = [
  { value: "couple-distance", label: "Couple à distance" },
  { value: "couple", label: "Vie de couple" },
  { value: "amis", label: "Groupe d’amis" },
  { value: "famille", label: "Famille" },
  { value: "curiosite", label: "Simple curiosité" },
] as const;

export type WaitlistReason = (typeof waitlistReasons)[number]["value"];

export const WAITLIST_EXPECTATIONS_MAX = 600;

export const legalReady = Boolean(process.env.NEXT_PUBLIC_PUBLISHER_NAME && process.env.NEXT_PUBLIC_PUBLISHER_STATUS && process.env.NEXT_PUBLIC_PUBLISHER_ADDRESS && process.env.NEXT_PUBLIC_PUBLICATION_DIRECTOR && process.env.NEXT_PUBLIC_CONTACT_EMAIL && process.env.NEXT_PUBLIC_WAITLIST_HOST);
