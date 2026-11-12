import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";
import "./compose-social-preview.mjs";

const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
const sharp = nextRequire("sharp");

// Preserve the approved three-quarter phone, textured paper and glass sculpture.
// Builds export this source artwork rather than recreating the flat SVG layout.
const artwork = await readFile("assets/social-preview/nearly-social-en-v7.png");
const image = await sharp(artwork).resize(1200, 630, { fit: "fill" }).png().toBuffer();
await writeFile("public/media/nearly-social-en-v7.png", image);
await writeFile("public/og.png", image);
console.log("Three-quarter English social preview exported (1200 x 630).");
