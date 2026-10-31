import { createResource } from "../services/client";
import type { EditorialProgram, TeamProfile } from "../../types/editorial";
import type { GalleryAlbum } from "../../types/collections";

// One singleton serves Programs, Schedule and the home section, including in-flight requests.
export const programsResource = createResource<EditorialProgram[]>("/api/programs", 60000, 3600000);
export const teamResource = createResource<TeamProfile[]>("/api/team", 60000, 3600000);
export const albumsResource = createResource<GalleryAlbum[]>("/api/albums", 60000, 3600000);
