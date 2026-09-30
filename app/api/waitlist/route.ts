import { getRuntimeVar } from "../../../db";
import { legal, waitlistReasons, WAITLIST_EXPECTATIONS_MAX } from "../../legal";

const EMAIL_PATTERN = /^(?![=+\-@])[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[a-z]{2,}$/i;
const MIN_FILL_MS = 1500;
const WEBHOOK_TIMEOUT_MS = 8000;

type SignupPayload = {
  email?: unknown;
  reason?: unknown;
  expectations?: unknown;
  consentLaunch?: unknown;
  consentFeedback?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : null;
}

function cleanText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n").trim();
}

function looksAutomated(payload: SignupPayload) {
  if (typeof payload.website === "string" && payload.website.trim()) return true;
  return typeof payload.startedAt === "number" && Date.now() - payload.startedAt < MIN_FILL_MS;
}

async function sendToN8n(body: Record<string, unknown>) {
  const url = getRuntimeVar("N8N_WAITLIST_WEBHOOK_URL");
  const token = getRuntimeVar("N8N_WAITLIST_TOKEN");
  if (!url || !token) return "unconfigured" as const;

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-nearly-token": token },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });
  return response.ok ? "ok" as const : "failed" as const;
}

function unavailable(result: "unconfigured" | "failed") {
  return Response.json(
    { error: "La liste d’attente est momentanément indisponible. Réessayez dans quelques minutes." },
    { status: result === "unconfigured" ? 503 : 502 },
  );
}

export async function POST(request: Request) {
  let payload: SignupPayload;
  try {
    payload = await request.json() as SignupPayload;
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Les robots reçoivent la même réponse qu'une inscription réussie, sans que rien ne soit transmis.
  if (looksAutomated(payload)) return Response.json({ joined: true });

  const email = normalizeEmail(payload.email);
  if (!email) return Response.json({ error: "Indiquez une adresse e-mail valide.", field: "email" }, { status: 400 });

  const reason = waitlistReasons.find((option) => option.value === payload.reason);
  if (!reason) return Response.json({ error: "Choisissez ce qui vous amène sur Nearly.", field: "reason" }, { status: 400 });

  const expectations = cleanText(payload.expectations);
  if (expectations.length > WAITLIST_EXPECTATIONS_MAX) {
    return Response.json({ error: `Vos attentes doivent tenir en ${WAITLIST_EXPECTATIONS_MAX} caractères.`, field: "expectations" }, { status: 400 });
  }

  if (payload.consentLaunch !== true) {
    return Response.json({ error: "Votre accord est nécessaire pour vous prévenir du lancement.", field: "consentLaunch" }, { status: 400 });
  }

  try {
    const result = await sendToN8n({
      action: "subscribe",
      email,
      reason: reason.value,
      reasonLabel: reason.label,
      expectations,
      consentLaunch: true,
      consentFeedback: payload.consentFeedback === true,
      policyVersion: legal.policyVersion,
      consentAt: new Date().toISOString(),
      source: "site-web",
    });
    if (result !== "ok") return unavailable(result);
    return Response.json({ joined: true }, { status: 201 });
  } catch {
    return unavailable("failed");
  }
}

export async function DELETE(request: Request) {
  let payload: { email?: unknown };
  try {
    payload = await request.json() as { email?: unknown };
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = normalizeEmail(payload.email);
  if (!email) return Response.json({ error: "Indiquez une adresse e-mail valide.", field: "email" }, { status: 400 });

  try {
    const result = await sendToN8n({ action: "unsubscribe", email, requestedAt: new Date().toISOString(), source: "site-web" });
    if (result !== "ok") return unavailable(result);
    // Même réponse que l'adresse soit inscrite ou non, pour ne rien révéler sur la liste.
    return Response.json({ removed: true });
  } catch {
    return unavailable("failed");
  }
}
