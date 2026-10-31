export type EditorialImage = { src: string; alt: string; width: number; height: number; srcSet?: string };
export type BroadcastSlot = {
  days: number[]; startsAt: string; endsAt: string;
  type: "ao_vivo" | "gravado" | "reprise"; note: string;
};
export type TeamProfile = {
  id: string; slug: string; name: string; role: string; biography: string;
  image: EditorialImage | null; instagram: string | null; facebook: string | null;
};
export type EditorialProgram = {
  id: string; slug: string; title: string; subtitle: string; description: string;
  image: EditorialImage | null; category: string;
  presenters: { id: string; name: string }[];
  videoUrl: string | null; playlistUrl: string | null;
  youtubeVideoId: string | null; youtubePlaylistId: string | null;
  slots: BroadcastSlot[];
};
