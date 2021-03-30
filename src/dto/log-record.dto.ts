import { LogLevel } from '../constants';

export class LogRecordDto {
  logLevel: LogLevel;
  logger: string;
  timestamp: Date;
  message?: string;
  userAgent?: string;
  duration?: number;
  traceId?: string;
  request?: {
    url?: string;
    referrer?: string;
    method?: string;
    statusCode: number;
    domain?: string;
  };
  ip?: string;
  error?: {
    message: string;
    stackTrace: string | string[];
    type: string;
  };
  meta?: unknown;
}
