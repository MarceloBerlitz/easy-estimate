import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

export interface Logger {
  clientEvent(event: ClientEventsEnum | 'connection' | 'disconnect', message: string): void;

  serverEvent(event: ServerEventsEnum, message: string): void;

  info(message: string, name?: 'total rooms' | 'total clients'): void;

  error(message: string, error: any): void;

  unexpectedError(error: any): void;
}
