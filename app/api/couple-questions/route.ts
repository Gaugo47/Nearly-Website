import { getD1 } from "../../../db";
import { purgeExpiredDemoData } from "../../../db/retention";

const MAX_QUESTIONS = 4;

async function digest(value: string) {
  const bytes = new TextEncoder().encode(`nearly-couple-questions:v1:${value}`);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getClientIp(request: Request) {
  return request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "local-preview";
}

type DrawRow = { question_count: number };

export async function POST(request: Request) {
  try {
    const ipHash = await digest(`ip:${getClientIp(request)}`);
    const d1 = getD1();
    await purgeExpiredDemoData(d1);
    const result = await d1
      .prepare(`INSERT INTO couple_question_trials (ip_hash, question_count)
        VALUES (?, 1)
        ON CONFLICT(ip_hash) DO UPDATE SET
          question_count = couple_question_trials.question_count + 1,
          last_seen_at = CURRENT_TIMESTAMP
        WHERE couple_question_trials.question_count < ?
        RETURNING question_count`)
      .bind(ipHash, MAX_QUESTIONS)
      .first<DrawRow>();

    if (!result) {
      return Response.json({ error: "quota_reached", remaining: 0 }, { status: 429 });
    }

    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    return Response.json({
      questionIndex: random[0] % 10,
      remaining: MAX_QUESTIONS - result.question_count,
    });
  } catch {
    return Response.json({ error: "Le tirage est momentanément indisponible." }, { status: 500 });
  }
}
