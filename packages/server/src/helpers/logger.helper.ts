import winston, { Logger } from 'winston';
import LokiTransport from 'winston-loki';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

export class LoggerHelper {
  private static logger: Logger;

  public static createLogger(): void {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL ?? 'info',
      exitOnError: true,
      transports: [],
    });

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
      return;
    }

    this.logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }

  public static clientEvent(
    event: ClientEventsEnum | 'connection' | 'disconnect',
    message: string
  ): void {
    this.logger.info({
      message,
      labels: {
        event,
        type: 'event',
        origin: 'client',
      },
    });
  }

  public static serverEvent(event: ServerEventsEnum, message: string): void {
    this.logger.info({
      message,
      labels: {
        event,
        type: 'event',
        origin: 'server',
      },
    });
  }

  public static info(name: 'total rooms' | 'total clients', message: string | number): void {
    this.logger.info({
      message,
      labels: {
        name,
        type: 'info',
      },
    });
  }

  public static getLogger(): Logger {
    return this.logger;
  }
}
