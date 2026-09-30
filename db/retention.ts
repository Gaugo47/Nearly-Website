// Demo data is kept at most 12 months after its last use (see /confidentialite).
// Both statements hit the `last_seen_at` indexes, so a run with nothing to purge is cheap.
const EXPIRY = "datetime('now', '-12 months')";
const BACKGROUND_PURGE_INTERVAL_MS = 60 * 60 * 1000;

let lastBackgroundPurge = 0;

export async function purgeExpiredDemoData(d1: D1Database) {
  await d1.batch([
    d1.prepare(`DELETE FROM expense_trials WHERE last_seen_at < ${EXPIRY}`),
    d1.prepare(`DELETE FROM couple_question_trials WHERE last_seen_at < ${EXPIRY}`),
  ]);
}

/** Runs the purge at most once per hour per isolate, so it also happens when nobody uses the demos. */
export function purgeExpiredDemoDataInBackground(d1: D1Database | undefined, waitUntil: (promise: Promise<unknown>) => void) {
  const now = Date.now();
  if (!d1 || now - lastBackgroundPurge < BACKGROUND_PURGE_INTERVAL_MS) return;
  lastBackgroundPurge = now;
  waitUntil(purgeExpiredDemoData(d1).catch(() => {
    lastBackgroundPurge = 0;
  }));
}
