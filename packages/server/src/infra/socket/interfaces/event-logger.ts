import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

export interface EventLogger {
  event(
    origin: 'server' | 'client',
    event: ClientEventsEnum | ServerEventsEnum,
    message: string
  ): void;
}
