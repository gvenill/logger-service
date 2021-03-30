import { LogRecord } from './interfaces/log-record.interface';
import { LoggerProvider } from './logger.provider';

export class LoggerService<T> {
  constructor(private readonly loggerProvider: LoggerProvider<T>) {}

  log(logRecord: LogRecord) {
    this.loggerProvider.getLogger(logRecord.logger).log(logRecord);
  }
}
