import { LogFormatter } from './interfaces/log-formatter.interface';
import { Logger } from './interfaces/logger';

export abstract class LoggerProvider<T> {
  constructor(protected readonly logFormatter: LogFormatter<T>) {}

  abstract getLogger(name: string): Logger;
}
