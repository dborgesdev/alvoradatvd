export type ScheduleEntry = {
  id: string;
  title: string;
  description: string;
  dayOfWeek: number;
  startsAt: string;
  endsAt: string;
  image: string | null;
  category: string;
  order: number;
  isDemo: boolean;
};
export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  sourceUrl?: string;
  order: number;
};
export type GalleryAlbum = {
  id: string;
  title: string;
  description: string;
  cover: string;
  date: string | null;
  category: string;
  photos: GalleryPhoto[];
  order: number;
  isDemo: boolean;
};
