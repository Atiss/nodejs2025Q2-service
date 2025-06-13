import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { LoggingService } from '../services/logging.service';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query, body } = request;

    this.loggingService.log(
      `HTTP Request: ${method} ${url} - Query: ${JSON.stringify(query)} - Body: ${JSON.stringify(body)}`,
      'HttpRequestInterceptor',
    );

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        this.loggingService.log(
          `HTTP Response: ${method} ${url} - Status: ${response.statusCode}`,
          'HttpRequestInterceptor',
        );
      }),
    );
  }
}
