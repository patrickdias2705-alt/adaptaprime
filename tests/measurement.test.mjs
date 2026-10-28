import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));

// Exercise the actual TS helpers without depending on Next's server or real Google requests.
function loadHelper(relative, globals = {}, env = {}) {
  const cache = new Map();
  function load(path) {
    if (cache.has(path)) return cache.get(path);
    const source = readFileSync(path, "utf8");
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    const loaded = { exports: {} };
    const context = { module: loaded, exports: loaded.exports, URL, console, process: { env }, ...globals,
      require: name => { assert.ok(name.startsWith("./"), `Unexpected dependency: ${name}`); return load(resolve(dirname(path), `${name}.ts`)); } };
    vm.runInNewContext(output, context, { filename: path });
    cache.set(path, loaded.exports);
    return loaded.exports;
  }
  return load(resolve(root, relative));
}

test("consent fails closed for malformed, stale, future or partial choices", () => {
  const m = loadHelper("lib/measurement.ts");
  const now = Date.now();
  const choice = { version: 1, analytics: true, advertising: false, updatedAt: now };
  assert.ok(m.parseConsent(JSON.stringify(choice), now));
  for (const value of [null, "{", "true", JSON.stringify({ ...choice, version: 2 }), JSON.stringify({ ...choice, analytics: "true" }),
    JSON.stringify({ ...choice, updatedAt: now + 1 }), JSON.stringify({ ...choice, updatedAt: now - m.consentMaxAge - 1 })]) {
    assert.equal(m.parseConsent(value, now), null);
  }
  const states = m.googleConsent(choice);
  assert.equal(states.analytics_storage, "granted");
  assert.equal(states.ad_storage, "denied");
  assert.equal(states.ad_personalization, "denied");
  assert.equal(m.googleConsent({ ...choice, advertising: true }).ad_personalization, "denied");
});

test("measurement excludes private routes and strips queries, fragments and non-web URLs", () => {
  const m = loadHelper("lib/measurement.ts");
  for (const path of ["/crm", "/crm/leads", "/api", "/api/crm/session"]) assert.equal(m.publicPath(path), false);
  assert.equal(m.publicPath("/produtos/mini-pilar-cm"), true);
  assert.equal(m.cleanPageUrl("https://example.com/produtos?email=private@example.com&gclid=abc#patient"), "https://example.com/produtos");
  for (const value of ["javascript:alert(1)", "mailto:private@example.com", "invalid"]) assert.equal(m.cleanPageUrl(value), "");
});

test("no event reaches the dataLayer before native consent readiness or without the right category", () => {
  const browser = { location: { pathname: "/produtos" }, dataLayer: [], adaptaConsentChoice: { version: 1, analytics: true, advertising: false, updatedAt: Date.now() } };
  const m = loadHelper("lib/measurement.ts", { window: browser });
  m.pushMeasurement({ event: "page_view" });
  assert.equal(browser.dataLayer.length, 0);
  browser.adaptaMeasurementReady = true;
  m.pushMeasurement({ event: "page_view" });
  assert.equal(browser.dataLayer.length, 1);
  m.pushMeasurement({ event: "conversion" }, "advertising");
  assert.equal(browser.dataLayer.length, 1);
  browser.adaptaConsentChoice.analytics = false;
  m.pushMeasurement({ event: "whatsapp_click" }, "either");
  assert.equal(browser.dataLayer.length, 1);
  browser.adaptaConsentChoice.advertising = true;
  m.pushMeasurement({ event: "whatsapp_click" }, "either");
  assert.equal(browser.dataLayer.length, 2);
  browser.location.pathname = "/crm/leads";
  m.pushMeasurement({ event: "whatsapp_click" }, "either");
  assert.equal(browser.dataLayer.length, 2);
});

test("container ID is validated and can be disabled", () => {
  assert.equal(loadHelper("lib/measurement.ts").gtmId, "GTM-523HQHQ");
  assert.equal(loadHelper("lib/measurement.ts", {}, { NEXT_PUBLIC_GTM_ID: "" }).gtmId, "");
  assert.equal(loadHelper("lib/measurement.ts", {}, { NEXT_PUBLIC_GTM_ID: '"><script>' }).gtmId, "");
});

test("product structured data matches catalog facts and never invents commercial offers or ratings", () => {
  const env = { NEXT_PUBLIC_SITE_URL: "https://adaptaprime.example", NODE_ENV: "production" };
  const { productEntity, informationPage } = loadHelper("lib/structured-data.ts", {}, env);
  const { products } = loadHelper("lib/products.ts", {}, env);
  for (const product of products) {
    const schema = productEntity(product);
    assert.equal(schema["@type"], "Product");
    assert.equal(schema.name, product.name);
    assert.equal(schema.description, product.description);
    assert.ok(schema.url.endsWith(`/produtos/${product.slug}`));
    assert.ok(schema["@id"].endsWith("#product"));
    for (const field of ["offers", "aggregateRating", "review", "gtin", "manufacturer"]) assert.equal(schema[field], undefined);
    if (!product.image) assert.equal(schema.image, undefined);
    if (product.companionImage) assert.equal(schema.image.length, 2);
  }
  assert.equal(informationPage("AboutPage", "Sobre", "Descrição", "/sobre")[0]["@type"], "AboutPage");
});

test("preview environments are not indexable and production remains indexable", () => {
  for (const VERCEL_ENV of ["preview", "development"]) assert.equal(loadHelper("lib/site-config.ts", {}, { VERCEL_ENV }).siteConfig.indexable, false);
  assert.equal(loadHelper("lib/site-config.ts", {}, { VERCEL_ENV: "production" }).siteConfig.indexable, true);
});

test("GTM template applies native denied defaults, updates consent and acknowledges readiness", () => {
  const template = readFileSync(new URL("../docs/gtm/consent-template.tpl", import.meta.url), "utf8");
  const parts = template.split(/___([A-Z_]+)___\s*/);
  const sections = {};
  for (let i = 1; i < parts.length; i += 2) sections[parts[i]] = parts[i + 1].trim();
  assert.equal(JSON.parse(sections.INFO).type, "TAG");
  const permissions = JSON.parse(sections.WEB_PERMISSIONS);
  assert.equal(permissions.length, 2);
  let listener, defaults, updated, ready = 0, succeeded = false;
  const apis = {
    setDefaultConsentState: state => { defaults = state; },
    updateConsentState: state => { updated = state; },
    callInWindow: (name, callback) => {
      if (name === "adaptaConsentSubscribe") listener = callback;
      else if (name === "adaptaConsentReady") ready++;
      else assert.fail(`Unexpected global: ${name}`);
    },
  };
  vm.runInNewContext(sections.SANDBOXED_JS_FOR_WEB_TEMPLATE, { require: name => apis[name], data: { gtmOnSuccess: () => { succeeded = true; } } });
  assert.equal(succeeded, true);
  assert.ok(Object.values(defaults).every(state => state === "denied"));
  listener({ analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "granted" });
  assert.equal(updated.analytics_storage, "granted");
  assert.equal(updated.ad_personalization, "denied");
  listener({});
  assert.ok(Object.values(updated).every(state => state === "denied"));
  assert.equal(ready, 2);
});
