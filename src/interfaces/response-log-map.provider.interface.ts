import { LogRecordDto } from '../dto/log-record.dto';

export interface ResponseMeta {
  duration: number;
}

export interface ResponseLogMapProvider<T> {
  toDto: (res: T, meta: ResponseMeta, message?: string) => LogRecordDto;
}
