import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { validate } from 'uuid';
import { favorites, tracks } from '../../db/database';

@Injectable()
export class TrackService {
  private tracks: Track[] = tracks;
  private favouriteTracks: string[] = favorites.tracks;
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
    this.tracks.splice(trackIndex, 1);
    const favouriteIndex = this.favouriteTracks.indexOf(id);
    if (favouriteIndex !== -1) {
      this.favouriteTracks.splice(favouriteIndex, 1);
    }
    return `track with id ${id} deleted successfully`;
  }

  deleteArtist(artistId: string) {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  deleteAlbum(albumId: string) {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }

  getByIds(ids: string[]): Track[] {
    return this.tracks.filter((track) => ids.includes(track.id));
  }
}
