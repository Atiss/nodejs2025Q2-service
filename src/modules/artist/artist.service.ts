import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate } from 'uuid';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../albums/album.service';
import { Artist, PrismaClient } from '@prisma/client';

@Injectable()
export class ArtistService {
  private prisma;

  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {
    this.prisma = new PrismaClient();
  }
  async create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || createArtistDto.grammy === undefined) {
      throw new HttpException('name is required', HttpStatus.BAD_REQUEST);
    }
    const newArtist = {
      id: crypto.randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    await this.prisma.artist.create({
      data: newArtist,
    });
    return newArtist;
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid artist id', HttpStatus.BAD_REQUEST);
    }
    const foundArtist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!foundArtist) {
      throw new HttpException('artist not found', HttpStatus.NOT_FOUND);
    }
    return foundArtist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    if (
      !validate(id) ||
      !updateArtistDto.name ||
      updateArtistDto.grammy === undefined
    ) {
      throw new HttpException(
        'invalid artist id or missing fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const currentArtist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!currentArtist) {
      throw new HttpException('artist not found', HttpStatus.NOT_FOUND);
    }
    if (updateArtistDto.name) {
      currentArtist.name = updateArtistDto.name;
    }
    if (updateArtistDto.grammy !== undefined) {
      currentArtist.grammy = updateArtistDto.grammy;
    }
    await this.prisma.artist.update({
      where: { id },
      data: currentArtist,
    });
    return currentArtist;
  }

  async remove(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid artist id', HttpStatus.BAD_REQUEST);
    }
    const foundArtist = await this.prisma.artist.findUnique({ where: { id } });
    if (!foundArtist) {
      throw new HttpException('artist not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.artist.delete({
      where: { id },
    });

    this.trackService.deleteArtist(id);
    this.albumService.deleteArtist(id);
    await this.deleteArtistFromFavourites(id);
    return `artist with id ${id} deleted successfully`;
  }

  private async deleteArtistFromFavourites(id: string) {
    const favourites = await this.prisma.favourite.findUnique({
      where: { id: 'favourites' },
    });
    favourites.artists = favourites.artists.filter((artist) => artist !== id);
    return this.prisma.favourite.update({
      where: { id: 'favourites' },
      data: {
        artists: {
          set: favourites.artists,
        },
      },
    });
  }

  async getByIds(ids: string[]): Promise<Artist[]> {
    return await this.prisma.artist.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
