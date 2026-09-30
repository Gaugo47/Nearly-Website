import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const patterns = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ["github-token", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,})\b/],
  ["aws-key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["service-token", /\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{32,}|xox[baprs]-[A-Za-z0-9-]{20,})\b/],
  ["credential-url", /https?:\/\/[^\s/:"']+:[^\s/@"']+@[^\s"']+/],
];
const forbidden = /(^|\/)(?:\.env(?!\.example$)|\.dev\.vars|\.openai|\.claude|\.codex|\.agents|\.wrangler|node_modules|work|out|dist|credentials?|id_rsa|id_ed25519)(?:\/|$)|\.(?:pem|key|p12|pfx|sqlite3?|db|csv|har)$/i;
let failures = 0;
function inspect(label, data) {
  if (data.includes("\0")) return;
  for (const [name, rule] of patterns) if (rule.test(data)) { console.error(`${label}: ${name} (value redacted)`); failures++; }
}
const history = process.argv.includes("--history");
if (history) {
  const objects = git("rev-list", "--objects", "--branches", "--tags", "--remotes").trim().split("\n");
  let blobs = 0;
  for (const line of objects) {
    const [oid, ...parts] = line.split(" "); const name = parts.join(" ");
    if (git("cat-file", "-t", oid).trim() !== "blob") continue;
    blobs++;
    if (forbidden.test(name)) { console.error(`History ${oid.slice(0, 12)} ${name}: private path`); failures++; }
    inspect(`History ${oid.slice(0, 12)} ${name}`, git("cat-file", "blob", oid));
  }
  const commits = git("log", "--branches", "--tags", "--remotes", "--format=%H%x09%ae%x09%ce").trim().split("\n");
  const privateEmails = commits.filter((line) => line.split("\t").slice(1).some((email) => !email.endsWith("@users.noreply.github.com")));
  if (privateEmails.length) { console.error(`${privateEmails.length} commits contain personal author/committer email addresses (redacted).`); failures++; }
  console.log(`Inspected ${blobs} historical blobs and ${commits.length} commits.`);
} else {
  const files = git("ls-files", "--cached", "--others", "--exclude-standard", "-z").split("\0").filter(Boolean);
  for (const file of files) {
    if (!existsSync(file)) continue;
    if (forbidden.test(file)) { console.error(`${file}: private path`); failures++; }
    inspect(file, readFileSync(file).toString("utf8"));
  }
  function exported(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name);
      if (entry.isDirectory()) exported(file);
      else {
        if (entry.name.endsWith(".map")) { console.error(`${file}: source map`); failures++; }
        inspect(file, readFileSync(file).toString("utf8"));
      }
    }
  }
  if (existsSync("out")) exported("out");
  console.log(`Inspected ${files.length} source paths and exported assets when present.`);
}
if (failures) { console.error(`${failures} findings. This is a targeted scan, not a guarantee of absence of every secret.`); process.exitCode = 1; }
else console.log("No findings in the targeted checks.");
