import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('favs')
@UseGuards(AuthGuard)
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get()
  findAll() {
    return this.favouriteService.findAll();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  create(@Param('id') trackId: string) {
    return this.favouriteService.createFavouriteTrack(trackId);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') trackId: string) {
    return this.favouriteService.removeFavouriteTrack(trackId);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Param('id') albumId: string) {
    return this.favouriteService.createFavouriteAlbum(albumId);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id') albumId: string) {
    return this.favouriteService.removeFavouriteAlbum(albumId);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  createArtist(@Param('id') artistId: string) {
    return this.favouriteService.createFavouriteArtist(artistId);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id') artistId: string) {
    return this.favouriteService.removeFavouriteArtist(artistId);
  }
}
