# Adapta Prime

Website institucional da Adapta Prime, desenvolvido com Next.js 16, React 19 e App Router. O projeto está preparado para deploy contínuo na Vercel a partir da branch `main`.

## Requisitos

- Node.js `22.x`
- npm (o `package-lock.json` deve ser mantido no repositório)

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Validação de produção

```bash
npm run lint
npm run build
npm run start
```

O comando padrão de build usa `next build`, que é o fluxo nativo esperado pela Vercel.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e configure:

- `NEXT_PUBLIC_SITE_URL`: domínio final do site, sem barra no fim. Exemplo: `https://adaptaprime.com.br`.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: token do Google Search Console, opcional.

Na ausência de `NEXT_PUBLIC_SITE_URL`, o projeto usa automaticamente `VERCEL_PROJECT_PRODUCTION_URL` ou `VERCEL_URL` quando disponível na Vercel.

Todos os CTAs usam um único WhatsApp, `553175255290` (`31 7525-5290`), fixo em `lib/site-config.ts`. Cada mensagem é uma frase só, dizendo que veio do site e o que a pessoa quer (ex.: "Olá! Vim pelo site e quero um orçamento de Mini Pilar CM (altura 2,5 mm)."). Origem, botão e campanha são medidos pelo evento `whatsapp_click`, não aparecem no texto.

## Deploy na Vercel

1. Importe este repositório no painel da Vercel.
2. Confirme o preset **Next.js** e a branch de produção `main`.
3. Não altere Build Command, Install Command nem Output Directory; a detecção automática é suficiente.
4. Cadastre as variáveis de ambiente do projeto.
5. Depois de conectar o domínio definitivo, defina `NEXT_PUBLIC_SITE_URL` e faça um novo deploy para consolidar canonical, sitemap e Open Graph.

Cada push na `main` gera um novo deploy de produção; branches e pull requests podem gerar previews.

## Comandos úteis

- `npm run dev`: desenvolvimento com Next.js.
- `npm run build`: build de produção compatível com a Vercel.
- `npm run lint`: validação estática.
- `npm test`: lint, build e testes de renderização no servidor Next.js.
