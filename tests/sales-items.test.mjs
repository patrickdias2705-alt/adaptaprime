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
  assert.equal(salesItemSpecs.length, 37);
  assert.equal(new Set(salesItemSpecs.map(spec => spec.id)).size, 37);
  assert.equal(new Set(salesItemSpecs.map(spec => `${spec.productSlug}/${spec.slug}`)).size, 37);
  for (const id of ["MPHE-33-10", "MPHE-41-30", "MPHE-33-30", "MPCM-48-08", "MPCM-48-55", "MPAN-CM-17-15", "MPAN-GM-30-35", "MPAN-HE-33-17-20", "MPAN-HE-33-30-40", "KIT-EXTRATOR"]) {
    assert.ok(salesItemSpecs.some(spec => spec.id === id), id);
  }
  const he = salesItemSpecs.find(spec => spec.id === "MPHE-33-30");
  assert.equal(he.title, "Mini Pilar Cônico Reto HE Ø 3,3 - Altura 3 mm");
  assert.equal(he.slug, "he-3-3-altura-3-mm");
  // Adapta has no Ø 5,0 platform in any product.
  assert.ok(salesItemSpecs.every(spec => !/5,0/.test(spec.title)));
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

test("WhatsApp opens with one human sentence: came from the site and what they want", () => {
  const { getWhatsAppUrl } = loadHelper("lib/site-config.ts");
  const text = href => new URL(href).searchParams.get("text");
  assert.equal(new URL(getWhatsAppUrl()).hostname, "wa.me");
  assert.equal(text(getWhatsAppUrl()), "Olá! Vim pelo site e quero falar com um especialista.");
  assert.equal(text(getWhatsAppUrl("quero um orçamento de Mini Pilar HE")), "Olá! Vim pelo site e quero um orçamento de Mini Pilar HE.");
  assert.equal(text(getWhatsAppUrl("Vocês entregam na minha cidade?")), "Olá! Vim pelo site e vocês entregam na minha cidade?");
  // Free text from the old /contato?mensagem= links: greeting stripped, sentence kept.
  assert.equal(text(getWhatsAppUrl("Olá, gostaria de um orçamento")), "Olá! Vim pelo site e gostaria de um orçamento.");
  assert.equal(text(getWhatsAppUrl("Oitenta unidades do kit")), "Olá! Vim pelo site e oitenta unidades do kit.");
  assert.equal(text(getWhatsAppUrl("Olá!")), "Olá! Vim pelo site e quero falar com um especialista.");
  assert.doesNotMatch(text(getWhatsAppUrl("quero um orçamento de Mini Pilar CM")), /Origem|Interesse|Google|\[|\n/);
});

test("visitors from Google Ads say so in the WhatsApp sentence", () => {
  const { getWhatsAppUrl, cameFromGoogleAds, markGoogleOrigin } = loadHelper("lib/site-config.ts");
  const text = href => new URL(href).searchParams.get("text");
  assert.equal(cameFromGoogleAds("?gclid=abc"), true);
  assert.equal(cameFromGoogleAds("?utm_source=google&utm_medium=cpc"), true);
  assert.equal(cameFromGoogleAds("?utm_source=google&utm_medium=organic"), false);
  assert.equal(cameFromGoogleAds(""), false);
  const marked = markGoogleOrigin(getWhatsAppUrl("quero um orçamento de Mini Pilar CM"));
  assert.equal(text(marked), "Olá! Vim pelo Google e quero um orçamento de Mini Pilar CM.");
  assert.equal(markGoogleOrigin(marked), marked);
  assert.equal(new URL(marked).pathname, new URL(getWhatsAppUrl()).pathname);
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

test("the quote names the measure the dentist picked, so sales can answer without asking again", () => {
  const { quoteInterest, getProduct } = loadHelper("lib/products.ts");
  const cm = getProduct("mini-pilar-cm");
  assert.equal(quoteInterest(cm), "Mini Pilar CM (Cone Morse)");
  assert.equal(quoteInterest(cm, cm.technicalData.groups[0], "2,5"), "Mini Pilar CM (Cone Morse) (altura 2,5 mm)");
  const he = getProduct("mini-pilar-he");
  assert.equal(quoteInterest(he, he.technicalData.groups[1], "2"), "Mini Pilar HE (HE SF Ø 4,1, altura 2 mm)");
  const angled = getProduct("mini-pilar-angulado");
  const [he17, he30] = angled.technicalData.groups.filter(group => group.connection === "HE");
  assert.equal(quoteInterest(angled, he17, "2"), "Mini Pilar Angulado (HE 17° · Ø 3,3 / Ø 4,1, altura 2 mm)");
  assert.notEqual(quoteInterest(angled, he30, "3"), quoteInterest(angled, he17, "3"));
  const straumann = angled.technicalData.groups.find(group => !group.heights);
  assert.equal(quoteInterest(angled, straumann), "Mini Pilar Angulado (Straumann)");
});
