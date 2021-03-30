import { Response } from 'express';
import { mockDateFactory } from '../../utils/mocks/date-factory.mock';
import { LogLevel, LogName } from '../../constants';
import { LogRecordDto } from '../../dto/log-record.dto';
import { expressResponseLogMap } from './express-response-log-map';

const CURRENT_DATE = '2021-02-17T15:31:30.303Z';
const DURATION = 999;

const getResponse = (statusCode = 200) =>
  (({
    req: {
      socket: {
        remoteAddress: '::1',
      },
      originalUrl:
        '/v1/self-evaluation-client-notifications/autopricing/4059753826',
      method: 'GET',
      statusCode,
      hostname: null,
      headers: {
        host: 'localhost:3030',
        connection: 'keep-alive',
        pragma: 'no-cache',
        'cache-control': 'no-cache',
        accept: 'text/event-stream',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: 'http://localhost:3030/test',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6',
      },
      get(key: string) {
        return {
          Referer: 'http://localhost:3030/test',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
        }[key];
      },
    },
    statusCode,
  } as any) as Response);

const getLogRecordDto = (res: Response, duration = DURATION): LogRecordDto => ({
  logLevel: LogLevel.INFO,
  logger: LogName.ON_RESPONSE,
  timestamp: new Date(),
  userAgent: res.req?.get('user-agent'),
  duration: duration,
  traceId: res.req?.headers['x-b3-traceid']?.toString(),
  request: {
    url: res.req?.originalUrl,
    method: res.req?.method,
    statusCode: res.statusCode,
    domain: res.req?.hostname,
    referrer: res.req?.get('Referer'),
  },
  ip: res.req?.socket.remoteAddress,
});

const getLogRecordDtoWithoutReq = (duration = DURATION) => ({
  logLevel: LogLevel.INFO,
  logger: LogName.ON_RESPONSE,
  timestamp: new Date(),
  duration,
});

describe('custom-logger/response-log-map-provider/express-response-log-map-provider', () => {
  beforeEach(() => {
    global.Date = mockDateFactory(CURRENT_DATE) as any;
  });

  it('should map response to dto', () => {
    const response = getResponse();

    expect(
      expressResponseLogMap.toDto(response, { duration: DURATION })
    ).toEqual(getLogRecordDto(response));
  });

  test('should use x-forwarder-for for ip if available', () => {
    const IP = '34.249.26.121';
    const response = getResponse();
    if (response.req) {
      response.req.headers['x-forwarded-for'] = IP;
    }
    const logRecordDto = getLogRecordDto(response);
    logRecordDto.ip = IP;

    expect(
      expressResponseLogMap.toDto(response, { duration: DURATION })
    ).toEqual(logRecordDto);
  });

  it('should not fail if req is empty', () => {
    const response: any = {};
    expect(
      expressResponseLogMap.toDto(response, { duration: DURATION })
    ).toEqual(getLogRecordDtoWithoutReq());
  });

  it('should set log level to ERROR is status code >= 400', () => {
    const errorCode = 500;
    const response = getResponse(errorCode);
    const logRecordDto = getLogRecordDto(response);
    logRecordDto.logLevel = LogLevel.ERROR;

    expect(
      expressResponseLogMap.toDto(response as any, { duration: DURATION })
    ).toEqual(logRecordDto);
  });
});
