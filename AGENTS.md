# Instruções para Codex — Rede Alvorada

Leia integralmente `docs/project.md`, `docs/briefing-comercial.txt` e `docs/institucional-fonte.txt` antes de implementar. Esses arquivos são a fonte de verdade. Não invente notícias, pessoas, fotos reais, promoções ou links de transmissão.

## Organização obrigatória
- Stack: React + TypeScript + Vite + Tailwind CSS + pnpm.
- Cada seção principal em componente `.tsx` próprio em `src/components/sections/`; páginas em `src/pages/`; layout em `src/components/layout/`.
- Componentes visuais compartilhados em `src/components/ui/`, somente quando houver reuso real.
- Dados locais e configurações em `src/data/content/`, tipos em `src/types/`, integração e adapters em `src/lib/`, hooks em `src/hooks/`.
- Componentes não fazem fetch diretamente nem acoplam JSX ao contrato REST do WordPress; usar contratos de domínio e adapters.
- `App.tsx` deve apenas compor rotas/providers. Evite arquivos monolíticos, duplicação, CSS global excessivo e abstrações prematuras.
- Props tipadas, nomenclatura clara, comentários concisos apenas em regras não óbvias.

## Qualidade e entrega
V1 visual completa com assets reais de marca, editorial demonstrativo identificado, players com estados corretos, SEO, acessibilidade, responsividade e motion intencional. Preservar o logo original. Respeitar `prefers-reduced-motion`. Preparar build estático e rota SPA para Vercel, com portabilidade para Hostinger. Crédito obrigatório no rodapé e WhatsApp flutuante conforme `project.md`. Executar lint, typecheck e build e reportar o que realmente foi validado. Não realizar commit, push ou merge sem pedido explícito.

## Requisitos adicionais obrigatórios
- Leia o adendo final de `docs/project.md` antes de codificar. Ele prevalece sobre instruções anteriores em conflito.
- Player de rádio deve ter provider persistente, hook/serviço de áudio separado e componente de apresentação isolado; efeito flutuante por observação de scroll sem listeners pesados.
- TV HLS isolada em componente/hook próprios, autoplay mudo best-effort e controles acessíveis.
- Institucional e história do rádio: texto INTEGRAL do PDF, sem resumo ou reescrita; conteúdo organizado em dados locais.
