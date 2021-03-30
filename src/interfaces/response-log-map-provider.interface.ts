import { LogRecord } from './log-record.interface';

export interface ResponseMeta {
  duration: number;
}

// TODO: Remove `provider` from the name

export interface ResponseLogMapProvider<T> {
  toDto: (res: T, meta: ResponseMeta, message?: string) => LogRecord;
}
