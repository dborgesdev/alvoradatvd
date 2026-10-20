export type { NewsArticle } from "../data/content/news";
export type { Program } from "../data/content/programs";
export type { TeamMember } from "../data/content/team";
export type { Promotion } from "../data/content/promotions";
export type MediaStatus =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "paused"
  | "error"
  | "unavailable";
