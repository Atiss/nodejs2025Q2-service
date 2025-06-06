import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate } from 'uuid';
import { PrismaClient, Track } from '@prisma/client';

@Injectable()
export class TrackService {
  private prisma;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new HttpException(
        'name and duration are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
      duration: createTrackDto.duration,
    };
    await this.prisma.track.create({ data: newTrack });
    return newTrack;
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid track id', HttpStatus.BAD_REQUEST);
    }
    const foundTrack = await this.prisma.track.findUnique({ where: { id } });
    if (!foundTrack) {
      throw new HttpException('track not found', HttpStatus.NOT_FOUND);
    }
    return foundTrack;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!validate(id) || !updateTrackDto.name || !updateTrackDto.duration) {
      throw new HttpException(
        'invalid track id or missing fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const currentTrack = await this.prisma.track.findUnique({ where: { id } });
    if (!currentTrack) {
      throw new HttpException('track not found', HttpStatus.NOT_FOUND);
    }
    if (updateTrackDto.name) {
      currentTrack.name = updateTrackDto.name;
    }
    if (updateTrackDto.artistId) {
      currentTrack.artistId = updateTrackDto.artistId;
    }
    if (updateTrackDto.albumId) {
      currentTrack.albumId = updateTrackDto.albumId;
    }
    if (updateTrackDto.duration) {
      currentTrack.duration = updateTrackDto.duration;
    }
    await this.prisma.track.update({
      where: { id },
      data: currentTrack,
    });
    return currentTrack;
  }

  async remove(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid track id', HttpStatus.BAD_REQUEST);
    }
    const foundTrack = await this.prisma.track.findUnique({ where: { id } });
    if (!foundTrack) {
      throw new HttpException('track not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.track.delete({ where: { id } });
    await this.deleteTrackFromFavourites(id);
    return `track with id ${id} deleted successfully`;
  }

  private async deleteTrackFromFavourites(id: string) {
    const favourites = await this.prisma.favourite.findUnique({
      where: { id: 'favourites' },
    });
    favourites.tracks = favourites.tracks.filter(
      (track: string) => track !== id,
    );
    await this.prisma.favourite.update({
      where: { id: 'favourites' },
      data: {
        tracks: {
          set: favourites.tracks,
        },
      },
    });
  }

  async deleteArtist(artistId: string) {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  async deleteAlbum(albumId: string) {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }

  async getByIds(ids: string[]): Promise<Track[]> {
    return await this.prisma.track.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
