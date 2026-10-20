export const streams = {
  radio: {
    title: "Rádio Alvorada",
    url: null as string | null,
    demoUrl: "/assets/audio/radio-demo.mp3",
    demoSource: "Pixabay — free for use (informado pelo cliente)",
    status: "pending" as const,
  },
  tv: {
    title: "Alvorada TV ao vivo",
    hlsUrl:
      "https://v01.taaqui.org/alvoradafm/alvoradafm/chunklist_w1354410473.m3u8",
  },
  youtubeChannel: "https://www.youtube.com/@alvoradatvd",
} as const;
// O nome chunklist_w... pode identificar uma playlist de sessão/variante; confirmar URL HLS estável com Taaqui.
