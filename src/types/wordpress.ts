export type WpMedia = {
  id: number; source_url?: string; alt_text?: string;
  media_details?: { width?: number; height?: number; sizes?: Record<string, { source_url?: string; width?: number; height?: number }> };
};
export type WpPost = {
  id: number; slug: string; status: string;
  title?: { rendered?: string }; content?: { rendered?: string; protected?: boolean };
  featured_media?: number; acf?: Record<string, unknown> | [];
  _embedded?: { "wp:featuredmedia"?: WpMedia[] };
};
export type WpProgram = WpPost & { "categorias-programa"?: number[]; grade_horarios?: unknown };
export type WpPhoto = { id: number; url: string; alt?: string; width?: number; height?: number; sizes?: Record<string, string> };
export type WpAlbum = WpPost & { "categorias-albuns"?: number[]; fotografias_resolvidas?: WpPhoto[] };
export type WpTerm = { id: number; name: string };
