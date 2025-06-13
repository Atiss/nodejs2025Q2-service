import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import {
  existsSync,
  WriteStream,
  mkdirSync,
  createWriteStream,
  statSync,
  renameSync,
} from 'node:fs';
import * as process from 'node:process';

@Injectable()
export class LoggingService extends ConsoleLogger {
  logDir = process.env.LOG_DIR || './logs';
  logFile: WriteStream;
  logFilePath = `${this.logDir}/app.log`;
  fileSizeLimit = parseInt(process.env.LOG_FILE_SIZE_LIMIT, 10) || 10;
  logLevel: LogLevel[] = this.getLogLevels();

  constructor() {
    super();
    this.prepareLogging();
  }

  prepareLogging() {
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir);
    }

    this.logFile = createWriteStream(this.logFilePath, {
      flags: 'a',
    });
  }

  private getLogLevels(): LogLevel[] {
    const level = process.env.LOG_LEVEL || 'log';
    const levels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
    const index = levels.indexOf(level as LogLevel);
    return index >= 0 ? levels.slice(0, index + 1) : ['log'];
  }

  private writeLog(level: string, message: string, context?: string) {
    this.fileSizeRotation();
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${level}] ${timestamp} [${context || 'Application'}] ${message}`;
    this.logFile.write(`${formattedMessage}\n`);
    const output = level === 'ERROR' ? process.stderr : process.stdout;
    output.write(`${formattedMessage}\n`);
  }

  log(message: string, context?: string) {
    if (this.logLevel.includes('log')) {
      this.writeLog('LOG', message, context);
    }
  }

  error(message: string, context?: string) {
    if (this.logLevel.includes('error')) {
      this.writeLog('ERROR', message, context);
    }
  }

  warn(message: string, context?: string) {
    if (this.logLevel.includes('warn')) {
      this.writeLog('WARN', message, context);
    }
  }

  debug(message: string, context?: string) {
    if (this.logLevel.includes('debug')) {
      this.writeLog('DEBUG', message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.logLevel.includes('verbose')) {
      this.writeLog('VERBOSE', message, context);
    }
  }

  private fileSizeRotation() {
    try {
      const stats = statSync(this.logFile.path);
      if (stats.size > this.fileSizeLimit * 1024) {
        this.logFile.end();
        const newFileName = `${this.logDir}/app-${new Date().toISOString().replace(/:/g, '-')}.log`;
        renameSync(this.logFilePath, newFileName);

        this.logFile = createWriteStream(this.logFilePath, { flags: 'a' });
      }
    } catch (error) {
      console.log(`Error during file size rotation: ${error.message}`);
    }
  }
}
