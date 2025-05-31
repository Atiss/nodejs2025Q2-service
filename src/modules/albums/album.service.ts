import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validate } from 'uuid';
import { albums, favorites } from '../../db/database';
import { TrackService } from '../track/track.service';

@Injectable()
export class AlbumService {
  private albums = albums;
  private favouriteAlbums: string[] = favorites.albums;

  constructor(private readonly trackService: TrackService) {}

  create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new HttpException(
        'name and year are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newAlbum = {
      id: crypto.randomUUID(),
      name: createAlbumDto.name,
      artistId: createAlbumDto.artistId || null,
      year: createAlbumDto.year,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid album id', HttpStatus.BAD_REQUEST);
    }
    const foundAlbum = this.albums.find((album) => album.id === id);
    if (!foundAlbum) {
      throw new HttpException('album not found', HttpStatus.NOT_FOUND);
    }
    return foundAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!validate(id) || !updateAlbumDto.name || !updateAlbumDto.year) {
      throw new HttpException(
        'invalid album id or missing fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const currentAlbum = this.albums.find((album) => album.id === id);
    if (!currentAlbum) {
      throw new HttpException('album not found', HttpStatus.NOT_FOUND);
    }
    if (updateAlbumDto.name) {
      currentAlbum.name = updateAlbumDto.name;
    }
    if (updateAlbumDto.artistId) {
      currentAlbum.artistId = updateAlbumDto.artistId;
    }
    if (updateAlbumDto.year) {
      currentAlbum.year = updateAlbumDto.year;
    }
    return currentAlbum;
  }

  remove(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid album id', HttpStatus.BAD_REQUEST);
    }
    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1) {
      throw new HttpException('album not found', HttpStatus.NOT_FOUND);
    }
    this.albums.splice(albumIndex, 1);
    this.trackService.deleteAlbum(id);
    const favouriteIndex = this.favouriteAlbums.indexOf(id);
    if (favouriteIndex !== -1) {
      this.favouriteAlbums.splice(favouriteIndex, 1);
    }
    return;
  }

  deleteArtist(id: string) {
    this.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
  }

  getByIds(ids: string[]): any[] {
    return this.albums.filter((album) => ids.includes(album.id));
  }
}
