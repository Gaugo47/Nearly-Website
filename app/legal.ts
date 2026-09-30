// Informations légales affichées dans les pages RGPD et le formulaire de liste d'attente.
// Les valeurs entre crochets doivent être complétées avant la mise en ligne.
export const legal = {
  productName: "Nearly",
  controllerName: "[Nom et prénom ou raison sociale de l’éditeur]",
  controllerStatus: "[Statut : particulier, auto-entrepreneur, SAS… et n° SIREN le cas échéant]",
  controllerAddress: "[Adresse postale de l’éditeur]",
  publicationDirector: "[Nom du directeur de la publication]",
  contactEmail: "[adresse e-mail de contact RGPD]",
  siteHost: "[Hébergeur du site : nom, adresse et téléphone]",
  automationHost: "[Hébergeur de l’instance n8n : nom et pays]",
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
