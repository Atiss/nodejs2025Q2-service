import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../albums/album.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, TrackService, AlbumService],
})
export class ArtistModule {}
