import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validate } from 'uuid';
import { TrackService } from '../track/track.service';
import { Album, PrismaClient } from '@prisma/client';

@Injectable()
export class AlbumService {
  private prisma;

  constructor(private readonly trackService: TrackService) {
    this.prisma = new PrismaClient();
  }

  async create(createAlbumDto: CreateAlbumDto) {
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
    await this.prisma.album.create({
      data: newAlbum,
    });
    return newAlbum;
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid album id', HttpStatus.BAD_REQUEST);
    }
    const foundAlbum = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!foundAlbum) {
      throw new HttpException('album not found', HttpStatus.NOT_FOUND);
    }
    return foundAlbum;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!validate(id) || !updateAlbumDto.name || !updateAlbumDto.year) {
      throw new HttpException(
        'invalid album id or missing fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const currentAlbum = await this.prisma.album.findUnique({
      where: { id },
    });
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
    await this.prisma.album.update({
      where: { id },
      data: currentAlbum,
    });
    return currentAlbum;
  }

  async remove(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid album id', HttpStatus.BAD_REQUEST);
    }
    const foundAlbum = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!foundAlbum) {
      throw new HttpException('album not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.album.delete({
      where: { id },
    });
    this.trackService.deleteAlbum(id);

    this.deleteAlbumFromFavourites(id);
    return;
  }

  private async deleteAlbumFromFavourites(id: string) {
    const favourites = await this.prisma.favourite.findUnique({
      where: { id: 'favourites' },
    });
    favourites.albums = favourites.albums.filter((album) => album !== id);
    return this.prisma.favourite.update({
      where: { id: 'favourites' },
      data: {
        albums: {
          set: favourites.albums,
        },
      },
    });
  }

  async deleteArtist(id: string) {
    return await this.prisma.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });
  }

  async getByIds(ids: string[]): Promise<Album[]> {
    return await this.prisma.album.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
