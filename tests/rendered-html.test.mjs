import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import test, { after, before } from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = new URL("../", import.meta.url);
const host = "127.0.0.1";
const port = 3127;
const baseUrl = `http://${host}:${port}`;
let server;
let serverError = "";

before(async () => {
  const nextCli = fileURLToPath(
    new URL("../node_modules/next/dist/bin/next", import.meta.url),
  );
  server = spawn(
    process.execPath,
    [nextCli, "start", "--hostname", host, "--port", String(port)],
    {
      cwd: fileURLToPath(projectRoot),
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  server.stderr.on("data", (chunk) => {
    serverError += chunk.toString();
  });

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(
        `Next.js encerrou antes de iniciar (código ${server.exitCode}).\n${serverError}`,
      );
    }
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Tempo esgotado ao iniciar o servidor Next.js de teste.");
});

after(() => {
  if (server && server.exitCode === null) server.kill();
});

async function render(path = "/") {
  return fetch(`${baseUrl}${path}`, {
    headers: { accept: "text/html" },
    redirect: "manual",
  });
}

test("server-renders the institutional home", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="pt-BR"/i);
  assert.match(html, /Distribuidora de Produtos Odontológicos \| Adapta Prime/i);
  assert.match(html, /Precisão[\s\S]*rotina clínica\./i);
  assert.match(html, /Catálogo institucional/i);
  assert.match(html, /site-light-wave/i);
  assert.match(html, /Showroom técnico interativo/i);
  assert.match(html, /Limas Rotatórias/i);
  assert.match(html, /Conexões disponíveis: CM, HE, GM e Straumann/i);
  assert.match(html, /components-visual__connection--straumann/i);
  assert.match(html, /Dúvidas frequentes/i);
  assert.match(html, /data-whatsapp-cta="true"/i);
  assert.match(html, /data-lead-stage="discovery"/i);
  assert.match(html, /href="https:\/\/wa\.me\//i);
  assert.match(html, /src="\/brand\/adapta-prime-symbol-mobile\.png"/i);
  assert.doesNotMatch(html, /_next\/image[^\"]*adapta-prime-symbol-mobile/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  assert.doesNotMatch(html, />\s*(Comprar|Checkout|Carrinho)\s*</i);
});

test("redirects the legacy contact route straight to WhatsApp", async () => {
  const response = await render("/contato");
  assert.equal(response.status, 307);
  assert.match(response.headers.get("location") ?? "", /^https:\/\/wa\.me\//i);
});

test("renders catalog and product detail routes", async () => {
  const catalog = await render("/produtos");
  assert.equal(catalog.status, 200);
  const catalogHtml = await catalog.text();
  assert.match(catalogHtml, /\/sections\/produtos-hero\.webp/i);
  assert.match(catalogHtml, /\/sections\/produtos-hero-mobile\.webp/i);
  assert.match(catalogHtml, /Componentes e soluções para/i);
  assert.match(catalogHtml, /O que você procura\?/i);
  assert.match(catalogHtml, /catalog-category-grid/i);
  assert.match(catalogHtml, /data-lead-stage="category"/i);
  assert.match(catalogHtml, /Falar sobre este produto/i);
  assert.match(catalogHtml, /\/products\/featured\/mini-pilar-reto\.webp/i);
  assert.match(catalogHtml, /Implantes CM e HE/i);
  assert.match(catalogHtml, /\/products\/featured\/implantes-cm-he\.webp/i);
  assert.match(catalogHtml, /T-Base CM 11,5[^<]{0,3}\+ Parafuso CM/i);
  assert.match(catalogHtml, /\/products\/featured\/t-base-cm-11-5\.webp/i);
  assert.doesNotMatch(catalogHtml, /R\$\s*\d/i);

  const product = await render("/produtos/mini-pilar-cm");
  assert.equal(product.status, 200);
  const html = await product.text();
  assert.match(html, /Mini Pilar CM/i);
  assert.match(html, /Modelo 3D interativo do Mini Pilar CM/i);
  assert.match(html, /\/models\/mini-pilar-reto-fast\.glb/i);
  assert.match(html, /Altura gengival \/ transmucosa/i);
  assert.match(html, /0,8[\s\S]{0,80}1,5[\s\S]{0,80}2,5[\s\S]{0,80}3,5[\s\S]{0,80}4,5[\s\S]{0,80}5,5/i);
  assert.match(html, /Falar sobre este produto/i);
  assert.doesNotMatch(html, /R\$|Adicionar ao carrinho|Comprar agora/i);

  const heProduct = await render("/produtos/mini-pilar-he");
  assert.equal(heProduct.status, 200);
  const heHtml = await heProduct.text();
  assert.match(heHtml, /HE Ø 3,3/i);
  assert.match(heHtml, /HE SF Ø 4,1/i);
  assert.match(heHtml, /HE SF Ø 5,0/i);

  const angledProduct = await render("/produtos/mini-pilar-angulado");
  assert.equal(angledProduct.status, 200);
  const angledHtml = await angledProduct.text();
  assert.match(angledHtml, /17° ou 30°/i);
  assert.match(angledHtml, /Seleção por plataforma NC, RC, RB ou WB/i);

  const missing = await render("/produtos/produto-inexistente");
  assert.equal(missing.status, 404);

  const endodonticProduct = await render("/produtos/limas-rotatorias");
  assert.equal(endodonticProduct.status, 200);
  assert.match(await endodonticProduct.text(), /\/models\/limas-meshy-compatible\.glb/i);
});

test("renders the editorial about banner with a mobile crop", async () => {
  const response = await render("/sobre");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /\/sections\/sobre-hero\.webp/i);
  assert.match(html, /\/sections\/sobre-hero-mobile\.webp/i);
  assert.match(html, /Soluções que transformam/i);
});

test("renders indexable category landing pages", async () => {
  const category = await render("/solucoes/componentes-proteticos");
  assert.equal(category.status, 200);

  const html = await category.text();
  assert.match(html, /Componentes Protéticos para Implantodontia/i);
  assert.match(html, /Produtos e soluções em[\s\S]{0,30}Componentes protéticos/i);
  assert.match(html, /Mini Pilar CM/i);
  assert.match(html, /href="\/solucoes\/endodontia"/i);
});

test("keeps the technical SEO surface in place", async () => {
  const [layout, metadata, robots, sitemap] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/metadata.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /max-image-preview/);
  assert.match(layout, /googleSiteVerification/);
  assert.match(metadata, /canonical/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(sitemap, /solucoes\//);
  assert.match(sitemap, /produtos\//);
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
