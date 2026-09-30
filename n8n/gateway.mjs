// Separate server: never deployed to GitHub Pages. Keep its environment private.
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
const reasons = { "couple-distance": "Couple à distance", couple: "Vie de couple", amis: "Groupe d’amis", famille: "Famille", curiosite: "Simple curiosité" };
export function createGateway(env = process.env, forward = fetch) {
  const origin = new URL(env.WAITLIST_ALLOWED_ORIGIN).origin;
  const webhook = new URL(env.N8N_WAITLIST_WEBHOOK_URL);
  if (webhook.protocol !== "https:" || !env.N8N_WAITLIST_TOKEN) throw new Error("HTTPS webhook and private token required");
  const limits = new Map();
  return createServer(async (req, res) => {
    res.setHeader("cache-control", "no-store");
    res.setHeader("x-content-type-options", "nosniff");
    const send = (status, data) => { res.writeHead(status, { "content-type": "application/json; charset=utf-8" }); res.end(JSON.stringify(data)); };
    if (req.headers.origin !== origin) { send(403, { error: "Origine non autorisée." }); return; }
    res.setHeader("access-control-allow-origin", origin);
    res.setHeader("vary", "Origin");
    res.setHeader("access-control-allow-methods", "POST, DELETE, OPTIONS");
    res.setHeader("access-control-allow-headers", "Content-Type");
    if (req.url !== "/waitlist") { send(404, { error: "Page introuvable." }); return; }
    if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
    if (!["POST", "DELETE"].includes(req.method)) { send(405, { error: "Méthode non autorisée." }); return; }
    if (!req.headers["content-type"]?.startsWith("application/json")) { send(415, { error: "JSON requis." }); return; }
    // In-memory throttle; use your reverse proxy's rate limiting for production.
    const now = Date.now();
    for (const [key, value] of limits) if (now - value.start > 60000) limits.delete(key);
    const key = req.socket.remoteAddress;
    const counter = limits.get(key) || { start: now, count: 0 };
    if (++counter.count > 10 || limits.size > 10000) { send(429, { error: "Réessayez dans une minute." }); return; }
    limits.set(key, counter);
    try {
      let raw = "";
      for await (const chunk of req) {
        raw += chunk.toString("utf8");
        if (Buffer.byteLength(raw) > 8192) { send(413, { error: "Requête trop volumineuse." }); return; }
      }
      let data;
      try { data = JSON.parse(raw); } catch { send(400, { error: "Requête invalide." }); return; }
      if (!data || typeof data !== "object" || Array.isArray(data)) { send(400, { error: "Requête invalide." }); return; }
      const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
      if (email.length > 254 || !/^(?![=+\-@])[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[a-z]{2,}$/i.test(email)) { send(400, { error: "Indiquez une adresse e-mail valide.", field: "email" }); return; }
      let payload = { action: "unsubscribe", email, requestedAt: new Date().toISOString(), source: "site-web" };
      if (req.method === "POST") {
        if (data.website || (typeof data.startedAt === "number" && now - data.startedAt < 1500)) { send(201, { joined: true }); return; }
        if (!Object.hasOwn(reasons, data.reason)) { send(400, { error: "Choisissez un motif.", field: "reason" }); return; }
        if (data.consentLaunch !== true) { send(400, { error: "Votre accord est nécessaire.", field: "consentLaunch" }); return; }
        const expectations = typeof data.expectations === "string" ? data.expectations.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") : "";
        if (expectations.length > 600) { send(400, { error: "600 caractères au maximum.", field: "expectations" }); return; }
        payload = { action: "subscribe", email, reason: data.reason, reasonLabel: reasons[data.reason], expectations, consentLaunch: true, consentFeedback: data.consentFeedback === true, policyVersion: "2026-09-30", consentAt: new Date().toISOString(), source: "site-web" };
      }
      const response = await forward(webhook.href, { method: "POST", headers: { "content-type": "application/json", "x-nearly-token": env.N8N_WAITLIST_TOKEN }, body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error("Upstream unavailable");
      send(req.method === "POST" ? 201 : 200, req.method === "POST" ? { joined: true } : { removed: true });
    } catch { send(502, { error: "La liste d’attente est momentanément indisponible." }); }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createGateway();
  server.requestTimeout = 10000;
  server.headersTimeout = 10000;
  server.listen(Number(process.env.PORT || 8787), "127.0.0.1", () => console.log("Waitlist gateway listening on loopback."));
}
