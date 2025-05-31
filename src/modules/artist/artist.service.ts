import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate } from 'uuid';
import { TrackService } from '../track/track.service';

@Injectable()
export class ArtistService {
  private artists = [];

  constructor(private trackService: TrackService) {}
  create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || createArtistDto.grammy === undefined) {
      throw new HttpException('name is required', HttpStatus.BAD_REQUEST);
    }
    const newArtist = {
      id: crypto.randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid artist id', HttpStatus.BAD_REQUEST);
    }
    const foundArtist = this.artists.find((artist) => artist.id === id);
    if (!foundArtist) {
      throw new HttpException('artist not found', HttpStatus.NOT_FOUND);
    }
    return foundArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
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
    const currentArtist = this.artists.find((artist) => artist.id === id);
    if (!currentArtist) {
      throw new HttpException('artist not found', HttpStatus.NOT_FOUND);
    }
    if (updateArtistDto.name) {
      currentArtist.name = updateArtistDto.name;
    }
    if (updateArtistDto.grammy !== undefined) {
      currentArtist.grammy = updateArtistDto.grammy;
    }
    return currentArtist;
  }

  remove(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid artist id', HttpStatus.BAD_REQUEST);
    }
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      throw new HttpException('artist not found', HttpStatus.NOT_FOUND);
    }
    this.trackService.deleteArtist(id);
    this.artists = this.artists.filter((artist) => artist.id !== id);
    return `artist with id ${id} deleted successfully`;
  }
}
