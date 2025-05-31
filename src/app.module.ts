import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TrackModule } from './modules/track/track.module';

@Module({
  imports: [UserModule, TrackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
