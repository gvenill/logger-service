import * as log4js from 'log4js';
import { LoggerProvider } from '../../logger.provider';
import { LogFormatter } from '../../interfaces/log-formatter.interface';
import { LogLevel } from '../../constants';
import { LogRecord } from '../../interfaces/log-record.interface';

export class Log4JsProvider<T> extends LoggerProvider<T> {
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
      log(logRecord: LogRecord) {
        logger.info(logRecord);
      },

      error(logRecord: LogRecord) {
        logger.error(logRecord);
      },

      name: loggerName,
    };
  }
}
