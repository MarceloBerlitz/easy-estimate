import winston, { Logger } from 'winston';
import LokiTransport from 'winston-loki';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

export class LoggerService {
  private logger: Logger;

  public constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL ?? 'debug',
      exitOnError: true,
      transports: [],
    });

    this.logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );

    if (process.env.NODE_ENV === 'production') {
      this.logger.add(
        new LokiTransport({
          host: process.env.LOG_HOST,
          basicAuth: `${process.env.LOG_USER}:${process.env.LOG_PWD}`,
          json: true,
          format: winston.format.json(),
          replaceTimestamp: true,
          labels: {
            app: '@ee/server',
            environment: process.env.NODE_ENV,
          },
          onConnectionError: (err) => console.error(err),
        })
      );
    }
  }

  public clientEvent(event: ClientEventsEnum | 'connection' | 'disconnect', message: string): void {
    this.logger.debug({
      message,
      labels: {
        event,
        type: 'event',
        origin: 'client',
      },
    });
  }

  public serverEvent(event: ServerEventsEnum, message: string): void {
    this.logger.debug({
      message,
      labels: {
        event,
        type: 'event',
        origin: 'server',
      },
    });
  }

  public info(name: 'total rooms' | 'total clients', message: string): void {
    this.logger.info({
      message,
      labels: {
        name,
        type: 'info',
      },
    });
  }

  public error(message: string, error: any): void {
    this.logger.error({ message, error });
  }

  public unexpectedError(error: any): void {
    this.logger.error({ message: 'Unexpected Error', error });
  }

  public getLogger(): Logger {
    return this.logger;
  }
}
