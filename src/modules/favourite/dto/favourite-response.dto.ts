import { Album, Artist, Track } from '@prisma/client';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
