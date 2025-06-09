import { Injectable } from '@nestjs/common';
import { customLogger } from './main';

@Injectable()
export class AppService {
  getHello(): string {
    customLogger.log('getHello method called');
    return 'Hello World!';
  }
}
