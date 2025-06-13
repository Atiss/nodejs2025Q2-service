import { Injectable } from '@nestjs/common';
import { LoggingService } from './services/logging.service';

@Injectable()
export class AppService {
  constructor(private readonly loggingService: LoggingService) {}

  getHello(): string {
    this.loggingService.debug('getHello method called');
    return 'Hello World!';
  }
}
