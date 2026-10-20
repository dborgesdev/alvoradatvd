export type Program = {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string | null;
  thumbnail: string;
  isDemo: boolean;
};
export const programs: Program[] = [
  {
    id: "programa-demo",
    title: "Programas da Alvorada",
    description:
      "Espaço demonstrativo para vídeos publicados no canal oficial.",
    youtubeVideoId: null,
    thumbnail: "/assets/editorial/program-v2.webp",
    isDemo: true,
  },
];
// Não inventar IDs do YouTube. Somente criar iframe para youtubeVideoId validado.
