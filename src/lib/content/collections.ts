import { schedule } from "../../data/content/schedule";
import { galleryAlbums } from "../../data/content/gallery";
import type { ScheduleEntry, GalleryAlbum } from "../../types/collections";
// Contrato de domínio: um adapter WordPress futuro substitui apenas esta fonte.
export interface CollectionsSource {
  getSchedule(): ScheduleEntry[];
  getAlbums(): GalleryAlbum[];
}
export const collections: CollectionsSource = {
  getSchedule: () =>
    [...schedule].sort(
      (a, b) => a.dayOfWeek - b.dayOfWeek || a.order - b.order,
    ),
  getAlbums: () =>
    galleryAlbums
      .map((album) => ({
        ...album,
        photos: [...album.photos].sort((a, b) => a.order - b.order),
      }))
      .sort((a, b) => a.order - b.order),
};
