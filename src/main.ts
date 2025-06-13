import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { SwaggerModule } from '@nestjs/swagger';
import { LoggingService } from './services/logging.service';

async function bootstrap() {
  const customLogger = new LoggingService();

  const app = await NestFactory.create(AppModule, { logger: customLogger });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const filePath = join(__dirname, '..', 'doc', 'api.yaml');
  const file = await readFile(filePath, 'utf8');
  const swagger = parse(file);
  SwaggerModule.setup('/doc', app, swagger);

  customLogger.log('Application is ready to serve requests on port 4000');
  await app.listen(4000);
}

bootstrap();
