const publisherFields = ["NEXT_PUBLIC_PUBLISHER_NAME", "NEXT_PUBLIC_PUBLISHER_STATUS", "NEXT_PUBLIC_PUBLISHER_ADDRESS", "NEXT_PUBLIC_PUBLICATION_DIRECTOR", "NEXT_PUBLIC_CONTACT_EMAIL"];
const incompletePublisher = publisherFields.filter((name) => !process.env[name]?.trim());
if (incompletePublisher.length) console.warn(`Publisher details not supplied: ${incompletePublisher.join(", ")}`);
const required = [];
if (process.env.NEXT_PUBLIC_WAITLIST_API_URL) required.push("NEXT_PUBLIC_WAITLIST_HOST", "NEXT_PUBLIC_TURNSTILE_SITE_KEY");
const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length) throw new Error(`Complete these public settings before publishing: ${missing.join(", ")}`);
if (process.env.NEXT_PUBLIC_CONTACT_EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.NEXT_PUBLIC_CONTACT_EMAIL)) throw new Error("Use a valid public contact email when one is supplied");
if (process.env.NEXT_PUBLIC_WAITLIST_API_URL) {
  if (/^[123]x000000/.test(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)) throw new Error("A production Turnstile site key is required; do not publish a test widget");
  const url = new URL(process.env.NEXT_PUBLIC_WAITLIST_API_URL);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) throw new Error("Use a public HTTPS webhook URL without credentials or tokens");
}
console.log("Public deployment settings checked.");
