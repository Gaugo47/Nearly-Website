const required = ["NEXT_PUBLIC_PUBLISHER_NAME", "NEXT_PUBLIC_PUBLISHER_STATUS", "NEXT_PUBLIC_PUBLISHER_ADDRESS", "NEXT_PUBLIC_PUBLICATION_DIRECTOR", "NEXT_PUBLIC_CONTACT_EMAIL"];
if (process.env.NEXT_PUBLIC_WAITLIST_API_URL) required.push("NEXT_PUBLIC_WAITLIST_HOST", "NEXT_PUBLIC_TURNSTILE_SITE_KEY");
const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length) throw new Error(`Complete these public settings before publishing: ${missing.join(", ")}`);
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.NEXT_PUBLIC_CONTACT_EMAIL)) throw new Error("A valid public contact email is required");
if (process.env.NEXT_PUBLIC_WAITLIST_API_URL) {
  if (/^[123]x000000/.test(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)) throw new Error("A production Turnstile site key is required; do not publish a test widget");
  const url = new URL(process.env.NEXT_PUBLIC_WAITLIST_API_URL);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) throw new Error("Use a public HTTPS webhook URL without credentials or tokens");
}
console.log("Public configuration complete. Verify the applicable legal requirements before publication.");
