import { LogRecord } from './log-record.interface';

export interface LogFormatter<T> {
  format: (logRecord: LogRecord) => T;
}
