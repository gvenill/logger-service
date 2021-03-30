import { AxiosResponse } from 'axios';
import { axiosResponseLogMapProvider } from '.';
import { mockDateFactory } from '../../utils/mocks/date-factory.mock';
import { LogRecord } from '../../interfaces/log-record.interface';
import { LogLevel, LogName } from '../../constants';

const CURRENT_DATE = '2021-02-17T15:31:30.303Z';
const DOMAIN = 'api-marketing-aws-eu-qa-1.auto1-test.com';
const getResponse = (status = 200): AxiosResponse => ({
  data: {},
  status,
  statusText: 'ok',
  headers: {
    'x-b3-traceid': '12344545',
  },
  config: {
    url: '/v1/self-evaluation/2906731789/pricing-status',
    method: 'get',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'User-Agent': 'axios/0.21.1',
    },
    params: { wa_key: 'classifieds-web-qa1-20f6d61f' },
    baseURL: `http://${DOMAIN}`,
  },
});

describe('custom-logger/response-log-map-provider/axios-response-log-map-provider', () => {
  beforeEach(() => {
    global.Date = mockDateFactory(CURRENT_DATE) as any;
  });

  test('map response to dto', () => {
    const DURATION = 1000;
    const response: AxiosResponse = getResponse();
    const expectedRecordDto: LogRecord = {
      logLevel: LogLevel.INFO,
      logger: LogName.ON_RESPONSE,
      timestamp: new Date(),
      userAgent: response.config.headers['User-Agent'],
      duration: DURATION,
      traceId: response.headers['x-b3-traceid'],
      request: {
        url: response.config.url,
        method: response.config.method,
        statusCode: response.status,
        domain: DOMAIN,
      },
    };

    expect(
      axiosResponseLogMapProvider.toDto(response, { duration: DURATION })
    ).toEqual(expectedRecordDto);
  });

  test('map error response to dto', () => {
    const DURATION = 1000;
    const MESSAGE = 'oh noes!';
    const response: AxiosResponse = getResponse(404);
    const expectedRecordDto: LogRecord = {
      logLevel: LogLevel.ERROR,
      logger: LogName.ON_RESPONSE,
      message: MESSAGE,
      timestamp: new Date(),
      userAgent: response.config.headers['User-Agent'],
      duration: DURATION,
      traceId: response.headers['x-b3-traceid'],
      request: {
        url: response.config.url,
        method: response.config.method,
        statusCode: response.status,
        domain: DOMAIN,
      },
    };

    expect(
      axiosResponseLogMapProvider.toDto(
        response,
        {
          duration: DURATION,
        },
        MESSAGE
      )
    ).toEqual(expectedRecordDto);
  });
});
