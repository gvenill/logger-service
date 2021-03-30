import * as log4js from 'log4js';
import { LoggerProvider } from '../../logger.provider';
import { LogFormatter } from '../../interfaces/log-formatter.interface';
import { LogLevel } from '../../constants/log-level';
import { LogRecordDto } from '../../dto/log-record.dto';

export class Log4JsProvider<T> extends LoggerProvider<T> {
  private readonly logger: log4js.Logger;

  constructor(logFormatter: LogFormatter<T>) {
    super(logFormatter);
    this.configureLogger();
  }

  private configureLogger() {
    log4js.addLayout('json', this.jsonLayout);
    const layouts = {
      json: {
        out: { type: 'stdout', layout: { type: 'json' } },
      },
    };

    log4js.configure({
      appenders: layouts.json,
      categories: { default: { appenders: ['out'], level: LogLevel.INFO } },
    });
  }

  get jsonLayout() {
    return () => (e: log4js.LoggingEvent) => {
      return JSON.stringify(this.logFormatter.format(e.data[0]));
    };
  }

  getLogger(loggerName: string) {
    const logger = log4js.getLogger(loggerName);

    return {
      log(logRecord: LogRecordDto) {
        logger.info(logRecord);
      },

      error(logRecord: LogRecordDto) {
        logger.error(logRecord);
      },

      name: loggerName,
    };
  }
}
