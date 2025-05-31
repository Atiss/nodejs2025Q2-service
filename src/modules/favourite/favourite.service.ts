import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { favorites } from '../../db/database';
import { Favorites } from './entities/favourite.entity';
import { FavoritesResponse } from './dto/favourite-response.dto';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../track/track.service';
import { validate } from 'uuid';

@Injectable()
export class FavouriteService {
  private favourites: Favorites = favorites;

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  findAll(): FavoritesResponse {
    return {
      artists: this.artistService.getByIds(this.favourites.artists),
      albums: this.albumService.getByIds(this.favourites.albums),
      tracks: this.trackService.getByIds(this.favourites.tracks),
    } as FavoritesResponse;
  }

  createFavouriteTrack(trackId: string) {
    if (!validate(trackId) || this.favourites.tracks.includes(trackId)) {
      throw new HttpException('invalid track ID', HttpStatus.BAD_REQUEST);
    }
    try {
      const track = this.trackService.findOne(trackId);
      this.favourites.tracks.push(trackId);
      return track;
    } catch (error) {
      throw new HttpException(
        'track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  removeFavouriteTrack(trackId: string) {
    if (!validate(trackId)) {
      throw new HttpException('invalid track ID', HttpStatus.BAD_REQUEST);
    }
    const trackIndex = this.favourites.tracks.indexOf(trackId);
    if (trackIndex === -1) {
      throw new HttpException(
        'track not found in favourites',
        HttpStatus.NOT_FOUND,
      );
    }
    this.favourites.tracks.splice(trackIndex, 1);
    return `track with id ${trackId} removed from favourites`;
  }

  createFavouriteAlbum(albumId: string) {
    if (!validate(albumId) || this.favourites.albums.includes(albumId)) {
      throw new HttpException('invalid album ID', HttpStatus.BAD_REQUEST);
    }
    try {
      const album = this.albumService.findOne(albumId);
      this.favourites.albums.push(albumId);
      return album;
    } catch (error) {
      throw new HttpException(
        'album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  removeFavouriteAlbum(albumId: string) {
    if (!validate(albumId)) {
      throw new HttpException('invalid album ID', HttpStatus.BAD_REQUEST);
    }
    const albumIndex = this.favourites.albums.indexOf(albumId);
    if (albumIndex === -1) {
      throw new HttpException(
        'album not found in favourites',
        HttpStatus.NOT_FOUND,
      );
    }
    this.favourites.albums.splice(albumIndex, 1);
    return `album with id ${albumId} removed from favourites`;
  }

  createFavouriteArtist(artistId: string) {
    if (!validate(artistId) || this.favourites.artists.includes(artistId)) {
      throw new HttpException('invalid artist ID', HttpStatus.BAD_REQUEST);
    }
    try {
      const artist = this.artistService.findOne(artistId);
      this.favourites.artists.push(artistId);
      return artist;
    } catch (error) {
      throw new HttpException(
        'artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  removeFavouriteArtist(artistId: string) {
    if (!validate(artistId)) {
      throw new HttpException('invalid artist ID', HttpStatus.BAD_REQUEST);
    }
    const artistIndex = this.favourites.artists.indexOf(artistId);
    if (artistIndex === -1) {
      throw new HttpException(
        'artist not found in favourites',
        HttpStatus.NOT_FOUND,
      );
    }
    this.favourites.artists.splice(artistIndex, 1);
    return `artist with id ${artistId} removed from favourites`;
  }
}
