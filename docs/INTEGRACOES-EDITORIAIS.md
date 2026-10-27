# Editorial e faixa superior — implementação para aprovação

Implementação incremental em `feat/editorial-servicos`. Sem commit, push, PR, merge ou publicação nesta tarefa.

## Runtime e configuração

A V2 era uma SPA Vite servida como Workers Static Assets. O mesmo `wrangler.jsonc` agora aponta para `worker/index.ts`, preserva o binding `ASSETS` e o fallback SPA, e executa o Worker antes dos assets somente em `/api/*`. Não há servidor Node em produção.

O binding `EDITORIAL_CACHE` é um Durable Object SQLite, com migração `v1-editorial-cache`. Um ID nomeado (`public-services-v1`) centraliza os três serviços para todos os visitantes; não é um cache por renderização, navegador ou ponto de presença. O objeto persiste a resposta válida em storage, reúne consultas simultâneas por chave e aplica backoff compartilhado de 60 segundos após falhas.

Nenhum recurso Cloudflare foi criado remotamente. O próximo deploy aprovado deverá aplicar a migração e o binding; verificar os limites e condições do plano Cloudflare utilizado. Não remover o histórico de migrações em futuros deploys.

## Endpoints

| Endpoint | Fonte | Validade | Última resposta válida durante falha |
| --- | --- | --- | --- |
| `/api/news` | RSS G1 Campinas e Região | 900 s | Até 24 h, explicitamente marcada como anterior |
| `/api/rates` | Banco Central/PTAX | 1800 s | Até 7 dias, sempre com data do fechamento e indicação de resposta anterior |
| `/api/weather` | Open-Meteo, coordenadas fixas de Campinas | 900 s | Até 1 h, com indicação de leitura anterior |

JSON: `{ data, updatedAt, stale, unavailable? }`. Sem XML ou descrição HTML integral no frontend. O timestamp `updatedAt` indica a consulta, e não a publicação da notícia nem a hora do boletim PTAX. Dados preservam suas datas de referência próprias. Os endpoints enviam `Cache-Control: no-store` para evitar um segundo cache opaco no navegador; o TTL compartilhado é aplicado dentro do Durable Object.

Só há GET, três caminhos conhecidos e URLs de origem fixas. Querystrings do visitante não alteram destinos ou chaves. Não há proxy aberto. Timeout de 10 segundos inclui leitura da resposta, com limite de 2 MB para o RSS e 100 KB para as outras APIs. Redirecionamentos são recebidos em modo `manual` e rejeitados por status, compatível com o runtime Workers.

## RSS e apresentação

Fonte confirmada: <https://g1.globo.com/rss/g1/sp/campinas-regiao/>.

Parser XML leve (`fast-xml-parser`), exclusivo do Worker. Valida XML e rejeita DOCTYPE/ENTITY; limita o volume de itens processados, os textos e a resposta. Ordena por `pubDate` decrescente, descarta datas inválidas/futuras, elimina duplicatas por URL ou GUID e retorna até dez itens. Resumo prioriza `atom:subtitle`; `description` só fornece texto curto quando necessário. Não há `dangerouslySetInnerHTML`.

Links exigem HTTPS e host exato `g1.globo.com`. Imagens priorizam `media:content`, com HTTPS e hosts `glbimg.com`/subdomínios. Não se extraem fotos do HTML de descrição. Ausência ou erro de imagem gera bloco neutro, nunca fotografia conceitual. Imagens não são baixadas/republicadas pelo Worker. As URLs assinadas não são alteradas para inventar variantes `srcSet`; o feed consultado não oferece variantes verificadas. CSS reserva proporção e limita dimensões; loading é lazy, com decoding assíncrono.

Home e `/noticias` compartilham `FeedNews`: primeira notícia com maior destaque, três secundárias e até seis itens em lista sem imagem. Todos os links das matérias usam a URL original, `_blank` e `noopener noreferrer`. Há fonte, resumo curto, data em Brasília e sinalização de conteúdo publicitário quando o caminho da fonte contém `/especial-publicitario/`.

As antigas páginas demonstrativas continuam acessíveis apenas pelas rotas preexistentes, para preservar compatibilidade; nenhum item G1 aponta para elas e nenhuma página interna de notícia G1 foi criada. O CTA de esportes usa a busca textual `busca=esporte`, sem inventar categorias que o RSS não fornece.

Direitos: títulos, resumos e imagens pertencem à fonte e respectivos titulares. Atribuição e link são visíveis; não há republicação de texto integral. A existência de um RSS não foi tratada como licença irrestrita de imagens. O responsável editorial deve confirmar as condições de uso comercial aplicáveis junto ao titular antes da publicação definitiva.

## PTAX e clima

- PTAX: <https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/documentacao>. Consulta um período de 14 dias para USD e EUR, selecionando no servidor da aplicação o último boletim **Fechamento** válido e o campo **cotacaoVenda**. Exibe `USD · R$` e `EUR · R$`, data e rótulo de fechamento; não apresenta como cotação em tempo real. Horários recebidos do BCB recebem offset explícito `-03:00`, com normalização das frações de segundo.
- Na API real, o filtro OData de `tipoBoletim` retornou HTTP 400. A implementação usa uma consulta limitada a 200 registros e faz a seleção e ordenação localmente no servidor, sem esse filtro incompatível.
- Clima: Open-Meteo em `latitude=-22.9099`, `longitude=-47.0626`, campos `temperature_2m` e `weather_code`, timestamps Unix. Sem geolocalização. O rótulo visual pedido é **Hortolândia, SP**, e a referência meteorológica é **Campinas, SP**, explicitada no título acessível do widget. Não são dados de uma estação confirmada em Hortolândia.
- API gratuita Open-Meteo somente para avaliação/prototipagem, habilitada explicitamente por `WEATHER_EVALUATION=true`. Produção comercial deve fornecer `OPEN_METEO_API_KEY`, usando `customer-api.open-meteo.com`. Sem chave nem avaliação habilitada, o clima fica oculto. Não foi contratado plano nem criada assinatura. Termos: <https://open-meteo.com/en/terms>; avaliação e planos: <https://open-meteo.com/en/pricing>.

## Faixa, relógio e navegação

Faixa compacta nas cores da V2, com redes sociais já confirmadas nos dados existentes. Instagram, Facebook e YouTube possuem ícones reconhecíveis, nomes acessíveis e links em nova aba. O relógio fica em componente próprio (`BrasiliaClock`) e só ele atualiza a cada segundo; usa `Intl` com `America/Sao_Paulo`, independentemente do fuso do dispositivo.

Cotações são ocultadas em tablet/mobile para não comprimir o Header. Mobile reorganiza relógio, redes e clima em duas linhas. Os providers/elementos de mídia e a lógica dos players não foram alterados.

Menu publicado nesta branch: Home, Notícias, Programas, Equipe e Contato, mais o dropdown Institucional preexistente para preservar Sobre/História/Promoções. Os acessos TV/Rádio continuam pelos CTAs e páginas existentes. Não há Chat.

Pendências sem links vazios, desabilitados ou destinos inventados:

- **Grade de Programação:** grade e horários reais não fornecidos. O placeholder de programas não foi apresentado como uma grade confirmada.
- **Galeria de Fotos:** não há acervo de fotos reais com identificação e autorização; imagens conceituais não foram apresentadas como galeria da emissora.
- **Política de Privacidade:** falta texto aprovado e confirmação dos tratamentos/controlador. Não foi criada política jurídica com afirmações presumidas.
- **Android/Apple:** URLs reais não fornecidas; campos nulos preparados em `src/data/content/services.ts`. Nenhum botão sem ação é exibido.

Essas pendências estão também registradas em `navigationPending`, no mesmo arquivo de configuração.

## Desenvolvimento e portabilidade

Requer Node 22.16+ para os testes TypeScript por type stripping e pnpm compatível com `allowBuilds`. Parser é dependência de runtime somente do Worker; Wrangler é dependência de desenvolvimento fixada em 4.151.2. `pnpm-workspace.yaml` autoriza apenas os builds de `esbuild` e `workerd`; `pnpm install --frozen-lockfile` foi validado.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm dev:worker
```

`dev:worker` serve assets e APIs em `http://127.0.0.1:8787/`. Para avaliação local do clima, copiar `.dev.vars.example` para `.dev.vars`, ou iniciar com `pnpm exec wrangler dev --port 8787 --var WEATHER_EVALUATION:true`. Não habilitar essa avaliação no ambiente comercial.

Para HMR, manter o Worker em 8787 e executar `pnpm dev`; o Vite tem proxy `/api` para esse Worker. `pnpm preview` sozinho serve apenas os arquivos estáticos e não executa endpoints; usar `pnpm preview:worker` para avaliação completa.

Vercel/Hostinger continuam recebendo o build estático. As APIs exigem o Worker; usar proxy `/api` para o backend ou `VITE_API_BASE_URL` apontando a uma origem HTTPS. Para chamada cross-origin ao Worker, configurar `FRONTEND_ORIGIN` com a origem HTTPS exata autorizada; CORS é fechado por padrão e não usa curingas ou credenciais. HTML/rotas SPA continuam no binding `ASSETS`.

Variáveis do servidor: `OPEN_METEO_API_KEY` (segredo, nunca `VITE_*`), `WEATHER_EVALUATION` (somente avaliação) e `FRONTEND_ORIGIN` (opcional). Binding: `EDITORIAL_CACHE`, via configuração versionada. `.dev.vars*` é ignorado, exceto o exemplo sem credenciais. Nenhum segredo foi adicionado.

## Validação

- `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test` e `pnpm build` aprovados. São **21 testes**, incluindo os nove anteriores. Novos testes cobrem parsing/sanitização, ordenação/limite, deduplicação por GUID/URL, imagem ausente, XML inválido/entidades externas, timeouts/limites HTTP, TTL, cache frio/quente, concorrência, persistência da resposta, backoff, expiração, PTAX, clima, fuso, roteamento e CORS. Avisos experimentais do Node para MockTimers/type stripping são esperados; falhas de provedores nos testes são deliberadas.
- `wrangler deploy --dry-run` validou a configuração e o bundle, sem publicação.
- Worker local real: `/api/news`, `/api/rates` e `/api/weather` retornaram HTTP 200. RSS forneceu dez itens; timestamps `updatedAt` se mantiveram em consultas consecutivas, inclusive após recarregamento do runtime com storage persistido. Expiração de 900 segundos e falhas/backoff foram testados com relógio controlado, sem esperar quinze minutos a cada caso.
- Amostra em 27/10/2026: PTAX retornou USD venda 5,5007 e EUR venda 6,1487, fechamento de 26/10/2026 às 13:09:51 de Brasília; clima de Campinas 22,6 °C com referência 11:45 de Brasília, exibido arredondado como 23 °C. Estes valores são evidência da amostra e não dados fixos do produto.
- Navegador Chromium: três imagens reais carregadas nos destaques, sete itens sem imagem na lista, dez destinos G1 verificados com `_blank` e `noopener noreferrer`. Busca com e sem resultados, fonte/atribuição e indicação publicitária verificadas.
- 30 verificações de rota/largura (375, 768 e 1440 px) sem overflow horizontal: Home, TV, rádio, notícias, programas, equipe, contato, institucional, história e promoções. Menus mobile foram abertos por teclado, fechados por Escape e após escolher Notícias; não há Chat, links vazios ou botões de app sem destino.
- Rádio tocou e o tempo avançou de 0,065 para 14,996 segundos ao navegar via cliente da Home para História do Rádio, com um único `<audio>` e flutuação superior/inferior preservada. TV carregou com `readyState=4`, `paused=false`, `muted=true` na Home e em `/tv`.
- O relógio foi observado avançando sem alterar os dados da faixa; a formatação em Brasília foi também verificada por teste com timestamp UTC que cai no dia anterior no Brasil.
- Harness ignorado `qa/editorial-states.html` usa resposta real capturada exclusivamente para mostrar falha sem dados, leitura anterior e imagens ausentes. No caso de falha, aparece o acesso direto ao G1; no de imagem ausente, nenhum `<img>` de notícia é renderizado. Nada disso é fallback de produção.
- A altura adicional da faixa exigiu um pequeno ajuste no enquadramento inicial da TV mobile para preservar os controles acima do rádio fixo. A lógica de mídia não foi alterada.
- Não foi executado Lighthouse, auditoria completa de acessibilidade, Safari/iOS nem teste em aparelho físico. `prefers-reduced-motion` existente foi preservado; a preferência do sistema não foi emulada.

### Arquivos envolvidos

Servidor: `worker/{index,types,sources,http,rss,providers,cache}.ts`, `wrangler.jsonc`. Contratos/cliente: `src/types/services.ts`, `src/lib/services/{client,format}.ts`, `src/hooks/useService.ts`. Editorial: `src/components/ui/FeedNews.tsx`, `src/components/sections/{NewsSection,NewsListingSection,SportsSection}.tsx`, `src/components/sections/feed-news.css`, `src/pages/NewsPage.tsx`. Header/faixa: `src/components/layout/{Header,UtilityBar,BrasiliaClock,ServiceIndicators,Footer}.tsx`, `src/components/layout/utility-bar.css`, `src/components/ui/SocialLinks.tsx`, `src/data/content/{editorial,services}.ts`. Enquadramento mobile: `src/components/ui/tv.css`. Ferramentas/documentação: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.json`, `eslint.config.js`, `vite.config.ts`, `.gitignore`, `.env.example`, `.dev.vars.example`, `tests/services.test.mjs`, `README.md` e este documento.

Evidências locais em `qa/`, fora do build e do Git. A prévia Cloudflare existente não foi modificada.

## Refinamento da faixa e composição editorial

A faixa apresenta relógio em linha única, ícones de 18px e PTAX formatada com duas casas decimais. Valores brutos e referências temporais permanecem preservados; as referências aparecem no tooltip das cotações. Os destaques são quatro (principal com overlay e três secundários), seguidos de seis notícias sem imagem. A ordem recebida do serviço é preservada. Foram retirados apenas os avisos visuais solicitados de imagens/conteúdo demonstrativo; a identificação do áudio demonstrativo permanece no rádio. Endpoints, cache e fontes não foram alterados neste refinamento.

### Validação do refinamento

Typecheck, lint, build e 22 testes passaram, incluindo o formato do relógio e a conversão de data através da meia-noite UTC. No navegador: quatro imagens reais, quatro destaques e seis itens sem imagem; dez links originais do G1 com nova aba e rel seguro. Conferidos desktop (1440px), tablet (768px), mobile (375px) e largura estreita (320px). Ajuste específico no Header em até 360px mantém o menu acessível. TV iniciou muda na Home e em /tv; rádio continuou entre rotas com uma única instância de áudio, flutuando no topo na Home. Menu validado por teclado, Escape e seleção de destino. Sem erros ou avisos no console da sessão de QA. Não houve commit, merge ou publicação.

## Header mais expressivo — revisão de 27/10/2026

Alterações restritas a `UtilityBar`, `AppLinks`, `BrasiliaClock`, `ServiceIndicators` e `utility-bar.css`. Redes sociais com vetores de 21px e áreas de 40px, superfícies azuladas e hover de 200ms com laranja; reduced motion elimina transições e deslocamento. Faixa desktop de 77px, separada do menu original. Horário maior e tabular, data secundária e relógio isolado para evitar atualizar o restante do Header.

Cotações permanecem visíveis em todas as larguras quando o serviço fornece dados; no mobile recebem linha própria. Clima oculto em até 420px, com integração/cache preservados. Aplicativos totalmente ocultos enquanto suas URLs forem nulas; apenas destinos confirmados serão renderizados como links. Não foram inventadas URLs nem modificadas fontes, valores ou cache.

Validação desta revisão: typecheck, lint e build passaram; 22 testes passaram. Navegador em 320, 375, 600, 768, 1024, 1280 e 1440px sem overflow, USD/EUR visíveis e aplicativos ausentes. Conferidos menus por Space/Escape, atributos dos três links sociais e reprodução muda da TV na Home (readyState 4). Console sem erros/avisos. Capturas locais em `qa/header-expressivo-desktop.jpg` e `qa/header-expressivo-mobile.jpg`. Nenhum commit, merge ou deploy.
