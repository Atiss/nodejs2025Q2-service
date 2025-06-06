import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../albums/album.service';
import { TrackService } from '../track/track.service';
import { validate } from 'uuid';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FavouriteService {
  private prisma;

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {
    this.prisma = new PrismaClient();
    this.initFavourites();
  }

  private async initFavourites() {
    const existingFavourites = await this.prisma.favourite.findUnique({
      where: { id: 'favourites' },
    });
    if (!existingFavourites) {
      await this.prisma.favourite.create({
        data: {
          id: 'favourites',
          artists: [],
          albums: [],
          tracks: [],
        },
      });
    }
  }

  async findAll() {
    const favs = await this.prisma.favourite.findUnique({
      where: { id: 'favourites' },
    });
    return {
      artists: await this.artistService.getByIds(favs.artists),
      albums: await this.albumService.getByIds(favs.albums),
      tracks: await this.trackService.getByIds(favs.tracks),
    };
  }

  async createFavouriteTrack(trackId: string) {
    const favourites = await this.prisma.favourite.findUnique({
      where: { id: 'favourites' },
    });

    if (!validate(trackId)) {
      throw new HttpException('invalid track ID', HttpStatus.BAD_REQUEST);
    }

    try {
      const track = await this.trackService.findOne(trackId);
      favourites.tracks.push(trackId);
      await this.prisma.favourite.update({
        where: { id: 'favourites' },
        data: { tracks: favourites.tracks },
      });
      return track;
    } catch (error) {
      throw new HttpException(
        'track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async removeFavouriteTrack(trackId: string) {
    const favourites = await this.prisma.favourite.findUnique({
      where: { id: 'favourites' },
    });
    if (!validate(trackId)) {
      throw new HttpException('invalid track ID', HttpStatus.BAD_REQUEST);
    }
    const trackIndex = favourites.tracks.indexOf(trackId);
    if (trackIndex === -1) {
      throw new HttpException(
        'track not found in favourites',
        HttpStatus.NOT_FOUND,
      );
    }
    favourites.tracks.splice(trackIndex, 1);
    await this.prisma.favourite.update({
      where: { id: 'favourites' },
      data: { tracks: favourites.tracks },
    });
    return `track with id ${trackId} removed from favourites`;
  }

  async createFavouriteAlbum(albumId: string) {
    const favourites = await this.prisma.favourite.findUnique({
      where: { id: 'favourites' },
    });
    if (!validate(albumId)) {
      throw new HttpException('invalid album ID', HttpStatus.BAD_REQUEST);
    }
    try {
      const album = await this.albumService.findOne(albumId);
      favourites.albums.push(albumId);
      await this.prisma.favourite.update({
        where: { id: 'favourites' },
        data: { albums: favourites.albums },
      });
      return album;
    } catch (error) {
      throw new HttpException(
        'album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async removeFavouriteAlbum(albumId: string) {
    const favourites = await this.prisma.favourite.findUnique({
      where: { id: 'favourites' },
    });
    if (!validate(albumId)) {
      throw new HttpException('invalid album ID', HttpStatus.BAD_REQUEST);
    }
    const albumIndex = favourites.albums.indexOf(albumId);
    if (albumIndex === -1) {
      throw new HttpException(
        'album not found in favourites',
        HttpStatus.NOT_FOUND,
      );
    }
    favourites.albums.splice(albumIndex, 1);
    await this.prisma.favourite.update({
      where: { id: 'favourites' },
      data: { albums: favourites.albums },
    });
    return `album with id ${albumId} removed from favourites`;
  }

  async createFavouriteArtist(artistId: string) {
    const favourites = await this.prisma.favourite.findUnique({
      where: { id: 'favourites' },
    });
    if (!validate(artistId)) {
      throw new HttpException('invalid artist ID', HttpStatus.BAD_REQUEST);
    }
    try {
      const artist = await this.artistService.findOne(artistId);
      favourites.artists.push(artistId);
      await this.prisma.favourite.update({
        where: { id: 'favourites' },
        data: { artists: favourites.artists },
      });
      return artist;
    } catch (error) {
      throw new HttpException(
        'artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async removeFavouriteArtist(artistId: string) {
    const favourites = await this.prisma.favourite.findUnique({
      where: { id: 'favourites' },
    });
    if (!validate(artistId)) {
      throw new HttpException('invalid artist ID', HttpStatus.BAD_REQUEST);
    }
    const artistIndex = favourites.artists.indexOf(artistId);
    if (artistIndex === -1) {
      throw new HttpException(
        'artist not found in favourites',
        HttpStatus.NOT_FOUND,
      );
    }
    favourites.artists.splice(artistIndex, 1);
    await this.prisma.favourite.update({
      where: { id: 'favourites' },
      data: { artists: favourites.artists },
    });
    return `artist with id ${artistId} removed from favourites`;
  }
}
