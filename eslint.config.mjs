import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: { "react-hooks/set-state-in-effect": "off" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "work/**",
    ".claude/**",
    ".wrangler/**",
    "next-env.d.ts",
    // Fragments de nœuds Code n8n (return et await de premier niveau), testés par n8n/workflow.test.mjs.
    "n8n/src/**",
  ]),
]);

export default eslintConfig;
