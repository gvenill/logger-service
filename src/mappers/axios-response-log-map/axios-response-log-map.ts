import { AxiosResponse } from 'axios';
import { LogLevel, LogName } from '../../constants';
import { LogRecordDto } from '../../dto/log-record.dto';
import {
  ResponseLogMapProvider,
  ResponseMeta,
} from '../../interfaces/response-log-map-provider.interface';

function tryGetDomain(url?: string): string | undefined {
  if (typeof url !== 'string') return;
  try {
    return new URL(url).host;
  } catch {
    return;
  }
}

export const axiosResponseLogMapProvider: ResponseLogMapProvider<AxiosResponse> = {
  toDto(
    res: AxiosResponse,
    meta: ResponseMeta,
    message?: string
  ): LogRecordDto {
    return {
      logLevel: res.status >= 400 ? LogLevel.ERROR : LogLevel.INFO,
      message,
      logger: LogName.ON_RESPONSE,
      timestamp: new Date(),
      userAgent: res.config.headers['User-Agent'],
      duration: meta.duration,
      traceId: res.headers['x-b3-traceid'],
      request: {
        url: res.config.url,
        method: res.config.method,
        statusCode: res.status,
        domain: tryGetDomain(res.config.baseURL),
      },
    };
  },
};
