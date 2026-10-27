# Rede Alvorada

Portal em React, TypeScript, Vite e Tailwind CSS. TV HLS, rádio persistente e integrações editoriais em Cloudflare Workers.

## Desenvolvimento

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Validação: `pnpm typecheck`, `pnpm lint`, `pnpm test` e `pnpm build`.
Prévia estática: `pnpm preview`. Prévia completa com APIs: `pnpm preview:worker` (localhost:8787). Para HMR, executar também `pnpm dev`, com proxy para o Worker local.

Consulte [integrações editoriais, cache e variáveis](docs/INTEGRACOES-EDITORIAIS.md). A avaliação local de clima exige `WEATHER_EVALUATION=true`; uso comercial requer chave Open-Meteo.

## Cloudflare Workers

O Worker `alvoradatvd` serve `dist/` com fallback SPA e endpoints `/api/news`, `/api/rates` e `/api/weather`. A configuração versiona o Durable Object `EDITORIAL_CACHE` e sua migração para cache persistente compartilhado.

```sh
pnpm build
pnpm dlx wrangler@4.151.2 deploy
```

O deploy exige autenticação prévia na conta Cloudflare (`wrangler login`). Não há credenciais no repositório. Esta publicação de avaliação permanece sem indexação; `VITE_PUBLIC_SITE_URL` só deve ser definido quando o domínio público definitivo for confirmado.

`vercel.json` mantém a opção Vercel. `public/.htaccess` permite hospedagem estática Apache/Hostinger; `.assetsignore` exclui esse arquivo e referências de construção do upload ao Worker.

## Conteúdo e licenças

Os dados ficam em `src/data/content/`. Stream real de rádio, equipe, promoções, endereço e IDs individuais de vídeo aguardam confirmação. A disponibilidade do HLS depende do provedor externo.

Consulte [origem e licenças dos assets](docs/ASSETS-LICENCAS.md). A fonte institucional é mantida para validar a transcrição nos testes. Briefings comerciais, relatórios de construção, referências visuais e capturas de QA permanecem locais e ignorados pelo Git.
