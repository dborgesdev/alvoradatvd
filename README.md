# Rede Alvorada

Portal em React, TypeScript, Vite e Tailwind CSS. TV HLS, rádio persistente e integrações editoriais em Cloudflare Workers.

## Desenvolvimento

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Validação: `pnpm typecheck`, `pnpm lint`, `pnpm test` e `pnpm build`.
Prévia estática: `pnpm preview`. Prévia completa com APIs: `pnpm preview:worker` (localhost:8787). Para HMR, executar também `pnpm dev`, com proxy para o Worker local.

Consulte [integrações editoriais, cache e variáveis](docs/INTEGRACOES-EDITORIAIS.md).

## Cloudflare Workers

O Worker `alvoradatvd` serve `dist/` com fallback SPA e endpoints `/api/news`, `/api/rates`, `/api/programs`, `/api/team` e `/api/albums`. O Durable Object `EDITORIAL_CACHE` atende **somente notícias e cotações**. Programas, equipe e álbuns consultam o WordPress diretamente, sem cache intermediário no Worker/CDN; o frontend mantém essas coleções em memória por 60 segundos. Limpe o cache REST do WordPress e recarregue a página para uma consulta imediata. Consulte [cache e atualização da grade](CACHE-EDITORIAL.md).

```sh
pnpm build
pnpm dlx wrangler@4.151.2 deploy
```

O deploy exige autenticação prévia na conta Cloudflare (`wrangler login`). Não há credenciais no repositório. Esta publicação de avaliação permanece sem indexação; `VITE_PUBLIC_SITE_URL` só deve ser definido quando o domínio público definitivo for confirmado.

`vercel.json` mantém a opção Vercel. `public/.htaccess` permite hospedagem estática Apache/Hostinger; `.assetsignore` exclui esse arquivo e referências de construção do upload ao Worker.

## Conteúdo e licenças

Programas, programação, equipe e galeria utilizam a API pública do WordPress. Configurações e textos institucionais permanecem em `src/data/content/`. Os antigos exemplos locais não são usados como fallback. A rádio usa exclusivamente `https://s02.taaqui.org:9164/stream`, mediante Play do visitante. Endereço ainda aguarda confirmação. Vídeos e playlists aparecem quando cadastrados no WordPress. A disponibilidade das transmissões depende do provedor externo.

Consulte [implementação e validação WordPress](WORDPRESS-INTEGRACAO.md) para endpoints, cache e roteiro de revisão local.

Consulte [origem e licenças dos assets](docs/ASSETS-LICENCAS.md). A fonte institucional é mantida para validar a transcrição nos testes. Briefings comerciais, relatórios de construção, referências visuais e capturas de QA permanecem locais e ignorados pelo Git.

## Imagem de compartilhamento

`public/og-image.webp` é o arquivo fornecido para compartilhamento, preservado sem conversão ou redimensionamento (1536 × 1024 px). A configuração em `src/data/content/social-image.json` centraliza URL da prévia, caminho, dimensões e MIME. O Vite injeta as tags Open Graph/Twitter no HTML inicial, e `usePageMeta` mantém a mesma referência ao navegar. Não há dependência de JavaScript para obter a imagem no compartilhamento.

A origem social padrão é `https://alvoradatvd.smartlocal.workers.dev`; a configuração existente `VITE_PUBLIC_SITE_URL` tem precedência quando um domínio público for confirmado. Não é necessário definir essa variável para a prévia, preservando a política atual de indexação. O deploy manual pode partir de uma branch validada com `pnpm exec wrangler deploy`, sem merge obrigatório na main. Rastreadores podem manter cache próprio de compartilhamentos; a validação deve considerar o HTML HTTP e a imagem publicada.
