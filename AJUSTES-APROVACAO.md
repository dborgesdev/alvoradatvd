# Ajustes finais — 03/11/2026

Prévia isolada: https://alvoradatvd-aprovacao.smartlocal.workers.dev/

Branch: `codex/ajustes-aprovacao`, criada a partir do checkout que estava na `main`. Nenhum commit, push ou merge realizado nesta etapa. Nenhuma publicação no domínio principal ou substituição do Worker `alvoradatvd` ativo.

## Rádio

URL efetivamente utilizada pelo único elemento de áudio:

`https://s02.taaqui.org:9164/stream`

Sem proxy, URL alternativa ou fallback local. O arquivo demonstrativo foi retirado dos assets públicos e guardado somente em `qa/ajustes-aprovacao/`, ignorado pelo Git. Não faz parte do build.

O servidor respondeu por TLS válido com HTTP 200, `content-type: audio/mpeg`, identificação `icy-name: Alvorada Web Radio`, bitrate informado de 64 kbps e `Access-Control-Allow-Origin: *`. A reprodução no navegador da prévia HTTPS da Cloudflare confirmou que a conexão direta à porta 9164 funciona neste ambiente. O Worker não consulta nem retransmite o áudio; por isso não depende de suporte a essa porta no fetch de saída da Cloudflare. Nenhum proxy foi criado por hipótese.

O HTMLAudioElement continua no provider persistente. Sua reprodução começa apenas por Play. A camada de áudio separada controla eventos reais, carregamento, pausa, volume, erro e nova tentativa; um timeout de 20 segundos evita conexão eternamente em carregamento. “Reproduzindo” depende do evento `playing`, não da presença da URL. “Transmissão oficial” identifica a origem e não afirma que o áudio está conectado. Retry recarrega apenas a mesma fonte oficial.

Design, controles, dock flutuante, animações e comportamento responsivo foram preservados. A TV mantém a mesma configuração e implementação HLS independente.

## Política

Removidos o aviso destacado de minuta, seu CSS, as referências a minuta/revisão do documento e os rótulos provisórios em descrição e metadados. Preservadas as oito seções, a navegação por âncoras, a referência legal e as pendências factuais. O parágrafo sobre rádio foi atualizado para descrever a transmissão oficial iniciada pelo visitante.

Ainda precisam de confirmação pelo responsável, sem informações inventadas:

- Identificação jurídica e contato do controlador, endereço aplicável e responsável pelo atendimento.
- Canal formal de privacidade e procedimentos para exercício de direitos.
- Bases legais por finalidade; prazos de conservação e eliminação de mensagens e logs.
- Configuração de logs, locais de processamento, contratos com provedores, segurança e eventuais transferências internacionais.
- Versão e data de vigência.

Essas pendências continuam explícitas no conteúdo; a retirada da apresentação de minuta não equivale a uma validação jurídica desses dados.

## Arquivos alterados

- `src/data/content/streams.ts`: fonte oficial exclusiva.
- `src/components/layout/RadioProvider.tsx`, `src/lib/radio-context.ts`: remoção da seleção de fonte demonstrativa.
- `src/lib/radio-player.ts`, `src/hooks/useRadioPlayer.ts`: serviço de áudio, estados e timeout/retry.
- `src/components/ui/RadioControls.tsx`, `src/components/sections/RadioPlayerSection.tsx`, `src/components/sections/LiveAccessSection.tsx`, `src/pages/RadioPage.tsx`: copy oficial sem demonstração.
- `src/components/sections/ScheduleSection.tsx`: somente a frase de acesso aos players foi atualizada; dados e grade preservados.
- `src/data/content/privacy.ts`, `src/pages/PrivacyPage.tsx`, `src/components/sections/PrivacySection.tsx`, `src/components/sections/privacy.css`: apresentação da política e descrição factual da rádio.
- `public/assets/audio/radio-demo.mp3`: retirado do build.
- `tests/content.test.mjs`, `tests/radio.test.mjs`: fonte oficial, estados, falhas, timeout, retry, volume e política.
- `README.md`, `docs/ASSETS-LICENCAS.md`: documentação atualizada, mantendo o histórico da licença do material anterior.
- `wrangler.aprovacao.jsonc`: Worker de aprovação independente, com cache editorial próprio e sem rotas/domínio principal.

## Testes executados

- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`: aprovados; **41 testes**. Não foram adicionadas dependências.
- Unitários da rádio: sem autoplay, estado de reprodução somente após evento real, pause, volume, falha, retry, timeout, cancelamento durante carregamento, play rejeitado e remoção dos listeners ao descartar a instância.
- Política: teste de ausência de minuta/rascunho/provisório no conteúdo e metadados, com pendências essenciais preservadas.
- Auditoria dos arquivos do player: nenhuma ocorrência remanescente de demonstração, áudio local, exemplo de áudio, stream em confirmação, `demoUrl` ou `isDemo`.
- Navegador, primeiro local e depois na prévia HTTPS: fonte oficial, estado inicial pausado e sem autoplay; Play → carregamento → reprodução; `readyState: 4`, `paused: false`, `error: null` e avanço efetivo de `currentTime` (na prévia, de aproximadamente 21 até 96 segundos).
- Play/Pause e retomada testados pelos controles do corpo e do dock; volume testado por teclado, com ambos os controles sincronizados. Uma instância de áudio permaneceu tocando ao navegar de Rádio para a home; na validação local, também de Rádio para Política.
- Mobile em 375×812 e desktop em 1440×900: sem overflow horizontal; controles, volume e dock preservados. É validação de viewport no Chromium, não teste físico de iOS/Android.
- TV na prévia: `muted: true`, `paused: false`, `readyState: 4`, `error: null`. Fonte HLS não modificada.
- Não houve ocorrência de conteúdo misto nos logs inspecionados, e as fontes efetivas de mídia permanecem HTTPS.
- Política na prévia: texto e description sem “minuta”; estrutura e pendências conferidas no navegador.
- `/radio`, `/politica-de-privacidade` e `/tv`: HTTP 200 com o novo build. `/api/programs`, `/api/team` e `/api/albums`: HTTP 200 com os registros públicos já existentes.

Falhas/timeout/retry foram exercitados em testes isolados, sem interromper o servidor real do cliente. Não foi validada reprodução em todos os navegadores ou redes; disponibilidade futura depende do provedor e da conexão do visitante.

## Publicação da prévia

A tentativa de URL de versão não alterou o deploy ativo: Workers que implementam Durable Objects não recebem essas URLs, conforme [limitação documentada pela Cloudflare](https://developers.cloudflare.com/workers/versions-and-deployments/version-urls/#limitations). A versão carregada no Worker original (`7bc35b42-89d4-46a8-bc7e-6d52fb12eadc`) permanece sem deploy.

Foi publicado, em vez disso, o Worker independente `alvoradatvd-aprovacao`, versão `3e3e367b-78f5-4ed8-9c8e-9ff7a52bda19`, com a configuração de aprovação. A URL anterior `https://alvoradatvd.smartlocal.workers.dev/` foi conferida e continua servindo seu build anterior. Nenhuma rota ou domínio principal foi alterado.

Para atualizar somente essa prévia:

```sh
pnpm build
pnpm exec wrangler deploy --config wrangler.aprovacao.jsonc
```

Capturas locais em `qa/ajustes-aprovacao/`. Alterações de Programas, Equipe, Galeria, seus dados/adaptadores, CMS e streaming de TV não fazem parte desta etapa.
