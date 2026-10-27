# Integrações editoriais e responsividade

## Runtime e cache

React/Vite estático e endpoints no Cloudflare Worker `alvoradatvd`. `wrangler.jsonc` preserva `ASSETS`, fallback SPA e execução do Worker em `/api/*`. Não há servidor Node em produção.

`EDITORIAL_CACHE` é um Durable Object SQLite compartilhado pelo ID `public-services-v1`. Preserva última resposta válida, reúne requisições concorrentes e aplica backoff de 60 segundos após falhas. O histórico da migração `v1-editorial-cache` deve ser mantido.

| Endpoint     | Fonte                    | TTL           | Última válida em falha              |
| ------------ | ------------------------ | ------------- | ----------------------------------- |
| `/api/news`  | RSS G1 Campinas e Região | 900 segundos  | Até 24 horas, marcada como anterior |
| `/api/rates` | Banco Central/PTAX       | 1800 segundos | Até 7 dias, com referência temporal |

JSON: `{ data, updatedAt, stale, unavailable? }`. O frontend não recebe XML bruto ou HTML arbitrário. `updatedAt` indica a consulta; publicação e referência PTAX têm seus próprios campos. `Cache-Control: no-store` evita cache opaco adicional; o TTL é aplicado no Durable Object. Só GET e URLs de origem fixas; querystrings não fragmentam o cache. Timeout de 10 segundos e respostas limitadas (RSS 2 MB; PTAX 100 KB). Redirecionamentos são rejeitados, usando modo `manual` compatível com Workers.

## RSS e layouts

Fonte: https://g1.globo.com/rss/g1/sp/campinas-regiao/

Parser exclusivo do Worker (`fast-xml-parser`): valida XML, rejeita DOCTYPE/ENTITY, limita itens e textos, ordena por publicação decrescente, elimina duplicatas por URL/GUID e retorna até dez itens. Resumo prioriza `atom:subtitle`; HTML não é renderizado. Links HTTPS com host exato G1; imagens HTTPS `glbimg.com`/subdomínios, priorizando `media:content`. Imagem ausente ou inválida recebe placeholder neutro. Sem fotos conceituais como substituição, proxy de imagens ou variantes inventadas. Lazy loading, decoding assíncrono e área reservada com aspect-ratio.

Home e Notícias compartilham `FeedNews`. O hook `useNewsLayout` usa ResizeObserver na largura efetiva do bloco; só muda o estado quando atravessa um limite de layout. Não consulta o RSS durante resize nem interfere nos players.

- A partir de **1120px úteis**: 1 principal + 3 secundárias; imagem principal 16:9 com overlay de fonte/título/data, resumo e CTA na área clara. Secundárias com imagem quadrada e conteúdo lateral. O principal ocupa as três linhas do Grid, alinhando altura e base com o conjunto lateral. Resumos laterais limitados a duas linhas, preservando títulos completos.
- De **640 a 1119px úteis**: grade 2×2, quatro imagens 16:9, todos os títulos e CTAs fora das imagens. Resumos ocultos; fonte/data mantidas. Dois cards têm ao menos 308px disponíveis com gap de 24px.
- Abaixo de **640px úteis**: cinco cards em coluna única, imagens 16:9, somente título e CTA. Sem resumo, fonte/data dentro do card ou overlay. A lista editorial não é renderizada.

Nos dois layouts maiores, posições 5–10 permanecem na lista editorial sem imagem, em duas colunas. Na coluna única, a quinta matéria aparece só como card e os demais itens não são renderizados. Ordem preservada e nenhuma duplicação dentro de um layout. Todos os links usam URL original G1, `target="_blank"` e `rel="noopener noreferrer"`. Nenhuma rota de matéria G1 é criada. Busca textual e estados de loading, falha e última resposta válida preservados.

Atribuição geral e direitos permanecem visíveis. Não há republicação do texto integral. Confirmar com o titular as condições comerciais de uso de conteúdo/imagens. Rotas demonstrativas preexistentes continuam disponíveis por compatibilidade; as notícias G1 nunca apontam para elas.

## PTAX e Header

Consulta BCB em período de 14 dias para USD/EUR, com até 200 registros e seleção local do último boletim Fechamento, campo `cotacaoVenda`. O filtro OData de tipoBoletim não é usado por incompatibilidade observada. Horários recebem offset explícito `-03:00`. Valores brutos preservados; exibição BRL com duas casas, sem texto PTAX ou datas visíveis, com referência no tooltip. Cotações em todas as larguras quando disponíveis; desktop ampliado de 13px para 16px, mobile permanece em 13px.

Clima removido integralmente nesta revisão: sem cliente, tipos, provider, coordenadas, política de cache, configuração ou chamadas meteorológicas. `/api/weather` retorna 404. Não são necessárias chave Open-Meteo nem variável de avaliação. Dados antigos eventualmente persistidos no Durable Object não são mais acessados; migração compartilhada com notícias/cotações permanece intacta.

Redes sociais e relógio de Brasília preservados. Relógio isolado usa `America/Sao_Paulo`. Header principal, logo, menu, Hero e players sem mudança funcional. Aplicativos continuam ocultos com URLs nulas; destinos não são inventados. Pendências de grade, galeria e privacidade seguem `src/data/content/services.ts`.

## Desenvolvimento e portabilidade

Node 22.16+ e pnpm compatível com allowBuilds. Wrangler fixado em 4.151.2. Bibliotecas e dependências de runtime existentes preservadas; nenhuma nova dependência nesta revisão.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm dev:worker
```

Prévia completa em localhost:8787. Para HMR executar também `pnpm dev`, com proxy /api para o Worker. `pnpm preview` sozinho não executa APIs. Prévia local desta revisão: localhost:8788, iniciada com `pnpm exec wrangler dev --ip 127.0.0.1 --port 8788 --persist-to .wrangler/editorial-validated`.

Variável opcional servidor: `FRONTEND_ORIGIN`, origem HTTPS exata autorizada para CORS. Frontend opcional `VITE_API_BASE_URL` para backend próprio. Sem curingas/credenciais CORS ou proxy aberto. Vercel/Hostinger continuam usando build estático e precisam de Worker/proxy para APIs. Nenhum segredo é versionado; .dev.vars\* permanece ignorado exceto exemplo.

## Validação desta revisão

Typecheck, lint, build e 23 testes passaram. Testes cobrem RSS seguro, ordenação, deduplicação, imagem ausente, cache frio/quente, TTL de 900 segundos, persistência, concorrência, falhas/backoff, timeout, PTAX/fuso, roteamento/CORS, 404 do endpoint removido e limites de largura dos layouts; incluem os testes anteriores de conteúdo e HLS.

No navegador: amplo (1440px) com 4 cards, principal 16:9, secundárias 1:1 e base exata alinhada; intermediário (900px) com 4 cards 2×2 e todas imagens 16:9, sem overlay; compacto (375px) com 5 cards únicos, sem lista, resumos ou metadados dentro dos cards. Sequência compacta corresponde às cinco primeiras URLs dos dez destinos únicos do layout amplo. Links G1 seguros verificados. Larguras adicionais 1280, 1180, 1024, 768, 730, 700, 600 e 320px sem overflow. Home compacta também validada, menu por Space/Escape e TV reproduzindo muda (readyState 4).

Worker local: notícias reais (10), segunda consulta reutiliza updatedAt, /api/weather HTTP 404. Capturas locais em qa/noticias-responsivas-{amplo,grade,compacto}.jpg. Nenhum commit, push, merge ou deploy nesta revisão; branch `codex/noticias-responsivas` parte da main anteriormente publicada.
