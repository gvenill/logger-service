import { Response } from 'express';
import { LogLevel, LogName } from '../../constants';
import { LogRecordDto } from '../../dto/log-record.dto';
import {
  ResponseLogMapProvider,
  ResponseMeta,
} from '../../interfaces/response-log-map-provider.interface';

export const expressResponseLogMap: ResponseLogMapProvider<Response> = {
  toDto(res: Response, meta: ResponseMeta): LogRecordDto {
    const logRecordDto: LogRecordDto = {
      logLevel: res.statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO,
      logger: LogName.ON_RESPONSE,
      timestamp: new Date(),
      duration: meta.duration,
    };

    return res.req
      ? {
          ...logRecordDto,
          userAgent: res.req?.get('user-agent'),
          traceId: res.req?.headers['x-b3-traceid']?.toString(),
          request: {
            url: res.req?.originalUrl,
            method: res.req?.method,
            statusCode: res.statusCode,
            domain: res.req?.hostname,
            referrer: res.req?.get('Referer'),
          },
          ip:
            res.req?.headers['x-forwarded-for']?.toString() ||
            res.req?.socket.remoteAddress,
        }
      : logRecordDto;
  },
};
