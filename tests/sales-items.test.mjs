import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));

function loadHelper(relative, env = {}) {
  const cache = new Map();
  function load(path) {
    if (cache.has(path)) return cache.get(path);
    const source = readFileSync(path, "utf8");
    const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    const loaded = { exports: {} };
    const context = { module: loaded, exports: loaded.exports, URL, URLSearchParams, console, encodeURIComponent, process: { env },
      require: name => load(resolve(dirname(path), `${name}.ts`)) };
    vm.runInNewContext(output, context, { filename: path });
    cache.set(path, loaded.exports);
    return loaded.exports;
  }
  return load(resolve(root, relative));
}

// Fictional values: they only exercise the code and never reach the site.
const offer = { priceBRL: 99.9, availability: "in_stock", brand: "Marca de teste", mpn: "ABC-123" };

test("the catalog of items matches the price sheet and has unique ids and URLs", () => {
  const { salesItemSpecs } = loadHelper("lib/sales-items.ts");
  assert.equal(salesItemSpecs.length, 40);
  assert.equal(new Set(salesItemSpecs.map(spec => spec.id)).size, 40);
  assert.equal(new Set(salesItemSpecs.map(spec => `${spec.productSlug}/${spec.slug}`)).size, 40);
  for (const id of ["MPHE-33-10", "MPHE-41-30", "MPHE-50-30", "MPCM-48-08", "MPCM-48-55", "MPAN-CM-17-15", "MPAN-GM-30-35", "MPAN-HE-33-17-20", "MPAN-HE-50-30-40", "KIT-EXTRATOR"]) {
    assert.ok(salesItemSpecs.some(spec => spec.id === id), id);
  }
  const he = salesItemSpecs.find(spec => spec.id === "MPHE-50-30");
  assert.equal(he.title, "Mini Pilar Cônico Reto HE Ø 5,0 - Altura 3 mm");
  assert.equal(he.slug, "he-5-altura-3-mm");
  for (const spec of salesItemSpecs) assert.ok(spec.title.length <= 150, spec.id);
});

test("no item is published without a price supplied by the team", () => {
  const { salesItems, itemOffers, buildSalesItems } = loadHelper("lib/sales-items.ts");
  assert.equal(salesItems.length, Object.keys(itemOffers).length);
  assert.equal(buildSalesItems({}).length, 0);
  assert.equal(buildSalesItems({ "MPHE-41-30": offer }).length, 1);
  assert.throws(() => buildSalesItems({ "NAO-EXISTE": offer }), /sem cadastro/);
  assert.throws(() => buildSalesItems({ "MPHE-41-30": { ...offer, priceBRL: 0 } }), /Preço inválido/);
  assert.throws(() => buildSalesItems({ "MPHE-41-30": { ...offer, brand: " " } }), /Marca em branco/);
});

test("the merchant feed points to the item page on the site, never to WhatsApp", () => {
  const { buildSalesItems } = loadHelper("lib/sales-items.ts");
  const { buildMerchantFeed } = loadHelper("lib/merchant-feed.ts");
  const empty = buildMerchantFeed([], "https://adaptaprime.com").trim().split("\n");
  assert.equal(empty.length, 1);
  const [header, row] = buildMerchantFeed(buildSalesItems({ "MPHE-41-30": offer }), "https://adaptaprime.com").trim().split("\n");
  const fields = Object.fromEntries(header.split("\t").map((name, index) => [name, row.split("\t")[index]]));
  assert.equal(fields.id, "MPHE-41-30");
  assert.equal(fields.price, "99.90 BRL");
  assert.equal(fields.link, "https://adaptaprime.com/produtos/mini-pilar-he/he-4-1-altura-3-mm?utm_source=google&utm_medium=shopping");
  assert.equal(fields.image_link, "https://adaptaprime.com/products/featured/mini-pilar-he-reto.webp");
  assert.equal(fields.availability, "in_stock");
  assert.equal(fields.identifier_exists, "yes");
  assert.doesNotMatch(row, /wa\.me/);
});

test("item schema carries the offer the team supplied", () => {
  const env = { NEXT_PUBLIC_SITE_URL: "https://adaptaprime.example", NODE_ENV: "production" };
  const { buildSalesItems } = loadHelper("lib/sales-items.ts", env);
  const { salesItemEntity } = loadHelper("lib/structured-data.ts", env);
  const schema = salesItemEntity(buildSalesItems({ "MPCM-48-25": offer })[0]);
  assert.equal(schema.sku, "MPCM-48-25");
  assert.equal(schema.offers.price, "99.90");
  assert.equal(schema.offers.priceCurrency, "BRL");
  assert.equal(schema.offers.availability, "https://schema.org/InStock");
});

test("the WhatsApp origin names the campaign only for Google traffic and only once", () => {
  const { campaignOriginLabel, addCampaignOrigin, getWhatsAppUrl } = loadHelper("lib/site-config.ts");
  assert.equal(campaignOriginLabel("?utm_source=google&utm_medium=cpc&utm_campaign=x"), "Google Ads");
  assert.equal(campaignOriginLabel("?utm_source=google&utm_medium=shopping"), "Google Shopping");
  assert.equal(campaignOriginLabel("?gclid=abc"), "Google Ads");
  assert.equal(campaignOriginLabel("?email=private@example.com"), "");
  assert.equal(campaignOriginLabel(""), "");

  const href = getWhatsAppUrl({ origin: "Página de produto > Mini Pilar HE", interest: "Mini Pilar HE" });
  assert.equal(addCampaignOrigin(href, ""), href);
  const once = addCampaignOrigin(href, "Google Ads");
  const text = new URL(once).searchParams.get("text");
  assert.match(text, /Origem do contato: Google Ads > Página de produto > Mini Pilar HE\./);
  assert.match(text, /Interesse: Mini Pilar HE\./);
  assert.equal(addCampaignOrigin(once, "Google Ads"), once);
  assert.equal(new URL(once).hostname, "wa.me");
});

test("product and category content stays above the fixed background wave", () => {
  const css = readFileSync(resolve(root, "app/globals.css"), "utf8");
  for (const selector of [".product-detail", ".page-hero"]) {
    const start = css.indexOf(`\n${selector} {`);
    assert.notEqual(start, -1, selector);
    const rule = css.slice(start, css.indexOf("}", start));
    assert.match(rule, /position: relative/, selector);
    assert.match(rule, /z-index: 1/, selector);
  }
});
