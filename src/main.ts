import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'node:fs';

async function bootstrap() {
  customLogger.log('Application is starting...');

  const app = await NestFactory.create(AppModule, { logger: customLogger });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const filePath = join(__dirname, '..', 'doc', 'api.yaml');
  const file = await readFile(filePath, 'utf8');
  const swagger = parse(file);
  SwaggerModule.setup('/doc', app, swagger);

  customLogger.log('Application is ready to serve requests on port 4000');
  await app.listen(4000);
}

function prepareLogging() {
  const logDir = './logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const logFile = fs.createWriteStream(`${logDir}/app.log`, { flags: 'a' });
  const customLogger = new Logger();

  customLogger.log = (message: string, context?: string) => {
    logFile.write(
      `[LOG] ${new Date().toISOString()} [${context || 'Application'}] ${message}\n`,
    );
    process.stdout.write(
      `[LOG] ${new Date().toISOString()} [${context || 'Application'}] ${message}\n`,
    );
  };

  return customLogger;
}
export const customLogger = prepareLogging();

bootstrap();
