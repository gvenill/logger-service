import { LogRecordDto } from '../dto/log-record.dto';

export interface LogFormatter<T> {
  format: (logRecord: LogRecordDto) => T;
}
