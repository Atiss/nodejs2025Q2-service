import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../albums/entities/album.entity';
import { Track } from '../../track/entities/track.entity';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
