const CURRENCIES = new Set(["EUR", "USD", "GBP", "CHF", "THB"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const base = (url.searchParams.get("base") || "EUR").toUpperCase();
  const quote = (url.searchParams.get("quote") || "EUR").toUpperCase();

  if (!CURRENCIES.has(base) || !CURRENCIES.has(quote)) {
    return Response.json({ error: "Devise non prise en charge." }, { status: 400 });
  }
  if (base === quote) {
    return Response.json({ base, quote, rate: 1, date: new Date().toISOString().slice(0, 10) });
  }

  try {
    const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${base}&symbols=${quote}`, {
      signal: AbortSignal.timeout(5000),
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error("rate provider unavailable");
    const payload = await response.json() as { rates?: Record<string, number>; date?: string };
    const rate = Number(payload.rates?.[quote]);
    if (!Number.isFinite(rate) || rate <= 0 || rate > 10_000) throw new Error("invalid rate");
    return Response.json(
      { base, quote, rate, date: payload.date || new Date().toISOString().slice(0, 10) },
      { headers: { "cache-control": "public, max-age=900" } },
    );
  } catch {
    return Response.json({ error: "Taux de change temporairement indisponible." }, { status: 503 });
  }
}
