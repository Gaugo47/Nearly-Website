import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type RuntimeEnv = {
  DB?: D1Database;
  N8N_WAITLIST_WEBHOOK_URL?: string;
  N8N_WAITLIST_TOKEN?: string;
};
const runtimeEnvKey = "__NEARLY_RUNTIME_ENV__";

export function setRuntimeEnv(next: RuntimeEnv) {
  (globalThis as typeof globalThis & { [runtimeEnvKey]?: RuntimeEnv })[runtimeEnvKey] = next;
}

function runtimeEnv() {
  return (globalThis as typeof globalThis & { [runtimeEnvKey]?: RuntimeEnv })[runtimeEnvKey];
}

export function getDb() {
  const d1 = getD1();
  if (!d1) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }
  return drizzle(d1, { schema });
}

export function getD1() {
  const d1 = runtimeEnv()?.DB;
  if (!d1) {
    throw new Error("Cloudflare D1 binding `DB` is unavailable.");
  }
  return d1;
}

export function getRuntimeVar(name: "N8N_WAITLIST_WEBHOOK_URL" | "N8N_WAITLIST_TOKEN") {
  const value = runtimeEnv()?.[name] ?? globalThis.process?.env?.[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
