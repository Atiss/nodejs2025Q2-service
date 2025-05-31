import { User } from '../modules/user/entities/user.entity';
import { Track } from '../modules/track/entities/track.entity';
import { Album } from '../modules/albums/entities/album.entity';
import { Artist } from '../modules/artist/entities/artist.entity';
import { Favorites } from '../modules/favourite/entities/favourite.entity';

export const users: User[] = [];
export const tracks: Track[] = [];
export const albums: Album[] = [];
export const artists: Artist[] = [];
export const favorites: Favorites = {
  artists: [],
  albums: [],
  tracks: [],
};
