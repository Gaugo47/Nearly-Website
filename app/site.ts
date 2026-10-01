// These settings are public and embedded in the exported site.
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://gaugo47.github.io/Nearly-Website").replace(/\/$/, "");
export function sitePath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) throw new Error("Expected a local site path");
  const [pathname, fragment] = path.split("#", 2);
  const normalized = pathname === "/" || /\.[a-z0-9]+$/i.test(pathname) ? pathname : `${pathname.replace(/\/$/, "")}/`;
  return `${basePath}${normalized}${fragment === undefined ? "" : `#${fragment}`}`;
}
export function absoluteUrl(path: string) {
  return `${siteUrl}${path === "/" ? "/" : path}`;
}
const configuredEndpoint = process.env.NEXT_PUBLIC_WAITLIST_API_URL || "";
function publicEndpoint(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash ? url.href : "";
  } catch { return ""; }
}
export const waitlistEndpoint = publicEndpoint(configuredEndpoint);
export const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
export const waitlistReady = Boolean(waitlistEndpoint && turnstileSiteKey);
