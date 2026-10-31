import type { WpAlbum, WpMedia, WpPost, WpProgram, WpTerm } from "../../types/wordpress.ts";
import type { BroadcastSlot, EditorialImage, EditorialProgram, TeamProfile } from "../../types/editorial.ts";
import type { GalleryAlbum } from "../../types/collections.ts";

const object = (v: unknown): Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};
export function wpText(value: unknown): string {
  if (typeof value !== "string") return "";
  const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”" };
  // Only plain text reaches JSX. Encoded markup is also rendered as text.
  return value.replace(/<(script|style|iframe|object)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<\/(?:p|div|li|h[1-6])\s*>|<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "")
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
      if (!code.startsWith("#")) return entities[code.toLowerCase()] ?? entity;
      const number = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return number > 0 && number <= 0x10ffff && !(number >= 0xd800 && number <= 0xdfff) ? String.fromCodePoint(number) : "";
    }).replace(/[\t\r ]+/g, " ").replace(/\n\s*\n/g, "\n\n").trim();
}
export function safePublicUrl(value: unknown, hosts?: string[]): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")) return null;
    const host = url.hostname.toLowerCase();
    if (hosts && !hosts.some(allowed => host === allowed || host.endsWith(`.${allowed}`))) return null;
    if (host === "localhost" || !host.includes(".") || host.includes(":") || /^\d+\.\d+\.\d+\.\d+$/.test(host) || /\.(local|internal|localhost)$/.test(host)) return null;
    return url.href;
  } catch { return null; }
}
const dimension = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.round(v) : 0;
export function featuredImage(post: WpPost): EditorialImage | null {
  const media: WpMedia | undefined = post._embedded?.["wp:featuredmedia"]?.find(item => item.id === post.featured_media);
  const original = safePublicUrl(media?.source_url);
  if (!original || !media) return null;
  const sizes = media.media_details?.sizes || {};
  const chosen = ["medium_large", "large", "full"].map(key => sizes[key]).find(size => safePublicUrl(size?.source_url));
  const candidates = Object.entries(sizes).filter(([name, size]) => name !== "thumbnail" && safePublicUrl(size.source_url) && dimension(size.width) && dimension(size.height) && Math.abs((size.width! / size.height!) - (media.media_details!.width! / media.media_details!.height!)) < 0.03);
  const seen = new Set<number>();
  const srcSet = candidates.filter(([, size]) => { if (seen.has(size.width!)) return false; seen.add(size.width!); return true; }).map(([, size]) => `${safePublicUrl(size.source_url)} ${size.width}w`).join(", ");
  return { src: safePublicUrl(chosen?.source_url) || original, alt: wpText(media.alt_text), width: dimension(chosen?.width) || dimension(media.media_details?.width), height: dimension(chosen?.height) || dimension(media.media_details?.height), srcSet: srcSet || undefined };
}
export function adaptTeam(posts: WpPost[]): TeamProfile[] {
  return posts.filter(post => post.status === "publish" && object(post.acf).exibir_site === true && !post.content?.protected).map(post => {
    const acf = object(post.acf);
    return { id: String(post.id), slug: post.slug, name: wpText(post.title?.rendered), role: wpText(acf.cargo), biography: wpText(post.content?.rendered), image: featuredImage(post), instagram: safePublicUrl(acf.instagram, ["instagram.com"]), facebook: safePublicUrl(acf.facebook, ["facebook.com", "fb.com"]) };
  });
}
const categories = (ids: number[] | undefined, terms: WpTerm[]) => terms.filter(term => ids?.includes(term.id)).map(term => wpText(term.name)).join(" · ");
export function adaptSlots(value: unknown): BroadcastSlot[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(raw => {
    const row = object(raw);
    const time = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    if (typeof row.inicio !== "string" || typeof row.fim !== "string" || !time.test(row.inicio) || !time.test(row.fim) || row.inicio === row.fim || !["ao_vivo", "gravado", "reprise"].includes(String(row.tipo)) || !Array.isArray(row.dias)) return [];
    const days = [...new Set(row.dias.filter((day): day is number => Number.isInteger(day) && day >= 1 && day <= 7))];
    return days.length ? [{ days, startsAt: row.inicio, endsAt: row.fim, type: row.tipo as BroadcastSlot["type"], note: wpText(row.observacao) }] : [];
  });
}
function youtubeIds(value: string | null) {
  if (!value) return { video: null, playlist: null };
  const url = new URL(value);
  if (!["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com"].includes(url.hostname)) return { video: null, playlist: null };
  const video = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
  const playlist = url.searchParams.get("list");
  return { video: video && /^[\w-]{11}$/.test(video) ? video : null, playlist: playlist && /^[\w-]{10,150}$/.test(playlist) ? playlist : null };
}
export function adaptPrograms(posts: WpProgram[], terms: WpTerm[], team: TeamProfile[]): EditorialProgram[] {
  return posts.filter(post => post.status === "publish" && !post.content?.protected).map(post => {
    const acf = object(post.acf);
    const presenterIds = Array.isArray(acf.apresentadores) ? acf.apresentadores.map(item => typeof item === "number" ? item : object(item).ID ?? object(item).id) : [];
    const videoUrl = safePublicUrl(acf.url_video);
    const playlistUrl = safePublicUrl(acf.url_playlist);
    return { id: String(post.id), slug: post.slug, title: wpText(post.title?.rendered), subtitle: wpText(acf.subtitulo), description: wpText(post.content?.rendered), image: featuredImage(post), category: categories(post["categorias-programa"], terms), presenters: presenterIds.flatMap(id => { const member = team.find(person => person.id === String(id)); return member ? [{ id: member.id, name: member.name }] : []; }), videoUrl, playlistUrl, youtubeVideoId: youtubeIds(videoUrl).video, youtubePlaylistId: youtubeIds(playlistUrl).playlist, slots: adaptSlots(post.grade_horarios) };
  });
}
export function eventDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const compact = value.match(/^(\d{4})(\d{2})(\d{2})$/);
  const date = compact ? `${compact[1]}-${compact[2]}-${compact[3]}` : value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = new Date(date + "T12:00:00Z");
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === date ? date : null;
}
export function adaptAlbums(posts: WpAlbum[], terms: WpTerm[]): GalleryAlbum[] {
  return posts.filter(post => post.status === "publish" && !post.content?.protected).map((post, order) => {
    const acf = object(post.acf);
    const image = featuredImage(post);
    return { id: String(post.id), title: wpText(post.title?.rendered), description: wpText(post.content?.rendered), cover: image?.src || "", coverImage: image, category: categories(post["categorias-albuns"], terms), date: eventDate(acf.data_evento), location: wpText(acf.local_evento), order, isDemo: false,
      photos: (Array.isArray(post.fotografias_resolvidas) ? post.fotografias_resolvidas : []).flatMap((photo, index) => {
        const src = safePublicUrl(photo.url);
        if (!src || !Number.isInteger(photo.id) || photo.id < 1) return [];
        return [{ id: String(photo.id), src, alt: wpText(photo.alt), caption: "", width: dimension(photo.width), height: dimension(photo.height), order: index }];
      }),
    };
  });
}
