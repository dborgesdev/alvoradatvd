# Rede Alvorada — Complementos 1.0.0

Plugin independente para os CPTs existentes `album` e `programa`. Não registra CPTs, taxonomias, grupos/campos ACF, tabelas, endpoints próprios ou campos de ordem. Não depende de ACF Pro. Não altera equipe, relacionamentos, capas nem frontend.

## Instalação

1. Em **Ferramentas → Saúde do site → Informações → Servidor**, conferir PHP e WordPress. Requisitos declarados: PHP 7.4+ e WordPress 5.8+. As versões efetivas da hospedagem ainda não foram verificadas.
2. Fazer backup e preferir uma cópia de homologação para executar o roteiro de aceite abaixo.
3. Em **Plugins → Adicionar plugin → Enviar plugin**, selecionar `alvorada-content-tools-1.0.0.zip`, instalar e ativar.
4. Abrir um álbum e um programa existentes. As metaboxes aparecem nas respectivas telas de edição. Se estiverem ocultas, conferir as opções de tela/preferências do editor.
5. Salvar/atualizar o post para persistir alterações. Remover todas as fotos ou faixas e salvar grava `[]`.

Nenhuma instalação remota foi realizada nesta entrega. Desativar o plugin remove suas interfaces e campos REST, mas mantém os metadados. Não existe rotina de exclusão de dados ao desinstalar.

## Uso

**Álbum:** em Fotografias do Álbum, clicar em Adicionar fotografias. Selecionar imagens da biblioteca ou enviar arquivos no seletor nativo e confirmar. Novas seleções são acrescentadas sem duplicar IDs. Arrastar pelo controle “Arrastar” ou usar os botões anterior/seguinte para ordenar com teclado ou toque. Remover tira a referência do álbum, sem excluir o arquivo da biblioteca. A capa continua sendo a imagem destacada.

**Programa:** em Dias e Horários de Exibição, adicionar faixas, selecionar um ou mais dias, informar início/fim, tipo e observação opcional. Para retirar toda a grade, remover todas as faixas e salvar. Sem JavaScript ou sem interação na grade, seu metadado não é enviado nem apagado. Uma faixa inválida rejeita a atualização de toda a grade, mantém os valores anteriores e mostra aviso após o salvamento; outros campos do post podem ter sido salvos normalmente. O aviso não recupera os valores inválidos digitados.

Horários são locais, no fuso configurado em Configurações → Geral do WordPress; nenhum deslocamento UTC é embutido nas strings. Os dias `1..7` representam segunda a domingo e indicam o **dia de início**. `23:00–01:00` de domingo termina na segunda-feira; o consumidor deve dividir a faixa para exibição semanal quando necessário. Início igual ao fim é rejeitado, não significa 24 horas. Sobreposições entre faixas/programas são permitidas; não existe resolução automática de conflitos.

## Persistência e segurança

- `album`: metadado `fotografias`, array ordenado de IDs inteiros positivos, sem duplicatas. Anexos inexistentes, na lixeira e arquivos que não são imagens são descartados. Nenhum arquivo é duplicado.
- `programa`: metadado `grade_horarios`, array de objetos `{dias, inicio, fim, tipo, observacao}`. Dias normalizados, sem duplicatas; `observacao` é texto sem HTML.
- Salvamento somente por formulários administrativos com nonce válido, permissão `edit_post` do post e CPT correto, fora de autosaves e revisões. Ausência do campo não modifica o metadado. JSON inválido preserva os dados anteriores.
- Não há escrita REST implementada para os campos adicionais; as permissões de leitura do post continuam sob controle do REST nativo. Os metadados não são registrados como graváveis em `meta`. O plugin não muda capacidades de usuários nem permissões de mídia.
- A resolução pública omite anexos privados, protegidos por senha e vinculados a posts não públicos/protegidos por senha, inclusive rascunhos. Isso pode fazer a contagem REST ser menor que a do painel. Não há exposição de caminho de disco, autor, e-mail ou metadados EXIF. URLs de upload não constituem controle de acesso a arquivos: restrições de download dependem da hospedagem.

## REST

`GET /wp-json/wp/v2/albuns` e `/albuns/{id}` acrescentam no objeto do álbum:

```json
{
  "fotografias_resolvidas": [
    {
      "id": 123,
      "url": "https://exemplo.test/wp-content/uploads/foto.jpg",
      "alt": "Descrição cadastrada na biblioteca",
      "width": 1600,
      "height": 900,
      "sizes": {
        "thumbnail": "https://exemplo.test/wp-content/uploads/foto-150x150.jpg",
        "medium": "https://exemplo.test/wp-content/uploads/foto-300x169.jpg"
      }
    }
  ]
}
```

URLs e IDs acima são apenas exemplos de contrato. `sizes` é um objeto com URLs dos tamanhos efetivamente gerados entre `thumbnail`, `medium`, `medium_large`, `large`, `1536x1536` e `2048x2048`. O original está em `url`; sem miniaturas, `sizes` é `{}`. Ordem preservada; sem fotografias públicas válidas, `fotografias_resolvidas` é `[]`. A resolução usa funções nativas de mídia, sem HTTP interno e sem cache próprio.

`GET /wp-json/wp/v2/programas` e `/programas/{id}` acrescentam diretamente:

```json
{
  "grade_horarios": [
    {"dias": [1, 2, 3, 4, 5], "inicio": "08:00", "fim": "09:00", "tipo": "ao_vivo", "observacao": ""},
    {"dias": [6], "inicio": "10:00", "fim": "11:00", "tipo": "reprise", "observacao": ""}
  ]
}
```

Tipos: `ao_vivo`, `gravado`, `reprise`. Sem grade válida, `[]`. A coleção de programas contém os dados para construir a semana (observar a paginação nativa do WordPress). Nenhum título, apresentador ou imagem é duplicado na grade. Os campos ACF existentes continuam em sua exposição original.

As APIs utilizadas seguem as referências oficiais de [register_rest_field](https://developer.wordpress.org/reference/functions/register_rest_field/) e [wp_enqueue_media](https://developer.wordpress.org/reference/functions/wp_enqueue_media/).

## Organização

`alvorada-content-tools.php`: bootstrap e carregamento condicionado de assets; `includes/gallery.php`: metabox/salvamento de fotografias; `includes/schedule.php`: metabox/salvamento da grade; `includes/validation.php`: validações e proteção de salvamento; `includes/rest.php`: campos públicos somente leitura; `assets/`: JavaScript e CSS administrativo. O arraste usa `jquery-ui-sortable` fornecido pelo próprio WordPress; não há dependências externas nem etapa de build.

## Aceite na instalação real — pendente

Todos os itens abaixo dependem do WordPress real, não foram confirmados pelos testes isolados:

- Confirmar versões PHP/WordPress e ausência de erros no log ao ativar; abrir os dois editores utilizados na instalação e conferir metaboxes, layout mobile, teclado e permissões.
- Álbum: adicionar uma imagem, várias simultaneamente e outras depois; tentar adicionar a mesma novamente; remover; ordenar por arraste e botões; salvar, reabrir e comparar a ordem. Conferir seleção/upload com o perfil real do operador.
- API de álbuns: comparar IDs, ordem, alt, dimensões e URLs com a biblioteca; abrir URLs; testar álbum vazio, imagem excluída, miniaturas ausentes e anexos ligados a conteúdo privado. Usar `_fields=id,fotografias_resolvidas` para uma conferência enxuta.
- Programa: criar segunda a sexta 08:00–09:00 e sábado 10:00–11:00; salvar/reabrir; remover uma e depois todas; testar ausência de dias, `24:00`, horários iguais, observação com HTML e faixa domingo 23:00–01:00.
- API de programas: comparar JSON com o painel e confirmar `[]` para programa sem grade; conferir anonimato na leitura de posts públicos e proteção nativa para privados/rascunhos. Confirmar que tentativa de gravar os campos adicionais via REST não altera os metadados.
- Segurança: usuário sem `edit_post`, nonce ausente/inválido, autosave, revisão, edição rápida e atualização de outros campos devem preservar dados; testar também formulários longos e limites da hospedagem.
- Compatibilidade: ACF gratuito, campos existentes, categorias dos dois CPTs, imagens destacadas, relação programa/equipe e edição de equipe/posts comuns; assets deste plugin ausentes nas demais telas. Confirmar que outro plugin não usa os mesmos metadados/campos REST.

Testes locais e seus resultados estão em `TESTES.md` neste diretório. O harness reproduzível fica em `wordpress/tests/plugin-test.php` no código-fonte entregue.
