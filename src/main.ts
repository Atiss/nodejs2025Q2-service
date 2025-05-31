import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const filePath = join(__dirname, '..', 'doc', 'api.yaml');
  const file = await readFile(filePath, 'utf8');
  const swagger = parse(file);
  SwaggerModule.setup('/doc', app, swagger);

  await app.listen(4000);
}
bootstrap();
