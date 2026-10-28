# Google: busca, medição e conversões da Adapta Prime

Pesquisa e implementação: 28/10/2026. Contêiner fornecido: `GTM-523HQHQ`.

## O que está pronto no site

- JSON-LD renderizado no HTML: Organization e WebSite na página inicial; CollectionPage, ItemList e BreadcrumbList nos catálogos; Product nas páginas de produto; AboutPage na página sobre; WebPage nos documentos legais.
- Produtos usam nomes, descrições, imagens e propriedades técnicas reais do catálogo. Não há preço, estoque, avaliação, GTIN, fabricante ou selo inventado.
- Os objetos Product descrevem os itens, mas **não são elegíveis para snippets de produto com preços/estrelas** enquanto não houver ofertas ou avaliações reais que atendam às regras do Google. Não inserir preço zero para contornar isso.
- Logo oficial e favicon PNG, canonical, sitemap, metadados de compartilhamento por produto e categoria.
- FAQ permanece visível para o usuário. O JSON-LD FAQPage foi removido porque o Google descontinuou sua apresentação nos resultados em maio de 2026.
- Previews da Vercel recebem noindex; CRM recebe noindex e fica fora do sitemap. Robots não é controle de acesso: a autenticação administrativa continua necessária.
- Fonte principal recebe preload. O vídeo decorativo só carrega ao se aproximar da tela; respeita movimento reduzido, economia de dados e pausa em aba oculta.
- GTM carrega de forma assíncrona após autorização de pelo menos uma categoria opcional. Recusar não impede navegação ou WhatsApp. Personalização de anúncios permanece negada.
- A escolha dura até 180 dias. O botão do rodapé permite rever/revogar. Cookies de terceiros anteriores devem ser apagados pelo navegador se necessário.
- A medição só começa depois que o template de consentimento do contêiner confirma a aplicação das APIs nativas. Sem esse template, o GTM pode carregar após aceitar, mas os eventos de medição da aplicação ficam bloqueados.
- Não foi colocado iframe noscript incondicional: ele poderia enviar uma requisição externa antes de o visitante fazer sua escolha. Sem JavaScript o catálogo e os links funcionam, e essa integração não mede.
- Há apenas uma integração GTM. Não instalar outro snippet gtag/GA4 paralelo.

## Criar as contas que faltam

1. No [Google Analytics](https://analytics.google.com/), criar uma conta/propriedade GA4 para a Adapta Prime, com país Brasil, fuso de São Paulo e moeda BRL. Criar fluxo Web com o domínio público real. Copiar o ID `G-...`.
2. No [Google Search Console](https://search.google.com/search-console), adicionar o domínio e verificar a propriedade por DNS. Enviar `/sitemap.xml` e solicitar a inspeção da página inicial e das páginas principais. Se usar verificação por prefixo de URL e metatag, o código vai em `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
3. No [Google Ads](https://ads.google.com/), criar/configurar a conta e uma ação de conversão de site para **clique no WhatsApp**. Copiar o ID `AW-...` e o rótulo da ação. Acessar configurações atuais de Metas/Conversões; os nomes do menu podem variar.
4. Se houver campanhas, habilitar a marcação automática e vincular a conta Ads à propriedade GA4. Não alterar orçamento, lance ou campanha automaticamente a partir desta integração.

Esses IDs são identificadores públicos. Não enviar senha, token ou credencial privada. Criar GA4/Search Console não exige contratar anúncio; anúncios só são cobrados conforme configuração e uso da conta Ads.

## Configuração no GTM — necessária antes de medir

Abrir o contêiner `GTM-523HQHQ`. As instruções abaixo preparam um workspace para revisão; só publicar após passar pelo Preview/Tag Assistant.

### 1. Consent Mode v2 nativo

1. Modelos/Templates → Modelos de tag → Novo → menu de opções → Importar. Selecionar `docs/gtm/consent-template.tpl` deste projeto.
2. Criar tag com o modelo **Adapta Prime — consentimento**.
3. Acionador: **Consent Initialization — All Pages**. Ela precisa rodar antes das tags de estatísticas/anúncios, sem exigir consentimento adicional para a própria tag de consentimento.
4. O template usa `setDefaultConsentState` e `updateConsentState`, por meio de uma ponte com as escolhas do site. Ele só pode executar `adaptaConsentSubscribe` e `adaptaConsentReady` e escrever nos quatro estados de consentimento.
5. Publicar esse template junto com as tags finais após validar. O arquivo é um template próprio; a importação e o funcionamento na conta GTM ainda precisam ser verificados no editor.

O código fica em `generate-consent-template.mjs`. Para regenerar o artefato: `node docs/gtm/generate-consent-template.mjs`. Não usar tag Custom HTML para definir Consent Mode. Não há developer ID ou selo de CMP inventado.

### 2. Variáveis da camada de dados

Criar variáveis Data Layer versão 2 com estes nomes/chaves:

| Chave | Uso |
| --- | --- |
| `analytics_storage` | Filtro `granted` em todos os eventos GA4 |
| `ad_storage`, `ad_user_data` | Filtros `granted` em conversões Ads e Conversion Linker |
| `page_location`, `page_path`, `page_title`, `page_referrer` | Contexto sanitizado das páginas |
| `lead_stage`, `lead_source`, `lead_interest`, `contact_method` | Contexto comercial dos botões |
| `ecommerce.items` | Produto visualizado, sem preço inventado |
| `metric_name`, `metric_value`, `metric_delta`, `metric_rating`, `metric_id` | Métricas de velocidade |

Não criar variáveis para conteúdo do WhatsApp, nome, telefone, e-mail, texto de campos ou dados de pacientes. Os eventos do código removem query e hash dos URLs enviados; não substituir pelos URLs completos em tags personalizadas. A infraestrutura do Google ainda recebe metadados normais das requisições conforme os serviços autorizados.

### 3. Google Analytics

1. Criar tag **Google tag** com o ID GA4 real. Acionador Custom Event `adapta_consent_ready`, com `analytics_storage` igual a `granted`.
2. Configurar `send_page_view = false`, `allow_google_signals = false`, `allow_ad_personalization_signals = false`. Passar `page_location` sanitizado; não configurar coleta de dados fornecidos pelo usuário.
3. Criar tag GA4 Event para `page_view`, acionada somente pelo evento personalizado `page_view` da aplicação com `analytics_storage = granted`. Mapear os quatro parâmetros de página da tabela. Não usar também um acionador History Change.
4. No fluxo GA4, desativar page views automáticos baseados em alterações de histórico (Enhanced Measurement). O App Router já é medido pela integração e outra regra duplicaria páginas. Revisar também medição automática de outbound clicks/formulários para evitar coleta ou contagem duplicada.
5. Criar GA4 Event `whatsapp_click`, acionador personalizado homônimo com consentimento de estatísticas concedido. Mapear contexto comercial, `contact_method`, `page_location`. **Não chamar esse evento de purchase ou venda.**
6. Criar GA4 Event `view_item`, evento homônimo com consentimento concedido, enviando ecommerce a partir da camada de dados. Não emitir valor/receita sem dado real.
7. Criar GA4 Event `web_vitals` com os campos `metric_*` e `page_location`, consentimento concedido. Não marcar web_vitals como evento principal/conversão. Usar definições personalizadas no GA4 para métricas/dimensões de interesse, evitando cadastrar metric_id como dimensão comum de alta cardinalidade.

LCP, INP e CLS ajudam a acompanhar experiência real. Uma métrica pode só aparecer ao interagir, ocultar a aba ou sair da página; não interpretar ausência inicial como falha. Métricas anteriores ao consentimento não são reenviadas retroativamente.

### 4. Google Ads e atribuição

1. Criar Conversion Linker com acionador `adapta_consent_ready` e filtros `ad_storage = granted` e `ad_user_data = granted`. Não duplicar Conversion Linker já existente.
2. Criar tag nativa Google Ads Conversion Tracking com ID e rótulo reais da ação de WhatsApp.
3. Acionador Custom Event `whatsapp_click`, com `ad_storage = granted` e `ad_user_data = granted`. Sem valor monetário fictício. Contagem: **uma**, apropriada para contatos.
4. Começar com essa ação como **secundária**: abrir o WhatsApp não comprova conversa recebida, lead qualificado nem venda. Depois decidir a meta primária conforme os resultados reais do atendimento.
5. Não importar também o mesmo clique do GA4 como uma segunda conversão primária. Escolher um caminho principal de medição no Ads.
6. Enhanced Conversions, remarketing e envio de dados pessoais não foram ativados. Futura integração de leads qualificados/vendas via CRM exigirá identificação, consentimento e validação próprios.

Não remover identificadores gclid/gbraid/wbraid dos links de chegada dos anúncios antes de o Conversion Linker autorizado conseguir lê-los. A integração não copia esses IDs para mensagens de WhatsApp nem inventa parâmetros de atribuição. UTMs podem ser usadas na campanha com nomenclatura padronizada, sem dados pessoais.

## Variáveis e domínio de produção

- `NEXT_PUBLIC_SITE_URL`: endereço HTTPS público definitivo, sem barra final. Não usar domínio de login da Vercel nem URL de preview.
- `NEXT_PUBLIC_GTM_ID`: `GTM-523HQHQ`; vazio desativa a integração do site.
- IDs GA4 e Ads: dentro do workspace do GTM, não em snippets duplicados no código.
- Produção deve permitir acesso público a Googlebot e aos arquivos de logo/favicon. Uma URL protegida pelo login da Vercel não pode ser validada como página pública.

## Conferência antes de publicar o contêiner

1. Browser limpo: antes de escolha, nenhum carregamento GTM; ao recusar, nenhum carregamento; acesso a produtos e WhatsApp continuam funcionando.
2. Aceitar estatísticas: um contêiner, uma visualização por rota, uma view_item por produto. Ads continua negado.
3. Aceitar medição de anúncios: Consent Mode nativo atualizado, personalização negada, um clique real gera um `whatsapp_click`. A navegação não espera pela tag.
4. Revogar pelo rodapé: novos eventos dessa categoria param. Abrir e fechar o painel sem alterar a escolha não deve gerar conversão nem nova página.
5. Clique duplo rápido no mesmo botão não deve inflar os eventos; novos cliques legítimos depois são registrados. Teclado e botão do meio são aceitos.
6. Abrir URLs com query contendo nome/telefone de teste: os eventos próprios não podem conter essa query nem texto da mensagem. Confirmar que as tags configuradas respeitam os campos sanitizados.
7. CRM e APIs sem eventos comerciais; não criar tags de medição em todas as mudanças de histórico.
8. Conferir Tag Assistant, GA4 DebugView/Realtime, diagnósticos Ads e Consent Overview no GTM. Fazer uma conversão de teste por vez e verificar ausência de duplicação.
9. Validar JSON-LD no Schema Markup Validator; Rich Results Test apenas para os tipos elegíveis. Search Console e PageSpeed Insights precisam do domínio público acessível. Não atribuir nota Lighthouse/CrUX ou ganho de conversão sem medição.

## Pesquisa e referências

- [Google: estrutura e processamento da dataLayer](https://developers.google.com/tag-platform/tag-manager/datalayer).
- [Google: template e APIs nativas de consentimento](https://developers.google.com/tag-platform/tag-manager/templates/consent-apis).
- [Google Ads: configurar conversões Web](https://support.google.com/google-ads/answer/16560108).
- [Google: propriedades exigidas para snippets Product](https://developers.google.com/search/docs/appearance/structured-data/product-snippet).
- [Google: atualização sobre FAQ rich results em maio/junho de 2026](https://developers.google.com/search/updates).
- [Repositório Vercel/Next.js: exemplo with-google-analytics](https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics): referência de integração com Next.js; usado como pesquisa, sem copiar snippets extras que duplicariam GTM.
- [Repositório GoogleChrome/web-vitals](https://github.com/GoogleChrome/web-vitals): referência de medição real de desempenho. O site usa o hook nativo do Next, que integra a biblioteca, sem carregá-la novamente de CDN.
- [Google Marketing Solutions: template Web Vitals GTM](https://github.com/google-marketing-solutions/web-vitals-gtm-template): referência de eventos e dimensões. Não instalar junto com nosso reporter, para evitar duplicação.
- [Repositório de template Consent Mode](https://github.com/gtm-templates-simo-ahava/consent-mode): consulta do formato de exportação/permissões. O template Adapta é próprio e utiliza as APIs documentadas pelo Google.

JSON-LD não é uma tag de conversão e não garante posição, aprovação de anúncios ou maior taxa de vendas. O trabalho técnico permite descrever o site e medir ações com mais qualidade; o resultado depende também da conta, campanha, oferta, atendimento e experiência real.
