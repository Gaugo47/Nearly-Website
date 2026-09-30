import { appendFileSync } from "node:fs";
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const url = new URL(process.env.PAGES_SITE_URL || `https://${owner.toLowerCase()}.github.io/${repo.toLowerCase() === `${owner.toLowerCase()}.github.io` ? "" : repo}`);
if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) throw new Error("SITE_URL must be a public HTTPS URL");
appendFileSync(process.env.GITHUB_ENV, `NEXT_PUBLIC_SITE_URL=${url.href.replace(/\/$/, "")}\nNEXT_PUBLIC_BASE_PATH=${url.pathname.replace(/\/$/, "")}\n`);
