import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TrackModule } from './modules/track/track.module';
import { ArtistModule } from './modules/artist/artist.module';
import { AlbumModule } from './modules/albums/album.module';
import { FavouriteModule } from './modules/favourite/favourite.module';
import { LoggingService } from './services/logging.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpRequestInterceptor } from './interceptors/httpRequest.interceptor';
import { CustomExceptionFilter } from './exceptionFilters/custom.exception-filter';
import { ErrorHandlingService } from './services/error-handling.service';

@Module({
  imports: [
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavouriteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggingService,
    ErrorHandlingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpRequestInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {}
