const required = ["NEXT_PUBLIC_PUBLISHER_NAME", "NEXT_PUBLIC_PUBLISHER_STATUS", "NEXT_PUBLIC_PUBLISHER_ADDRESS", "NEXT_PUBLIC_PUBLICATION_DIRECTOR", "NEXT_PUBLIC_CONTACT_EMAIL"];
if (process.env.NEXT_PUBLIC_WAITLIST_API_URL) required.push("NEXT_PUBLIC_WAITLIST_HOST");
const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length) throw new Error(`Complete these public settings before publishing: ${missing.join(", ")}`);
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.NEXT_PUBLIC_CONTACT_EMAIL)) throw new Error("A valid public contact email is required");
if (process.env.NEXT_PUBLIC_WAITLIST_API_URL) {
  const url = new URL(process.env.NEXT_PUBLIC_WAITLIST_API_URL);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) throw new Error("Use a public HTTPS gateway URL without credentials or tokens");
}
console.log("Public configuration complete. Verify the applicable legal requirements before publication.");
