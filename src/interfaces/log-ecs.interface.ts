import { LogLevel } from '../constants';

// TODO: add flat field

export interface EcsLog {
  '@timestamp': Date;

  log: {
    level: LogLevel;
    logger: string;
  };

  message?: string;

  user_agent?: {
    original: string;
  };

  event?: {
    duration: number;
  };

  trace?: {
    id: string;
  };

  url?: {
    original: string;
    domain: string;
  };

  http?: {
    'request.referrer'?: string;
    'request.method'?: string;
    'response.status_code'?: number;
  };

  source?: {
    ip: string;
  };
}
