import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../albums/album.service';
import { ArtistService } from '../artist/artist.service';

@Module({
  controllers: [FavouriteController],
  providers: [FavouriteService, TrackService, AlbumService, ArtistService],
})
export class FavouriteModule {}
