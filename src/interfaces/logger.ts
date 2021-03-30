import { LogRecordDto } from '../dto/log-record.dto';

export interface Logger {
  log: (logRecord: LogRecordDto) => void;
  readonly name: string;
}