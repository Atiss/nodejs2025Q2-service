import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { validate } from 'uuid';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];
  create(createTrackDto: CreateTrackDto) {
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
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid track id', HttpStatus.BAD_REQUEST);
    }
    const foundTrack = this.tracks.find((track) => track.id === id);
    if (!foundTrack) {
      throw new HttpException('track not found', HttpStatus.NOT_FOUND);
    }
    return foundTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!validate(id) || !updateTrackDto.name || !updateTrackDto.duration) {
      throw new HttpException(
        'invalid track id or missing fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const currentTrack = this.tracks.find((track) => track.id === id);
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
    return currentTrack;
  }

  remove(id: string) {
    if (!validate(id)) {
      throw new HttpException('invalid track id', HttpStatus.BAD_REQUEST);
    }
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new HttpException('track not found', HttpStatus.NOT_FOUND);
    }
    this.tracks = this.tracks.filter((track) => track.id !== id);
    return `track with id ${id} deleted successfully`;
  }
}
