import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingService } from '../services/logging.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: any) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.loggingService.error(
      `Exception thrown: ${JSON.stringify({
        statusCode: status,
        path: request.url,
        errorMessage,
      })}`,
      'CustomExceptionFilter',
    );
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message:
        exception instanceof Error ? exception.message : 'An error occurred',
    });
  }
}
