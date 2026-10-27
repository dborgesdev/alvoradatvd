import type { GalleryAlbum } from "../../types/collections";
export const galleryAlbums: GalleryAlbum[] = [
  {
    id: "paisagens",
    title: "Paisagens e possibilidades",
    description:
      "Estudos visuais de cidade e vida urbana. Não são registros de Campinas ou da emissora.",
    cover: "/assets/editorial/region-v2.webp",
    date: null,
    category: "Paisagens · exemplo",
    order: 0,
    isDemo: true,
    photos: [
      {
        id: "cidade",
        src: "/assets/editorial/region-v2.webp",
        alt: "Imagem conceitual de cidade brasileira genérica ao pôr do sol",
        caption:
          "Paisagem urbana conceitual · não representa local confirmado.",
        order: 0,
      },
    ],
  },
  {
    id: "audiovisual",
    title: "A linguagem do audiovisual",
    description:
      "Conceitos de luz, som e produção. Não retratam as instalações da Rede Alvorada.",
    cover: "/assets/editorial/program-v2.webp",
    date: null,
    category: "Audiovisual · exemplo",
    order: 1,
    isDemo: true,
    photos: [
      {
        id: "producao",
        src: "/assets/editorial/program-v2.webp",
        alt: "Conceito visual de câmera e microfone em estúdio",
        caption:
          "Estúdio conceitual, sem representar instalações reais da emissora.",
        order: 0,
      },
      {
        id: "estudio",
        src: "/assets/editorial/studio-conceitual.webp",
        alt: "Ilustração conceitual de ambiente de produção audiovisual",
        caption: "Estudo de ambiente audiovisual para demonstração da galeria.",
        order: 1,
      },
    ],
  },
  {
    id: "conexoes",
    title: "Memória da comunicação",
    description:
      "Uma fotografia histórica de uso livre e um estudo visual contemporâneo. Álbum de exemplo, sem registros da emissora.",
    cover: "/assets/editorial/radio-paragon-1920.jpg",
    date: null,
    category: "Comunicação · exemplo",
    order: 2,
    isDemo: true,
    photos: [
      {
        id: "telas",
        src: "/assets/editorial/radio-paragon-1920.jpg",
        alt: "Receptor Paragon RA-10 no National Electronics Museum, fotografado por Daderot",
        caption:
          "Fotografia de Daderot (2014), CC0 1.0. Equipamento histórico do National Electronics Museum; não pertence à emissora.",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Paragon_RA-10_Radio_Receiver,_1920_-_National_Electronics_Museum_-_DSC00230.JPG",
        order: 0,
      },
      {
        id: "programas",
        src: "/assets/editorial/studio-conceitual.webp",
        alt: "Estudo conceitual contemporâneo de produção audiovisual",
        caption:
          "Imagem de exemplo; não identifica programas ou pessoas da emissora.",
        order: 1,
      },
    ],
  },
];
