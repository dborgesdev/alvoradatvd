# Rede Alvorada — Especificação V1

## Estado e objetivo
V1 de portal multiplataforma com rádio, TV, notícias, programas, promoções e conteúdo institucional. A prévia utiliza dados locais, sem WordPress nesta fase. Não apresentar demonstrações como notícias ou fatos reais.

## Fonte de verdade
Briefing comercial em `docs/briefing-comercial.txt`, conteúdo integral do PDF em `docs/institucional-fonte.txt`, configurações em `src/data/content/`. Em caso de divergência, marcar pendente em vez de presumir. Não incluir preço de desenvolvimento no site público.

## Marca e visual
Usar `public/assets/brand/logo-alvorada.png` como marca principal, preservando o desenho. Identidade derivada do azul intenso, laranja solar e vermelho da marca; base editorial clara e seções de transmissão em azul-noite. Tipografia contemporânea, títulos fortes, grid editorial com boa densidade e respiro. Evitar template genérico de rádio e excesso de cartões iguais. Visual de portal de mídia regional premium, com primeira dobra marcante, notícias em destaque e acesso imediato a Rádio/TV.

## Páginas e estrutura
- `/`: Header, manchete principal demonstrativa claramente identificada, acesso Rádio/TV, destaques editoriais, esportes, vídeos/programas, institucional resumido, CTA contato, Footer.
- `/radio`: player preparado para stream pendente, estado vazio elegante e explicativo, sem áudio falso.
- `/tv`: player HLS real com tratamento de falha e fallback; evitar autoplay com áudio.
- `/noticias`: listagem, categorias, busca local simples e navegação para `/noticias/:slug`.
- `/noticias/:slug`: artigo local completo, metadados e navegação contextual.
- `/programas`: grade e embeds YouTube somente com IDs reais; enquanto ausentes, apresentar acesso ao canal oficial e estrutura demonstrativa.
- `/institucional` (ou `/sobre` com redirect coerente): transcrição INTEGRAL do texto do PDF, começando por Quem Somos, seguida de Sobre, Proposta, Resumo da Proposta, Resultado da Proposta, Objetivos, Objetivos específicos, Missão, Visão, Valores, Filosofia de trabalho, Estrutura, Para ouvir, Comercial e Resumo. Manter a ordem e cada parágrafo, sem correções editoriais não autorizadas. Separar a História do Rádio em página própria.
- `/historia-do-radio`: transcrever integralmente História do Rádio e Rádio no Brasil do PDF, nessa ordem; não confundir com a história da empresa. Texto histórico pode conter afirmações discutíveis; preservar como material fornecido, sem inserir fatos novos.
- `/equipe`: estado de conteúdo pendente, sem pessoas fictícias.
- `/promocoes`: estado de conteúdo pendente, sem sorteios inventados.
- `/contato`: contatos oficiais, redes e localização. Endereço/mapa pendentes de confirmação, pois o PDF contém dois endereços distintos.

## Copy e dados
Usar dados de `src/data/content/` e `docs/institucional-fonte.txt`. Texto institucional da página Sobre deve ser reproduzido integralmente, sem condensação, paráfrase, correção silenciosa ou omissão. Notícias demo devem exibir rótulo inequívoco 'Conteúdo demonstrativo', sem data falsa. Categorias são configuração, não evidência de cobertura efetiva.

## Conversão e contatos
WhatsApp Administração `5519996879753`; Jornalismo `5519971295550` (informado diretamente em conversa; PDF diverge no número). Botão flutuante de WhatsApp em todas as páginas com mensagem contextual `Olá! Entrei em contato pelo portal da Rede Alvorada e gostaria de falar com a equipe.` e `encodeURIComponent`. Contatos separados por finalidade na página de contato. Crédito exato em todo Footer: `Desenvolvido por Douglas Borges - Smart Local`, link https://smartlocal.com.br, target _blank, rel noopener noreferrer.

## Players
Rádio: URL real nula; usar áudio de demonstração local livre de direitos e identificado como demonstração, se o arquivo estiver disponível. Na ausência de áudio demo, exibir player sem reprodução simulada. Implementar hook/adapter isolado para adicionar URL depois. TV: HLS `https://v01.taaqui.org/alvoradafm/alvoradafm/chunklist_w1354410473.m3u8`. Utilizar suporte HLS nativo quando disponível e `hls.js` como fallback, limpeza correta no unmount, tratamento de erro, loading e controles acessíveis. URL pode ser temporária: não garantir disponibilidade e documentar validação junto à Taaqui. Nunca proxyficar stream sem necessidade.

## YouTube
Canal oficial https://www.youtube.com/@alvoradatvd. Não inventar IDs; `programs.ts` suporta IDs de vídeo reais. Em V1, acesso ao canal e área visual de programas; embeds individuais só se houver IDs confirmados. Preparar lazy load de iframes.

## Dados e integração futura
Arquivos em `src/data/content/` são a fonte da V1. Criar interfaces/tipos e adaptadores ou funções de acesso em `src/lib/content/` para que componentes não dependam diretamente de formato WP. No futuro, implementar WordPress REST API para notícias, programas, equipe e promoções mantendo os mesmos contratos. Não instalar nem simular backend na V1. Rotas de artigos funcionam com dados locais.

## Assets
Logo original tratado, favicon derivado e fotos ilustrativas em `public/assets/editorial/`. Imagens geradas são conceitos e não fotos da sede/equipe ou eventos reais. Evitar usar imagens conceituais como prova factual. Preparar OG a partir da marca e fundo gráfico, sem textos de notícias fictícias.

## Motion design
Hero com revelação sutil, destaque ao player ao trocar Rádio/TV, transições responsivas de cards, microinterações em botões e navegação. Respeitar `prefers-reduced-motion`, sem conteúdo oculto se motion falhar. Sem animações pesadas repetitivas.

## Stack, estrutura e deploy
React + TypeScript + Vite SPA + Tailwind CSS + pnpm, roteamento cliente simples. Componentes por seção e página, separados de dados, serviços, hooks e tipos. `App.tsx` só compõe providers/rotas/layout. Build `pnpm build`, saída `dist/`. Preparar Vercel para preview e configuração de rewrite SPA; Hostinger estática possível no futuro com `.htaccess` adequado, sem alterar configurações existentes de hospedagem. WordPress futuro pode ficar em subdomínio a definir; não fixar domínio da API.

## SEO, acessibilidade e performance
Metadados por rota, títulos, descriptions, canonical do domínio quando efetivamente publicado, OG, Twitter, favicon, robots e sitemap de rotas públicas. Não indexar notícias demonstrativas nem páginas de conteúdo vazio. Imagens com alt apropriado, contraste, foco, navegação teclado, menu mobile, lazy loading e imagens otimizadas. Evitar canonical de produção no preview se causar indexação indevida.

## Pendências
Bloqueantes para ativar rádio: URL do stream. Para localização precisa: confirmar endereço, pois o PDF apresenta Rua Zacarias Costa Camargo, 206 e Rua Ercílio Antônio Meira, 672. Para vídeos embutidos: IDs reais de vídeos. Para conteúdo real: fotos, equipe, promoções, matérias. Para produção: configuração da hospedagem, DNS, HLS estável e integração WordPress. Não bloqueiam a V1 visual.

## Critérios de aceite
V1 navegável e visualmente acabada em 375/768/1024/1440px; rotas funcionais; player TV com tratamento de erro; rádio em estado pendente; conteúdo demo rotulado; sem nomes, notícias, equipe, promoções ou datas inventadas; SEO básico, performance, acessibilidade e motion; todos os componentes separados por responsabilidade; `pnpm typecheck`, `pnpm lint`, `pnpm build` conforme scripts existentes; validação de deploy estático e ausência de segredos; sem commit/push/merge antes de aprovação.


## ADENDO APROVADO — transmissão e hierarquia da home (20/10/2026)
Este adendo prevalece sobre descrições conflitantes anteriores.

### Hero e TV
- Hero em duas colunas no desktop: título, apoio e CTAs à esquerda; TV ao vivo 16:9 à direita, em moldura audiovisual premium, sem sacrificar área visível do vídeo. No mobile, empilhar de modo legível.
- TV deve tentar carregar e reproduzir automaticamente SEM SOM (`muted`, `playsInline`); fornecer controle explícito para ativar som, pausar, retomar e fullscreen. Autoplay é best-effort, nunca prometer que funciona em todo navegador.
- Preferir URL de playlist mestre/estável quando a Taaqui fornecer; usar o endereço atual enquanto válido. Estado de falha com retry manual. Não colocar TV tocando som por padrão.

### Barra de rádio persistente
- Logo abaixo do Hero, renderizar player de rádio horizontal com logo, estado, play/pause, volume, acessibilidade e badge DEMONSTRAÇÃO enquanto stream não for confirmado.
- Para prévia, adicionar áudio de exemplo LOCAL, licenciado para uso, com origem/licença documentadas. NÃO usar áudio protegido sem permissão, não usar stream aleatório de terceiros, não representar demo como programação ao vivo. Se não houver arquivo legítimo, não inventar reprodução: mostrar controles com estado de espera.
- Após a barra sair pela parte superior da viewport, converter visualmente para player flutuante fixo, glassmorphism (backdrop blur com fallback), sombra multicamada, borda com brilho e profundidade 3D sutil; evitar transformação que prejudique legibilidade ou hit targets. Transição suave sem salto de layout (usar sentinela com IntersectionObserver). Quando a barra voltar ao viewport, retornar à posição original.
- Manter uma única instância de HTMLAudioElement em provider/layout persistente entre rotas; player não reinicia ao navegar. Não sobrepor navegação mobile, CTAs, banners ou rodapé; z-index e safe areas coerentes. Teclado, foco, aria, touch, `prefers-reduced-motion`. Evitar rolagem bloqueada e scroll-jank.
- Definir um único `src/data/content/streams.ts` para URL real e demo. A futura troca para stream real não deve exigir modificar componentes visuais.

### Conteúdo institucional integral
- `docs/institucional-fonte.txt` é fonte primária. Criar `src/data/content/institutional.ts` com TODAS as seções transcritas, preservando integralmente conteúdo e parágrafos. Não usar versões resumidas que já existam no arquivo.
- Ordem de `/institucional`: Quem Somos primeiro, depois Sobre, Proposta, Resumo da Proposta, Resultado da Proposta, Objetivos, Objetivos específicos, Missão, Visão, Valores, Filosofia de trabalho, Estrutura, Para ouvir, Comercial, Resumo. Navegação por âncoras permitida, mas sem cortar texto.
- Página `/historia-do-radio`: História do Rádio, depois Rádio no Brasil, textos integrais do PDF. Não confundir datas/atribuições históricas do PDF com fatos verificados independentemente.
- O PDF contém cabeçalhos, rodapés, números de página e contatos repetidos: tratá-los como metadados/documentação, não como parágrafos institucionais; contatos públicos seguem validação do briefing.

### Critérios adicionais de aceite
- Testar TV autoplay mudo, unmute voluntário, erro HLS, pausa, fullscreen e mobile.
- Testar rádio antes/depois do limiar de scroll, transição de posição, rolagem reversa, troca de rota sem interrupção, volume, teclado, reduced motion e demonstração claramente identificada.
- Conferir integralidade textual da página Sobre e História do Rádio contra o PDF, seção por seção, inclusive parágrafos.

## ADENDO APROVADO — notícias, páginas e navegação (27/10/2026)

Este adendo prevalece sobre as descrições anteriores conflitantes. Implementação para avaliação na branch `codex/paginas-navegacao`, sem merge/deploy nesta etapa.

- Home: título editorial “Aconteceu, na Rede Alvorada virou notícia”, sem eyebrow G1 e sem link Todas as notícias nesse cabeçalho. Metadados visuais da fonte e rodapé de atribuição removidos; CTA genérico “Ler matéria” conforme orientação posterior. Origem técnica preservada em `FeedArticle.source`, URLs e tooltip dos links. Texto contextual identifica curadoria de matérias externas e não atribui autoria à Alvorada. RSS G1, cache 900s, links em nova aba e regras responsivas aprovadas (1+3, 2×2, cinco cards compactos) preservados.
- Direitos da fonte: consulta em 27/10/2026 aos Termos Gerais disponíveis em https://ajuda.globo/google/amp/cartolafc/faq/politica-de-seguranca.ghtml. Os termos protegem conteúdo e sinais de titularidade e restringem usos sem autorização. Não foi encontrada licença específica do RSS que dispense créditos ou autorize republicação comercial. Nenhuma marca d’água, assinatura ou crédito incorporado às imagens foi removido; títulos/textos da fonte não foram reescritos. Confirmar licença e exigências específicas com o titular antes de publicação definitiva. Não há alegação de afiliação à Globo/G1.
- Banner esportivo substituído por `RegionalNewsBanner`, com copy regional aprovada e CTA para `/noticias`. Usa `region-v2.webp`, imagem conceitual já existente/licenciada no inventário; não identifica Campinas real ou fato noticioso. O alt explicita o caráter conceitual. Não há futebol no banner.
- `/programacao`: nova página demonstrativa por dia da semana, com horários e faixas ilustrativos rotulados, sem apresentadores inventados ou indicação de programa no ar. Dados em `src/data/content/schedule.ts`, contrato `ScheduleEntry`, adapter local `src/lib/content/collections.ts`; futura fonte WordPress substituível sem acoplamento do JSX ao REST. CTAs TV/rádio existentes.
- `/galeria-de-fotos`: álbuns demonstrativos separados dos componentes, sem alegação de eventos, equipe ou instalações reais. `GalleryAlbum` e `GalleryPhoto` incluem IDs, descrição, capa, categoria, ordem, fotos e alt; data nula enquanto não houver data real. Imagens conceituais locais, contagem derivada das fotos e lightbox modal nativo com teclado, Escape, foco restaurado e controles anterior/próxima.
- `/politica-de-privacidade`: minuta organizada a partir dos recursos efetivos, fundamentada na LGPD (https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm). Inspeção do código: nenhum formulário/cadastro, analytics/pixel, escrita de cookies/localStorage/sessionStorage; contatos via links WhatsApp/mailto; HLS externo Taaqui, imagens remotas do RSS, Worker Cloudflare, PTAX server-side; YouTube só se houver IDs (atualmente nulos). Não presume logs/retencão/configuração da infraestrutura. Identificação do controlador, contato de privacidade, bases legais, retenção e contratos/transferências ficam explicitamente pendentes de validação; sem datas de vigência inventadas.
- `/promocoes`: página e rota removidas. Acessos antigos apresentam a página não encontrada preexistente; não há redirecionamento enganoso para privacidade. Nenhum menu aponta para Promoções. Equipe continua como destino principal; dropdown preserva Sobre e História do Rádio, e adiciona a política correta.
- Header: Home, Notícias, Programação, Programas, Galeria de Fotos, Equipe, Contato, Institucional. Menu compacto quando não há espaço para todos os itens; mobile com rolagem interna para comportar a lista e sem posicionamento fixo de linha para o dropdown. Sem Chat.
- SEO: política central de rotas em `src/data/content/route-policy.json`, compartilhada pelo hook e gerador de sitemap/robots. Programação, galeria e política em revisão são noindex e ficam fora do sitemap; preview inteiro permanece noindex sem domínio público configurado. Canonical usa origem configurada ou origem real da prévia, sem presumir domínio definitivo. Titles, descriptions, OG/Twitter e headings das novas páginas.
- Nenhum CMS, login ou integração WordPress implantado. Rádio persistente, TV HLS, logo e textos institucionais integrais preservados. Conteúdo real de grade/álbuns e aprovação da privacidade continuam necessários antes de torná-los definitivos.

### Validação da entrega de páginas (27/10/2026)

- Executados typecheck, lint, build e 25 testes, incluindo integridade dos dados demonstrativos, assets/IDs e política de rotas/noindex; os testes existentes de conteúdo integral, HLS e RSS/cache permanecem.
- QA no navegador: 16 combinações entre Programação, Galeria, Privacidade e Notícias em 320, 375, 768 e 1440px, sem overflow ou imagens quebradas. Titles, canonical, OG e noindex conferidos.
- Grade: sete abas, setas/Home/End e painel correspondente; nenhum estado “no ar” demonstrativo. Galeria: abertura via Space, anterior/próxima por setas, Escape, retorno de foco e ciclo de Tab/Shift+Tab; modal centralizado no mobile. Álbuns usam assets fotográficos conceituais locais e a fotografia histórica CC0 já documentada, com crédito/link de origem; não representam a emissora.
- Header mobile: todos os novos destinos presentes, submenu Institucional abre e Política de Privacidade chega à rota correta, fechando o menu. Nenhum link de Promoções ou Chat.
- Home: título solicitado, CTA “Ler matéria”, ausência visual de G1 no bloco editorial, destinos originais e rel seguros, banner regional para /noticias. TV verificada em reprodução muda (readyState 4); rádio manteve uma instância e continuou tocando ao navegar entre Galeria e Programação.
- Nenhum commit, push, PR, merge ou deploy. Prévia local completa entregue após build; versão publicada preservada.
