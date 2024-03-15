import winston, { Logger as WinstonLogger } from 'winston';
import LokiTransport from 'winston-loki';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

import { Logger } from '../../app/interfaces/logger';

export class LoggerService implements Logger {
  private logger: WinstonLogger;

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

  public info(message: string, name?: 'total rooms' | 'total clients'): void {
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
}
