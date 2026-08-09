import { getD1 } from "../../../db";

const MAX_STATE_BYTES = 200_000;

type TrialRow = {
  state_json: string | null;
};

async function digest(value: string) {
  const bytes = new TextEncoder().encode(`nearly-expense-trial:v1:${value}`);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getClientIp(request: Request) {
  return request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "local-preview";
}

function validVisitorId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9-]{16,80}$/.test(value);
}

function parseState(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as { visitorId?: unknown };
    if (!validVisitorId(payload.visitorId)) {
      return Response.json({ error: "Identifiant d’essai invalide." }, { status: 400 });
    }

    const visitorHash = await digest(`visitor:${payload.visitorId}`);
    const ipHash = await digest(`ip:${getClientIp(request)}`);
    const d1 = getD1();
    const existingVisitor = await d1
      .prepare("SELECT state_json FROM expense_trials WHERE visitor_hash = ? LIMIT 1")
      .bind(visitorHash)
      .first<TrialRow>();

    if (existingVisitor) {
      await d1.prepare("UPDATE expense_trials SET last_seen_at = CURRENT_TIMESTAMP WHERE visitor_hash = ?").bind(visitorHash).run();
      return Response.json({ allowed: true, resumed: true, state: parseState(existingVisitor.state_json) });
    }

    const existingIp = await d1
      .prepare("SELECT state_json FROM expense_trials WHERE ip_hash = ? LIMIT 1")
      .bind(ipHash)
      .first<TrialRow>();

    if (existingIp) {
      return Response.json({ allowed: false, reason: "trial_already_used" }, { status: 409 });
    }

    try {
      await d1
        .prepare("INSERT INTO expense_trials (visitor_hash, ip_hash) VALUES (?, ?)")
        .bind(visitorHash, ipHash)
        .run();
    } catch {
      const retryVisitor = await d1
        .prepare("SELECT state_json FROM expense_trials WHERE visitor_hash = ? LIMIT 1")
        .bind(visitorHash)
        .first<TrialRow>();
      if (retryVisitor) {
        return Response.json({ allowed: true, resumed: true, state: parseState(retryVisitor.state_json) });
      }
      return Response.json({ allowed: false, reason: "trial_already_used" }, { status: 409 });
    }

    return Response.json({ allowed: true, resumed: false, state: null }, { status: 201 });
  } catch {
    return Response.json({ error: "L’essai est momentanément indisponible." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json() as { visitorId?: unknown; state?: unknown };
    if (!validVisitorId(payload.visitorId) || !payload.state || typeof payload.state !== "object" || Array.isArray(payload.state)) {
      return Response.json({ error: "Données d’essai invalides." }, { status: 400 });
    }

    const stateJson = JSON.stringify(payload.state);
    if (new TextEncoder().encode(stateJson).byteLength > MAX_STATE_BYTES) {
      return Response.json({ error: "La limite de l’essai est atteinte." }, { status: 413 });
    }

    const visitorHash = await digest(`visitor:${payload.visitorId}`);
    const result = await getD1()
      .prepare("UPDATE expense_trials SET state_json = ?, last_seen_at = CURRENT_TIMESTAMP WHERE visitor_hash = ?")
      .bind(stateJson, visitorHash)
      .run();

    if (!result.meta.changes) {
      return Response.json({ error: "Essai introuvable." }, { status: 404 });
    }
    return Response.json({ saved: true });
  } catch {
    return Response.json({ error: "La sauvegarde a échoué." }, { status: 500 });
  }
}
