export type Receipt = { email: string; token: string; createdAt: number };
const receiptKey = "nearly-waitlist-receipt-v1";
const tokenPattern = /^[a-f0-9]{64}$/;
export function newManagementToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
export function readReceipt(): Receipt | null {
  try {
    const value = JSON.parse(localStorage.getItem(receiptKey) || "null");
    if (!value || typeof value.email !== "string" || typeof value.token !== "string" || !tokenPattern.test(value.token) || typeof value.createdAt !== "number") return null;
    const expiry = new Date(value.createdAt);
    expiry.setMonth(expiry.getMonth() + 36);
    if (!Number.isFinite(expiry.getTime()) || Date.now() > expiry.getTime()) { localStorage.removeItem(receiptKey); return null; }
    return value;
  } catch { return null; }
}
export function saveReceipt(value: Receipt) {
  try { localStorage.setItem(receiptKey, JSON.stringify(value)); } catch { /* The personal link remains available without storage. */ }
}
export function clearReceipt() {
  try { localStorage.removeItem(receiptKey); } catch { /* Storage can be unavailable. */ }
}
export function tokenFromFragment(fragment: string) {
  const token = new URLSearchParams(fragment.replace(/^#/, "")).get("token") || "";
  return tokenPattern.test(token) ? token : "";
}
export async function sendWaitlist(endpoint: string, payload: Record<string, unknown>) {
  // URL-encoded POST is a CORS simple request; no OPTIONS workflow is needed.
  const response = await fetch(endpoint, {
    method: "POST", credentials: "omit", signal: AbortSignal.timeout(15000),
    body: new URLSearchParams({ payload: JSON.stringify(payload) }),
  });
  const data = await response.json() as { ok?: boolean; error?: string };
  if (!response.ok || data.ok !== true) {
    const messages: Record<string, string> = {
      invalid_request: "Vérifiez les informations du formulaire.",
      challenge_failed: "La vérification anti-robots a expiré ou échoué. Réessayez.",
      invalid_link: "Ce lien ne permet pas de vous désinscrire. Utilisez votre lien initial ou contactez-nous.",
    };
    throw new Error(messages[data.error || ""] || "La demande n’a pas abouti. Réessayez dans un instant.");
  }
}
