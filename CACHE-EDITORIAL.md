# Cache editorial e atualização da grade — 03/11/2026

Implementação local na branch atual (`main`, sem commit/merge/deploy), conforme a orientação final: **Durable Object somente para notícias e cotações**. Programas, equipe e álbuns usam apenas o cache da origem WordPress e a memória do frontend.

## Diagnóstico antes das alterações

Fluxo anterior: WordPress REST → `loadPrograms` → `EditorialCache`/`SharedCache` → JSON `/api/programs` → singleton `programsResource` → `adaptSlots`/`buildSchedule` → abas de Programação. A adaptação de domínio ocorre no servidor; a grade semanal é montada no cliente com o mesmo conjunto de programas usado pela página Programas.

O trecho anterior em `worker/index.ts` usava:

```ts
this.cache.get("wp-programs-v1", policies.wordpress, ...)
```

`worker/sources.ts` definia `wordpress: { ttl: 300, maxAge: 3600 }`. Em `worker/cache.ts`, `if (entry && age < policy.ttl * 1000)` devolvia esse registro sem consultar o WordPress. O cliente em `src/lib/services/client.ts` mantinha a resposta por mais 60 segundos e o hook verificava o TTL a cada minuto. Limpar o CDN ou o WordPress não invalidava o armazenamento do Durable Object.

Na captura inicial, antes de qualquer edição, a API WordPress já entregava `[6,7]` e `/api/programs` também, com `stale:false` e `updatedAt:2026-11-03T13:04:54Z`. A coleta ocorreu às 10:05 de Brasília. Foram comparadas tanto a URL informada quanto a URL paginada exata utilizada pelo Worker; ambas entregavam os mesmos dias. O navegador publicado mostrou ausência de segunda a sexta e presença aos sábados e domingos, **ainda antes da mudança**.

Assim, foi identificado o mecanismo de atraso nas camadas de cache, mas não reproduzida uma falha de transformação ou uma retenção indefinida. Sem uma captura anterior da resposta consumida no navegador, não é possível atribuir retrospectivamente todo o incidente a uma camada específica. A versão já havia se atualizado automaticamente quando foi inspecionada.

O WordPress informou `x-wp-cached-call: served-cache` e `cf-cache-status: DYNAMIC`, sem `Age`/TTL explícito. Isso demonstra cache REST na origem, mas não informa seu prazo ou sua implementação interna. Nenhuma configuração/plugin remoto foi alterado.

Não há Service Worker, pré-renderização da grade, cache de dados no build, uso de localStorage/sessionStorage ou fallback demonstrativo nessas páginas. `adaptSlots` usa somente os dias inteiros recebidos e uma grade vazia produz `[]`. `buildSchedule` não adiciona dias, exceto a continuação necessária de uma faixa que atravessa a meia-noite.

## Divisão implementada

| Conteúdo | WordPress | Cache no Worker | Cache no navegador |
| --- | --- | --- | --- |
| Programas e programação | Cache REST existente, controlado no painel | Nenhum | Memória por 60s, compartilhada entre Programas, Programação e home |
| Equipe | Cache REST existente | Nenhum | Memória por 60s |
| Álbuns/fotografias | Cache REST existente | Nenhum | Memória por 60s para os registros; imagens seguem os cabeçalhos da biblioteca |
| Notícias | Não se aplica | Durable Object: 900s; última válida por até 24h em falha | Memória por 900s |
| Cotações | Não se aplica | Durable Object: 1800s; última válida por até 7 dias em falha | Memória por 1800s |

As rotas WordPress são tratadas diretamente em `worker/index.ts`, antes de qualquer acesso ao binding `EDITORIAL_CACHE`. Cada consulta HTTP busca novamente suas coleções e resolve apresentadores e categorias, mantendo paginação e imagens embutidas. Não há Cache API, KV, banco, cron ou nova infraestrutura. O Durable Object retorna 404 para `/api/programs`, `/api/team` e `/api/albums`; somente `/api/news` e `/api/rates` podem ler/gravar seu cache.

O transporte Worker → WordPress usa `cache: "no-store"`, e `/api/*` responde `Cache-Control: no-store`. O navegador também solicita `cache: "no-store"`. Isso evita uma camada adicional de cache HTTP/CDN da aplicação; não desativa nem apaga o cache REST do WordPress. A memória do frontend permanece com TTL de 60s, consulta em andamento compartilhada e atualização no intervalo do hook. Ao voltar a uma aba visível, o TTL é reavaliado imediatamente. Um F5 cria novos singletons vazios, sem recuperar dados de armazenamento persistente.

Registros WordPress eventualmente existentes no Durable Object remoto antigo deixam de ser consultados quando esta versão for publicada. Não é preciso apagar o namespace ou sua migração, pois notícias e cotações continuam utilizando-o. Os bindings e as migrações atuais foram preservados. Nenhuma exclusão remota foi feita.

## Atualização e limpeza manual

1. Salvar o conteúdo no WordPress e, quando necessário, limpar o cache REST da origem.
2. Conferir que o endpoint público retorna a alteração.
3. Recarregar a página do portal: a consulta à origem é imediata, sem esperar TTL de Worker.

Sem recarregar, em uma aba visível com rede saudável, o limite conservador é **até 2 minutos, mais o tempo da rede, depois de a API REST disponibilizar a alteração**: até 60s de memória + até 60s de intervalo do hook. Não se pode prometer o mesmo prazo a partir do clique em Salvar enquanto o WordPress ainda devolver uma resposta antiga de seu próprio cache. Ao voltar de uma aba oculta, o frontend revalida o cache vencido sem esperar o próximo tick.

O servidor não mantém fallback de WordPress. Se a origem falhar, a rota responde 503 e o estado de falha é exibido. Em falha de rede sem resposta HTTP, o frontend pode manter a última versão real por até uma hora, com aviso explícito de versão anterior; depois descarta os dados. Recarregar descarta também esse fallback em memória.

## Verificações

- `pnpm typecheck`, `pnpm lint` e `pnpm build` aprovados; `pnpm test` com **49 testes aprovados**, sem falhas ou testes ignorados.
- Testes de ID 32 somente em sábado/domingo, grade vazia/ausente/inválida, múltiplas faixas, mudança posterior de dias/horários, virada domingo–segunda e preservação do apresentador.
- Fluxo completo com origem simulada alterada após a primeira leitura: o mesmo recurso do frontend atualiza de sete dias para `[6,7]`, depois para outro dia/horário e finalmente para grade vazia, sem purge ou rebuild.
- Teste garante que recarregar o frontend consulta dados atuais antes do vencimento do TTL da instância anterior.
- Testes usam um binding que lança erro se qualquer rota WordPress o acessar; todas continuam respondendo. O Durable Object é testado separadamente, rejeitando as três rotas sem tocar em storage e preservando cache/roteamento de notícias e cotações.
- Worker local em `http://127.0.0.1:8789`: programas, equipe e álbuns HTTP 200, `Cache-Control:no-store`; consultas consecutivas renovam `updatedAt`. Programa real ID 32 com `[6,7]`, `00:00–23:59`, apresentador Auto DJ.
- Navegador local: sete abas verificadas, programa ausente de segunda a sexta e presente em sábado/domingo. A página Programas continua exibindo o título e Auto DJ. Layout e estilos não foram modificados.
- Wrangler dry-run aprovado, com os bindings originais e sem publicação.

Não foram alterados registros WordPress para testar edições posteriores: esse cenário usa fixtures e relógio simulado. O conteúdo real confirma o caso atual `[6,7]`. A versão publicada não foi modificada nesta tarefa; a mudança de arquitetura só valerá nela após deploy autorizado.
