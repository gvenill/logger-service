import { LogRecord } from './log-record.interface';

export interface ResponseMeta {
  duration: number;
}

export interface ResponseLogMap<T> {
  toDto: (res: T, meta: ResponseMeta, message?: string) => LogRecord;
}
