# Validação — 30/10/2026

## Executado localmente

- PHP CLI 8.5.12 portátil oficial, ZIP conferido com SHA-256 publicado. Não instalado no sistema, não incluído no plugin.
- `php -l` nos cinco arquivos PHP do plugin e no harness: nenhuma falha de sintaxe.
- `php wordpress/tests/plugin-test.php`: **49 verificações aprovadas**, com doubles das APIs WordPress e armazenamento em memória. Verifica normalização/deduplicação/ordem de IDs, rejeição de imagens inválidas, faixas múltiplas, dias múltiplos, horários/dias/tipos inválidos, sanitização de observação, faixa domingo–segunda, salvamento/remoção, nonces, permissões, revisões, autosaves, campos ausentes, JSON inválido, CPT incorreto, REST somente leitura, arrays vazios, ordem REST, URLs/dimensões/tamanhos e exclusão de anexos privados/ligados a pais privados.
- `node --check` nos dois scripts administrativos: aprovado.
- `pnpm lint`: aprovado, incluindo o JavaScript administrativo adicionado.
- `pnpm typecheck`: aprovado.
- `pnpm build`: aprovado. Os comandos do projeto foram executados conforme AGENTS.md; não houve alteração de código/configuração do frontend.
- ZIP: estrutura com uma única pasta raiz `alvorada-content-tools/`, somente código PHP/JS/CSS e documentação; conteúdo comparado byte a byte com os fontes. Não contém runtime, testes, node_modules ou segredos.

## Limites

Não existe WordPress instalado neste ambiente de desenvolvimento. Os testes com doubles validam a lógica própria do plugin; não comprovam funcionamento de hooks, banco real, seletor `wp.media`, arraste, comportamento dos formulários nos editores, carregamento de assets ou execução pelo controlador REST do WordPress.

Não foram acessados banco remoto ou credenciais administrativas, nem instalada qualquer extensão na hospedagem. As versões efetivas de PHP/WordPress, o ACF instalado, as capacidades dos perfis e os demais plugins ainda precisam ser conferidos no painel real. Os requisitos mínimos declarados (PHP 7.4 / WP 5.8) são requisitos de implementação; a execução local foi em PHP 8.5.12.

O roteiro completo de homologação está em **Aceite na instalação real — pendente**, no README deste plugin. Todas as verificações de adicionar/reabrir/arrastar no painel, JSON pelo servidor real e compatibilidade com ACF/CPTs/taxonomias/equipe/imagem destacada permanecem pendentes de instalação autorizada.
