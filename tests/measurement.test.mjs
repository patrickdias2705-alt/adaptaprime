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

function browserRuntime({ stored = new Map(), cookies = new Map(), blockedStorage = false } = {}) {
  const location = new URL("https://adaptaprime.com/?email=private@example.com#private");
  const scripts = [];
  const timers = [];
  const events = new EventTarget();
  const browser = { location, dataLayer: [],
    localStorage: {
      getItem: key => { if (blockedStorage) throw new Error("Blocked"); return stored.get(key) ?? null; },
      setItem: (key, value) => { if (blockedStorage) throw new Error("Blocked"); stored.set(key, value); },
      removeItem: key => { if (blockedStorage) throw new Error("Blocked"); stored.delete(key); },
    },
    setTimeout: fn => { timers.push(fn); return timers.length; },
    dispatchEvent: event => events.dispatchEvent(event),
    addEventListener: (...args) => events.addEventListener(...args),
  };
  const document = { title: "Início", referrer: "https://example.com/?private=hidden",
    get cookie() { return [...cookies].map(([key, value]) => `${key}=${value}`).join("; "); },
    set cookie(value) {
      const [pair] = value.split(";");
      const separator = pair.indexOf("=");
      const key = pair.slice(0, separator);
      if (/Max-Age=0(?:;|$)/.test(value)) cookies.delete(key);
      else cookies.set(key, pair.slice(separator + 1));
    },
    getElementById: id => scripts.find(script => script.id === id),
    createElement: () => ({ remove() { scripts.splice(scripts.indexOf(this), 1); } }),
    head: { appendChild: script => scripts.push(script) },
  };
  const runtime = loadHelper("lib/measurement-runtime.ts", { window: browser, document, Event });
  const consentStates = [];
  return { runtime, browser, document, scripts, stored, cookies, consentStates,
    flush() { while (timers.length) timers.shift()(); },
    choose(analytics = true, advertising = false) {
      runtime.saveMeasurementConsent({ version: 1, analytics, advertising, updatedAt: Date.now() });
    },
    navigate(path, title = path) { browser.location = new URL(path, location.origin); document.title = title; runtime.reportPage(browser.location.pathname); },
    named(name) { return browser.dataLayer.filter(event => event.event === name); },
    connectTemplate() {
      const template = readFileSync(new URL("../docs/gtm/consent-template.tpl", import.meta.url), "utf8");
      const code = template.split("___SANDBOXED_JS_FOR_WEB_TEMPLATE___")[1].split("___")[0];
      vm.runInNewContext(code, { require: name => ({
        setDefaultConsentState: state => consentStates.push(state),
        updateConsentState: state => consentStates.push(state),
        callInWindow: (name, callback) => browser[name](callback),
      })[name], data: { gtmOnSuccess() {} } });
    },
  };
}

test("SPA navigation sends one page per committed route, including return visits, after the real consent template acknowledges", () => {
  const h = browserRuntime();
  h.runtime.restoreMeasurementConsent();
  assert.equal(h.scripts.length, 0);
  h.choose();
  h.runtime.reportPage("/");
  h.navigate("/produtos"); // The latest route wins while GTM is still starting.
  assert.equal(h.named("page_view").length, 0);
  h.connectTemplate();
  h.flush();
  assert.equal(h.named("page_view").length, 1);
  assert.equal(h.named("page_view")[0].page_location, "https://adaptaprime.com/produtos");
  assert.equal(h.named("page_view")[0].page_referrer, "https://example.com/");
  h.runtime.restoreMeasurementConsent(); // React remount must preserve native readiness.
  h.runtime.reportPage("/produtos");
  h.navigate("/produtos/mini-pilar-cm?phone=private#private", "Mini Pilar CM");
  h.navigate("/produtos/mini-pilar-cm", "Mini Pilar CM");
  h.navigate("/produtos", "Catálogo");
  assert.equal(h.scripts.length, 1);
  assert.equal(h.named("adapta_consent_ready").length, 1);
  assert.equal(h.named("page_view").length, 3);
  assert.equal(h.named("page_view")[1].page_referrer, "https://adaptaprime.com/produtos");
  assert.equal(h.named("page_view")[2].page_referrer, "https://adaptaprime.com/produtos/mini-pilar-cm");
  assert.equal(h.named("view_item").length, 1);
  assert.equal(h.named("view_item")[0].ecommerce.items[0].item_id, "mini-pilar-cm");
  assert.equal(JSON.stringify(h.named("page_view")).includes("private"), false);
});

test("saved statistics survive a fresh document; rejecting survives too and does not load GTM", () => {
  const first = browserRuntime();
  first.choose();
  const reload = browserRuntime(first);
  assert.equal(reload.runtime.restoreMeasurementConsent().analytics, true);
  assert.equal(reload.browser.adaptaMeasurementReady, false);
  assert.equal(reload.scripts.length, 1);
  reload.connectTemplate(); reload.flush();
  assert.equal(reload.named("page_view").length, 1);
  reload.choose(false, false); reload.flush();
  const deniedReload = browserRuntime(reload);
  const denied = deniedReload.runtime.restoreMeasurementConsent();
  assert.equal(denied.analytics, false);
  assert.equal(denied.advertising, false);
  assert.equal(deniedReload.scripts.length, 0);
});

test("essential cookie restores the choice when localStorage is blocked and a newer revocation beats stale grants", () => {
  const first = browserRuntime({ blockedStorage: true });
  first.choose();
  const reload = browserRuntime({ ...first, blockedStorage: true });
  assert.equal(reload.runtime.restoreMeasurementConsent().analytics, true);
  const stale = { version: 1, analytics: true, advertising: true, updatedAt: Date.now() - 1000 };
  first.stored.set("adapta:consent:v1", JSON.stringify(stale));
  reload.choose(false, false);
  const recoveredStorage = browserRuntime(reload);
  assert.equal(recoveredStorage.runtime.restoreMeasurementConsent().analytics, false);
  assert.equal(recoveredStorage.scripts.length, 0);
});

test("revocation invalidates a pending native acknowledgement and stops page/product/vitals events", () => {
  const h = browserRuntime();
  h.choose(); h.connectTemplate();
  h.choose(false, false); h.flush();
  assert.ok(Object.values(h.consentStates.at(-1)).every(value => value === "denied"));
  h.navigate("/produtos/mini-pilar-cm");
  h.runtime.reportVital({ name: "LCP", id: "lcp", value: 100, delta: 100, rating: "good" });
  assert.equal(h.named("page_view").length, 0);
  assert.equal(h.named("view_item").length, 0);
  assert.equal(h.named("web_vitals").length, 0);
  assert.equal(h.named("adapta_consent_ready").length, 1);
  h.choose(); h.flush();
  assert.equal(h.named("page_view").length, 1);
  h.navigate("/crm/leads");
  h.runtime.reportVital({ name: "CLS", id: "cls", value: 0.1, delta: 0.1, rating: "good" });
  assert.equal(h.named("page_view").length, 1);
  assert.equal(h.named("web_vitals").length, 0);
});

test("Web Vitals wait for native readiness, retain document attribution and drop queued data on revocation", () => {
  const h = browserRuntime();
  h.runtime.restoreMeasurementConsent();
  const metric = { name: "FCP", id: "fcp", value: 110, delta: 110, rating: "good" };
  h.runtime.reportVital(metric); // No analytics permission yet.
  h.choose();
  h.runtime.reportVital({ ...metric, name: "TTFB", id: "ttfb" });
  assert.equal(h.named("web_vitals").length, 0);
  h.navigate("/produtos"); h.connectTemplate(); h.flush();
  assert.equal(h.named("web_vitals").length, 1);
  assert.equal(h.named("web_vitals")[0].metric_name, "TTFB");
  assert.equal(h.named("web_vitals")[0].page_location, "https://adaptaprime.com/");
  h.runtime.reportVital({ ...metric, name: "TTFB", id: "ttfb" });
  assert.equal(h.named("web_vitals").length, 1); // Duplicate callback after a remount.
  h.runtime.reportVital({ ...metric, name: "CLS", id: "cls", value: 0.1, delta: 0.1 });
  h.runtime.reportVital({ ...metric, name: "CLS", id: "cls", value: 0.2, delta: 0.1 });
  assert.equal(h.named("web_vitals").length, 3); // A changed value is legitimate.
  h.choose(false, true);
  h.runtime.reportVital({ ...metric, name: "LCP" });
  h.flush();
  assert.equal(h.named("web_vitals").length, 3);
});

test("revocation discards Web Vitals queued before readiness; an expired choice never emits a page", () => {
  const h = browserRuntime();
  h.choose();
  h.runtime.reportVital({ name: "LCP", id: "queued-lcp", value: 100, delta: 100, rating: "good" });
  h.choose(false, false);
  h.connectTemplate(); h.flush();
  h.choose(); h.flush();
  assert.equal(h.named("web_vitals").length, 0);
  assert.equal(h.named("page_view").length, 1);
  h.browser.adaptaConsentChoice.updatedAt = 0;
  h.navigate("/produtos");
  assert.equal(h.named("page_view").length, 1);
});

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
