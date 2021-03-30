import { LogLevel, LogName } from '../constants';
import { EcsLog } from '../interfaces/log-ecs.interface';
import { EcsLogFormatter } from './ecs-log-formatter';

describe('custom-logger/formatters/ecs-log-formatter', () => {
  let ecsFormatter: EcsLogFormatter;

  beforeEach(() => {
    ecsFormatter = new EcsLogFormatter();
  });

  test('Format log record with basic fields to ECS', () => {
    const logRecord = {
      timestamp: new Date(),
      message: 'Some message',
      logLevel: LogLevel.INFO,
      logger: 'my-logger',
    };
    const ecsLog: EcsLog = {
      '@timestamp': logRecord.timestamp,
      message: logRecord.message,
      log: {
        level: logRecord.logLevel,
        logger: logRecord.logger,
      },
    };

    expect(ecsFormatter.format(logRecord)).toEqual(ecsLog);
  });

  test('Format ResponseLogRecordDto to ECS', () => {
    const logRecord = {
      logLevel: LogLevel.ERROR,
      logger: LogName.ON_RESPONSE,
      message: 'oh noes',
      timestamp: new Date(),
      userAgent: 'axios/0.21.1',
      duration: 1000,
      traceId: '123-456-789',
      request: {
        url: '/v1/self-evaluation/2906731789/pricing-status',
        method: 'get',
        statusCode: 400,
        domain: 'api-marketing-aws-eu-qa-1.auto1-test.com',
        referrer: 'http://localhost:3030/test',
      },
      ip: '127.0.0.1',
    };
    const expectedEcsLog: EcsLog = {
      '@timestamp': logRecord.timestamp,
      message: logRecord.message,
      log: {
        level: logRecord.logLevel,
        logger: logRecord.logger,
      },
      user_agent: {
        original: logRecord.userAgent,
      },
      event: {
        duration: logRecord.duration,
      },
      trace: {
        id: logRecord.traceId,
      },
      url: {
        original: logRecord.request.url,
        domain: logRecord.request.domain,
      },
      http: {
        'request.referrer': logRecord.request.referrer,
        'request.method': logRecord.request.method,
        'response.status_code': logRecord.request.statusCode,
      },
      source: {
        ip: logRecord.ip,
      },
    };

    expect(ecsFormatter.format(logRecord)).toEqual(expectedEcsLog);
  });
});
