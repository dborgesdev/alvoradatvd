# Integração WordPress — revisão de 30/10/2026

Implementada na branch `codex/integracao-wordpress`, sem commit, push, merge ou publicação remota. O diretório `wordpress/` da entrega anterior foi preservado. Nenhum plugin, CPT, campo ACF, taxonomia ou registro remoto foi modificado.

## Fonte verificada

As cinco coleções públicas responderam HTTP 200, com `X-WP-Total` e `X-WP-TotalPages`. A leitura confirmou:

- Programa ID 32, **24h de Música**, categoria Música, apresentador relacionado ID 30 e faixa `00:00–23:59` nos sete dias, tipo `ao_vivo`.
- Equipe ID 30, **Auto DJ**, cargo DJ, `exibir_site: true`.
- Álbum ID 27, **Memória da Comunicação**, categoria Institucional, data `2026-10-30`, local Brasil, fotografias **37 e 36**, nessa ordem. A capa ID 28 é independente das fotografias internas.

Esses registros são o conteúdo de validação cadastrado no painel, não uma verificação de fatos sobre pessoas/eventos. A descrição do álbum que o identifica como exemplo foi preservada.

Base pública: `https://painel.alvoradatvd.com/wp-json/wp/v2/`.

| Coleção WordPress | Uso | Recurso no Worker |
| --- | --- | --- |
| `programas` | Programas, grade e seção de programas da home | `/api/programs` |
| `equipe` | Integrantes visíveis e resolução de apresentadores | `/api/team` |
| `albuns` | Capas, dados dos álbuns e fotografias resolvidas | `/api/albums` |
| `categorias-programa` | Nomes das categorias dos programas | Incluído em `/api/programs` |
| `categorias-albuns` | Nomes das categorias dos álbuns | Incluído em `/api/albums` |

Parâmetros: `acf_format=standard`, `_embed=wp:featuredmedia`, `per_page=100`, `page=N`, `orderby=id`, `order=asc`, `context=view`; posts usam também `status=publish`. Não existem consultas individuais de mídia, apresentadores ou novos endpoints WordPress. As URLs de origem são fixas no servidor, não fornecidas pelo visitante.

Todas as páginas indicadas pelos cabeçalhos são consultadas. Uma página que falhe, cabeçalhos ausentes, contagem inconsistente ou IDs duplicados rejeitam a atualização inteira, sem substituir o cache por uma coleção parcial. O limite explícito de segurança é 100 páginas por coleção (10 mil registros), 10 MB por resposta e 10 segundos por requisição. Exceder os limites produz falha visível, nunca truncamento silencioso. Coleções desse porte também devem ser reavaliadas conforme os limites de subrequests do plano Cloudflare.

## Arquivos e contratos

- `worker/wordpress.ts`: consultas públicas paginadas e composição de coleções.
- `worker/index.ts`, `worker/cache.ts`, `worker/sources.ts`: o Durable Object existente recebe os novos recursos, reutilizando armazenamento, concorrência e backoff. Sem novas migrações ou bindings.
- `src/types/wordpress.ts`: contratos REST; `src/types/editorial.ts` e `src/types/collections.ts`: modelos do frontend.
- `src/lib/content/wordpress.ts`: adaptação, texto seguro, URLs, imagens, relações, datas e faixas.
- `src/lib/content/resources.ts`: singletons de consulta; `src/hooks/useService.ts`: atualização conforme TTL e visibilidade. Programas, Programação e home usam o mesmo `programsResource`.
- `src/lib/content/collections.ts`: construção da semana sem acesso à rede.
- `ProgramsSection`, `ScheduleSection`, `TeamSection`, `GallerySection`: apresentação; `GalleryLightbox`: mantém modal, teclado, Escape e restauração do foco.
- `EditorialState` e `EditorialImage`: estados e imagens compartilhados.

Os exemplos antigos em `src/data/content/programs.ts`, `team.ts`, `gallery.ts` e `schedule.ts` são referências históricas cobertas por testes; as telas integradas não os importam nem os usam como fallback. Os nomes dos dias estão separados em `weekdays.ts`.

Somente `acf.exibir_site === true` inclui um integrante e permite resolver seu nome como apresentador. Publicações protegidas por senha e não publicadas são excluídas. Campos opcionais vazios não criam conteúdo visual fictício. Descrições e biografias preservam texto e separações de parágrafos; formatação HTML é removida deliberadamente, sem `dangerouslySetInnerHTML`. Links aceitam HTTPS sem credenciais; redes sociais exigem os domínios correspondentes. Embeds são construídos apenas para IDs válidos de YouTube, em `youtube-nocookie.com`; outros vídeos seguros recebem link externo.

Imagens destacadas usam o `_embedded` existente, com dimensões, alt original, `srcSet` dos tamanhos disponíveis de proporção compatível e `sizes`. A galeria preserva a ordem de `fotografias_resolvidas`, sem inserir a capa na lista; o lightbox usa a URL original maior e suas dimensões. Nenhum tamanho/URL é inventado. Álbuns sem fotografias mostram contagem zero e não abrem modal vazio. Fotos sem alt no painel mantêm alt vazio; recomenda-se preencher esse conteúdo na origem.

As faixas usam segunda=1 até domingo=7. Uma faixa domingo `23:00–01:00` produz domingo `23:00–24:00` e segunda `00:00–01:00`, com indicação de continuação. Fim `00:00` não cria trecho vazio no dia seguinte. Faixas inválidas não são exibidas. A grade mostra os horários cadastrados, apresentados como horários de Brasília; conferir a convenção/fuso com o operador. Não existe indicador automático “No ar agora”. “Ao vivo” indica apenas o tipo cadastrado da faixa.

## Cache e propagação

- Durable Object existente: TTL **300 segundos** para programas, equipe e álbuns. Novos dados são buscados sob demanda na primeira consulta depois do TTL, sem webhook ou tarefa agendada.
- Navegador: TTL **60 segundos**, compartilhamento de consulta em andamento e cache em memória. Não há cookies/localStorage para a integração. O hook reavalia a cada 60 segundos enquanto a página está visível.
- Alterações normais em programas, horários e álbuns aparecem em aproximadamente **5–7 minutos** numa página aberta e visível, mais o tempo da rede. Novas navegações reutilizam a versão disponível, respeitando o TTL.
- Nomes/visibilidade dos apresentadores têm a dependência adicional do cache de equipe usado ao montar programas. No pior alinhamento dos dois TTLs, mudanças nessa relação podem levar aproximadamente **10–12 minutos**. A página Equipe usa diretamente seu próprio TTL.
- Falha de atualização: última resposta realmente recebida por até **uma hora**, com aviso explícito de versão anterior; depois, estado de falha. Cache frio em falha retorna `data:null`/HTTP 503; coleção vazia válida retorna `data:[]`/HTTP 200. Backoff compartilhado de 60 segundos.
- Cabeçalho `Cache-Control: no-store` evita um terceiro cache opaco nas respostas da aplicação. CORS existente e suas origens autorizadas permanecem inalterados.

## Verificações executadas

- `pnpm typecheck`, `pnpm lint`, `pnpm build`: aprovados.
- `pnpm test`: **36 testes aprovados**. Incluem os anteriores de textos integrais, RSS/PTAX, cache/CORS e HLS; os novos cobrem adaptadores, apresentadores, booleano estrito de visibilidade, campos opcionais, texto/URLs seguros, capa independente, ordem/dimensões das fotos, paginação, coleção incompleta, grade/madrugada, concorrência e propagação de edições por relógio simulado.
- `pnpm exec wrangler deploy --dry-run --outdir qa/wordpress-worker-build`: aprovado; bundle compatível com Worker e bindings existentes, sem upload/deploy.
- Runtime local Wrangler: `/api/programs`, `/api/team` e `/api/albums` retornaram HTTP 200 com os registros reais descritos acima. Nenhum acesso administrativo.
- Navegador: as quatro páginas em **375, 768 e 1440 px**, total de 12 combinações, sem overflow horizontal ou imagens quebradas detectadas. Layouts e apresentação conferidos visualmente.
- Grade: dias e horários reais, navegação por teclado com End selecionando domingo.
- Galeria: fotos 37 e 36 na ordem da API, imagem maior carregada, ArrowRight, Escape e retorno de foco ao botão do álbum.
- Equipe: Auto DJ aparece com foto, cargo e biografia, sem placeholder de preparação.
- Rádio: uma instância continuou reproduzindo ao navegar de Galeria para Programação. TV: autoplay mudo, `paused:false`, `readyState:4`, sem erro de mídia no teste.
- Rotas, metadados, políticas noindex existentes, Header, logo e players preservados. A copy de conteúdo pendente foi atualizada nas páginas integradas, no aviso do rodapé e na minuta de privacidade, mantendo o crédito obrigatório.

## Limites de validação

Não foi criada/alterada uma publicação remota para testar propagação: esse caso foi validado com relógio e dados simulados. A origem tinha uma página por coleção e somente um integrante visível; paginação múltipla e `exibir_site:false` foram testados por fixtures. Vídeos/playlists estavam vazios no programa real, portanto os contratos/URLs foram testados por fixtures, sem reprodução de um vídeo cadastrado pelo operador.

Faixas atravessando meia-noite e dias sem grade também não estavam no conteúdo público disponível; a divisão foi validada em testes automatizados. Falhas e conteúdo vazio foram testados de forma isolada, sem interromper o WordPress real. Conteúdo remoto, disponibilidade dos streams e alt das fotos dependem do cadastro/serviço externo.

## Revisão local

```sh
pnpm build
pnpm dev:worker
```

Abrir `http://127.0.0.1:8787/programas`, `/programacao`, `/equipe` e `/galeria-de-fotos`. Para HMR, manter o Worker ativo e executar também `pnpm dev`; o Vite usa o proxy `/api` já existente. Os ports podem variar se já estiverem em uso.

Nenhuma publicação definitiva foi realizada. Para produção, a revisão e a autorização de deploy continuam necessárias. A hospedagem estática alternativa Vercel/Hostinger requer um backend Worker disponível e `VITE_API_BASE_URL`/CORS apropriados, como antes; não há acesso direto ao WordPress pelo JSX.
