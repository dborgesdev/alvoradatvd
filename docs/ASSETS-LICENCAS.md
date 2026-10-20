# Origem dos assets adicionados nos refinamentos

## Redesign V2

- `public/assets/brand/logo-3d-original.png`: marca original fornecida pelo cliente, preservada. O PNG já contém alpha (572.063 pixels totalmente transparentes de 1.572.516); não foi necessário remover fundo, redesenhar ou reconstruir brilhos. Derivados `logo-3d-hero.webp` (640 px, qualidade 92, alpha 100) e `logo-3d-small.webp` (128 px, lossless) foram redimensionados a partir desse original. Favicon e assinatura compacta existentes foram preservados para legibilidade.
- `public/assets/editorial/region-v2.webp`: imagem conceitual gerada por IA, cidade brasileira genérica ao pôr do sol. Não representa Hortolândia nem um local confirmado.
- `public/assets/editorial/sport-v2.webp`: imagem conceitual gerada por IA, bola em campo genérico com luz noturna. Não representa clube, evento ou atleta da emissora.
- `public/assets/editorial/program-v2.webp`: imagem conceitual gerada por IA, microfone e câmera em estúdio vazio. Não representa instalações ou programas confirmados.
- As três imagens foram criadas individualmente com a ferramenta integrada imagegen, exportadas para WebP e usadas em slots independentes. Prompts e validações constam em `docs/REDESIGN-V2-ENTREGA.md`. O mockup aprovado não foi incorporado ao site nem fatiado.

## Áudio demonstrativo

- Arquivo fornecido pelo cliente: `public/assets/audio/radio-demo.mp3`.
- Origem/licença declaradas pelo cliente em 20/10/2026: **“pixabay free for use”**.
- O player o identifica como demonstração local, sem afirmar transmissão ao vivo.
- Não foi fornecido o link da faixa nem um certificado individual de licença. Guardar essa referência junto aos materiais de publicação; não foi realizada verificação independente de autoria/licença do MP3.
- Stream oficial continua nulo e tem precedência sobre a demo quando configurado em `src/data/content/streams.ts`.

## Fotografia para História do Rádio

- Arquivo: `public/assets/editorial/radio-paragon-1920.jpg`.
- Autor: Daderot. Fotografia de equipamentos Paragon no National Electronics Museum, 21/07/2014.
- Licença: CC0 1.0, informada pelo autor na página de origem.
- Fonte: https://commons.wikimedia.org/wiki/File:Paragon_RA-10_Radio_Receiver,_1920_-_National_Electronics_Museum_-_DSC00230.JPG
- Licença: https://creativecommons.org/publicdomain/zero/1.0/
- A fotografia não retrata equipamentos ou instalações da Rede Alvorada. Crédito e fonte disponíveis na página pública.

## Textos

`docs/institucional-fonte.txt` é a fonte primária definida pelo adendo. O PDF original não está no checkout; há também `docs/institucional-extraido-pdf.txt`. O conteúdo foi transcrito do primeiro arquivo, preservando palavras, pontuação, ordem dos parágrafos e títulos. Somente quebras de linha de impressão foram unidas; cabeçalhos, rodapés e contatos repetidos foram excluídos conforme o adendo. Quem Somos e Sobre aparecem primeiro na ordem aprovada; História do Rádio e Rádio no Brasil estão na rota própria.
