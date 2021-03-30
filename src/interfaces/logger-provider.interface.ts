import { LogRecordDto } from '../dto/log-record.dto';
import { LogFormatter } from './log-formatter.interface';

export interface Logger {
  log: (logRecord: LogRecordDto) => void;
  error: (logRecord: LogRecordDto) => void;
  readonly name: string;
}
export interface _LoggerProvider {
  getLogger(loggerName: string): Logger;
}

export abstract class LoggerProvider<T> {
  constructor(protected readonly logFormatter: LogFormatter<T>) {}

  abstract getLogger(loggerName: string): Logger;
}
