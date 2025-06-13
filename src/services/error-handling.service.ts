import { Injectable, OnModuleInit } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Injectable()
export class ErrorHandlingService implements OnModuleInit {
  constructor(private readonly loggingService: LoggingService) {}

  onModuleInit() {
    process.on('uncaughtException', (error) => {
      this.loggingService.error('Uncaught Exception', error.stack);
    });

    process.on('unhandledRejection', () => {
      this.loggingService.error('Unhandled Rejection', '');
    });
  }
}
