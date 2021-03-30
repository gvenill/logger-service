import { LogRecord } from '../interfaces/log-record.interface';
import { EcsLog } from '../interfaces/log-ecs.interface';
import { LogFormatter } from '../interfaces/log-formatter.interface';

export class EcsLogFormatter implements LogFormatter<EcsLog> {
  private getUrlField(logRecord: LogRecord) {
    const original = logRecord.request?.url;
    const domain = logRecord.request?.domain;
    if (!original || !domain) return;

    return { original, domain };
  }

  private getHttpField(logRecord: LogRecord) {
    if (!logRecord.request) return;

    return {
      'request.referrer': logRecord.request.referrer,
      'request.method': logRecord.request.method,
      'response.status_code': logRecord.request.statusCode,
    };
  }

  format(logRecord: LogRecord): EcsLog {
    return {
      '@timestamp': logRecord.timestamp,
      message: logRecord.message,
      log: {
        level: logRecord.logLevel,
        logger: logRecord.logger,
      },
      user_agent:
        logRecord.userAgent !== undefined
          ? {
              original: logRecord.userAgent,
            }
          : undefined,
      event:
        logRecord.duration !== undefined
          ? {
              duration: logRecord.duration,
            }
          : undefined,
      trace:
        logRecord.traceId !== undefined
          ? {
              id: logRecord.traceId,
            }
          : undefined,
      url: this.getUrlField(logRecord),
      http: this.getHttpField(logRecord),
      source:
        logRecord.ip !== undefined
          ? {
              ip: logRecord.ip,
            }
          : undefined,
    };
  }
}
