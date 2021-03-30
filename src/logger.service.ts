import { LogRecordDto } from "./dto/log-record.dto";
import { LoggerProvider } from "./logger.provider";

export class LoggerService<T> {
    constructor(private readonly loggerProvider: LoggerProvider<T>){}

    log(logRecord: LogRecordDto) {
        this.loggerProvider.getLogger(logRecord.logger).log(logRecord)
    }
}