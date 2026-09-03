import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the institutional home", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="pt-BR"/i);
  assert.match(html, /Adapta Prime \| Implantodontia, Endodontia e Componentes Odontológicos/i);
  assert.match(html, /Precisão[\s\S]*rotina clínica\./i);
  assert.match(html, /Catálogo institucional/i);
  assert.match(html, /href="\/contato"/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  assert.doesNotMatch(html, />\s*(Comprar|Checkout|Carrinho)\s*</i);
});

test("renders catalog and product detail routes", async () => {
  const catalog = await render("/produtos");
  assert.equal(catalog.status, 200);
  assert.match(await catalog.text(), /Soluções organizadas/i);

  const product = await render("/produtos/mini-pilar-cm");
  assert.equal(product.status, 200);
  const html = await product.text();
  assert.match(html, /Mini Pilar CM/i);
  assert.match(html, /Falar com especialista/i);
  assert.doesNotMatch(html, /R\$|Adicionar ao carrinho|Comprar agora/i);

  const missing = await render("/produtos/produto-inexistente");
  assert.equal(missing.status, 404);
});

test("removes the temporary starter surface", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|Geist/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview", projectRoot)));
});

