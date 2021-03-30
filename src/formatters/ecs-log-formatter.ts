import { LogRecordDto } from '../dto/log-record.dto';
import { EcsLog } from '../interfaces/log-ecs.interface';
import { LogFormatter } from '../interfaces/log-formatter.interface';

// TODO: Refactor me to get rid of `any`

const add = (obj: any) =>
  Object.values(obj).some(v => v !== undefined) ? obj : undefined;

export class EcsLogFormatter implements LogFormatter<EcsLog> {
  format(logRecord: LogRecordDto): EcsLog {
    return {
      '@timestamp': logRecord.timestamp,
      message: logRecord.message,
      log: {
        level: logRecord.logLevel,
        logger: logRecord.logger,
      },
      user_agent: add({
        original: logRecord.userAgent,
      }),
      event: add({
        duration: logRecord.duration,
      }),
      trace: add({
        id: logRecord.traceId,
      }),
      url: add({
        original: logRecord?.request?.url,
        domain: logRecord?.request?.domain,
      }),
      http: add({
        'request.referrer': logRecord.request?.referrer,
        'request.method': logRecord.request?.method,
        'response.status_code': logRecord.request?.statusCode,
      }),
      source: add({
        ip: logRecord.ip,
      }),
    };
  }
}
