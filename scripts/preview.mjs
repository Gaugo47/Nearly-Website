import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "application/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".txt": "text/plain", ".xml": "application/xml" };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (base && pathname === base) { res.writeHead(302, { location: `${base}/` }); res.end(); return; }
    if (base && !pathname.startsWith(`${base}/`)) throw new Error("Not found");
    let file = resolve(root, `.${pathname.slice(base.length)}`);
    if (file !== root && !file.startsWith(root + sep)) throw new Error("Not found");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const data = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" }); res.end(data);
  } catch { res.writeHead(404, { "content-type": "text/html; charset=utf-8" }); res.end(await readFile(resolve(root, "404.html")).catch(() => "Not found")); }
}).listen(Number(process.env.PORT || 3000), "127.0.0.1", () => console.log(`Preview: http://localhost:${process.env.PORT || 3000}${base}/`));
