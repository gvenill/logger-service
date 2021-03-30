import { LogRecord } from './log-record.interface';

export interface Logger {
  log: (logRecord: LogRecord) => void;
  readonly name: string;
}
