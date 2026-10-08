import assert from "node:assert/strict";
import test from "node:test";
import { ANALYTICS_CHOICE_LIFETIME, analyticsPageAllowed, readAnalyticsChoice } from "../app/analytics-settings.mjs";

test("analytics requires a valid unexpired explicit choice, including refusals", () => {
  const now = 20000000000;
  for (const choice of ["accepted", "refused"]) {
    assert.equal(readAnalyticsChoice(JSON.stringify({ choice, savedAt: now }), now), choice);
    assert.equal(readAnalyticsChoice(JSON.stringify({ choice, savedAt: now - ANALYTICS_CHOICE_LIFETIME }), now), null);
  }
  for (const raw of [null, "broken", "null", '{}', '{"choice":"accepted"}', '{"choice":"other","savedAt":1}']) {
    assert.equal(readAnalyticsChoice(raw, now), null);
  }
  assert.equal(readAnalyticsChoice(JSON.stringify({ choice: "accepted", savedAt: now + 1 }), now), null);
});

test("analytics excludes private URLs, legal pages, previews and other origins", () => {
  const site = "https://hellonearly.com";
  for (const path of ["/", "/outils/", "/tester-un-jeu/", "/calculateur-remboursement/", "/questions-couple/", "/#experience"]) {
    assert.equal(analyticsPageAllowed(`${site}${path}`, site), true, path);
    assert.equal(analyticsPageAllowed(`${site}/en${path}`, site), true, `en${path}`);
  }
  for (const url of [
    `${site}/confidentialite/`, `${site}/confidentialite/#token=private`, `${site}/?email=private`,
    `${site}/#token=private`, `${site}/mentions-legales/`, `${site}/conditions-liste-attente/`,
    `${site}/cgu/`, `${site}/confidentialite-app/`,
    `${site}/en/contact/`, `${site}/en/confidentialite/#token=private`, `${site}/en/cgu/`,
    "http://localhost:3000/", "https://preview.example/", "http://hellonearly.com/", "not-a-url",
  ]) assert.equal(analyticsPageAllowed(url, site), false, url);
  assert.equal(analyticsPageAllowed("https://gaugo47.github.io/Nearly-Website/outils/", "https://gaugo47.github.io/Nearly-Website", "/Nearly-Website"), true);
});
