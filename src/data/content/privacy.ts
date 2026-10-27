export const privacySections = [
  {
    id: "escopo",
    title: "1. Sobre esta política",
    paragraphs: [
      "Esta minuta descreve os recursos observados na versão atual do portal Rede Alvorada. Está em revisão e não substitui a validação das informações pelo responsável pelo tratamento antes da publicação definitiva.",
      "A identificação jurídica do controlador, o endereço aplicável e a designação do responsável pelo atendimento de privacidade ainda precisam ser confirmados. Não foram presumidos razão social, CNPJ ou endereço a partir de documentos divergentes.",
    ],
  },
  {
    id: "navegacao",
    title: "2. Navegação e dados técnicos",
    paragraphs: [
      "Ao acessar o portal, seu navegador estabelece conexões com a hospedagem e solicita páginas, imagens, arquivos e mídia. Essas conexões envolvem endereço IP e informações técnicas de navegação, como as necessárias à entrega e à segurança do serviço.",
      "A versão inspecionada utiliza Cloudflare Workers para servir o site e consultar notícias e cotações. A configuração de registros de acesso, os locais de processamento, eventuais transferências internacionais e os prazos aplicáveis devem ser confirmados com os prestadores e documentados pelo controlador.",
    ],
  },
  {
    id: "contatos",
    title: "3. Contatos e mensagens",
    paragraphs: [
      "O site não possui formulário próprio de cadastro, envio de mensagem ou newsletter. Os botões de contato abrem WhatsApp ou o aplicativo de e-mail escolhido pelo visitante. As mensagens são enviadas nesses serviços externos, conforme suas próprias condições.",
      "Se você entrar em contato, poderá fornecer nome, telefone, endereço de e-mail e o conteúdo da mensagem. Esses dados podem ser necessários para responder à solicitação. Evite enviar dados sensíveis ou de terceiros sem necessidade. As bases legais e os procedimentos de atendimento precisam ser validados pelo controlador.",
    ],
  },
  {
    id: "midia",
    title: "4. Notícias, imagens e players",
    paragraphs: [
      "As notícias são selecionadas de um RSS externo. A consulta ao feed é feita no servidor e mantém cache compartilhado por 15 minutos; as matérias completas abrem no endereço original. Imagens remotas podem ser solicitadas pelo navegador ao provedor da imagem, que recebe os dados técnicos dessa conexão.",
      "A TV utiliza transmissão HLS do provedor Taaqui. O carregamento automático e mudo do vídeo envolve conexões com esse provedor, mesmo sem ativar o som. No rádio, o arquivo de demonstração atual é servido com o site e identificado como áudio local. A reprodução e o volume não são gravados em localStorage ou cookies pelo código do portal.",
      "Os programas acessam o canal oficial do YouTube. O componente está preparado para incorporar vídeos via youtube-nocookie.com somente quando houver IDs confirmados; os dados locais atuais não contêm esses IDs. Se incorporados futuramente, os fluxos de dados e esta política deverão ser revisados.",
      "As cotações são consultadas no Banco Central pelo servidor, com cache de 30 minutos. O visitante só acessa o site do Banco Central se selecionar o link das cotações.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies e armazenamento",
    paragraphs: [
      "Não foram identificados no código da aplicação scripts de análise de audiência, pixels publicitários, login, perfil de usuário ou gravação de cookies, localStorage e sessionStorage. A busca de notícias, os filtros da grade e a galeria funcionam sem cadastro.",
      "O navegador pode manter cache técnico dos arquivos conforme os cabeçalhos recebidos. Recursos da hospedagem e páginas externas podem adotar mecanismos próprios de armazenamento ou segurança. A ausência de scripts na aplicação não garante ausência de registros técnicos de infraestrutura; essa configuração é uma pendência de validação antes da publicação definitiva.",
    ],
  },
  {
    id: "finalidades",
    title: "6. Finalidades, segurança e conservação",
    paragraphs: [
      "Os recursos observados destinam-se a apresentar o portal, entregar mídia, exibir informações públicas e permitir contatos iniciados pelo visitante. Não há painel administrativo ou integração WordPress ativa nesta etapa.",
      "Não foi definido um prazo de retenção para mensagens ou registros de infraestrutura. O controlador deve documentar os períodos, as bases legais aplicáveis, as medidas de proteção e os critérios de eliminação. Os prazos de cache editorial não representam prazos de retenção de dados pessoais.",
      "A página não afirma garantias absolutas de segurança ou práticas contratuais ainda não verificadas. Alterações de integrações, formulários, publicidade ou CMS exigem nova avaliação desta política.",
    ],
  },
  {
    id: "direitos",
    title: "7. Seus direitos",
    paragraphs: [
      "A LGPD prevê direitos que incluem confirmação do tratamento, acesso, correção de dados, informações sobre compartilhamento, anonimização, bloqueio ou eliminação nas hipóteses legais, portabilidade conforme regulamentação, informação sobre consentimento e sua revogação quando aplicável. A análise de cada pedido depende das condições previstas na lei.",
      "O canal específico para exercer esses direitos e a identificação do responsável pelo atendimento estão pendentes de confirmação. Enquanto esta minuta é avaliada, a página Contato disponibiliza os canais gerais informados pela emissora; eles ainda não são apresentados como canal formal de privacidade.",
    ],
  },
  {
    id: "pendencias",
    title: "8. Validações antes da publicação definitiva",
    paragraphs: [
      "Confirmar: identificação e contato do controlador; responsável e canal de privacidade; bases legais por finalidade; procedimentos para pedidos de titulares; conservação e eliminação de mensagens/registros; contratos com provedores; mecanismos de segurança e armazenamento; eventual transferência internacional; versão e data de vigência da política.",
      "Esta minuta será atualizada após a validação. A data de vigência ainda não foi definida.",
    ],
  },
];
