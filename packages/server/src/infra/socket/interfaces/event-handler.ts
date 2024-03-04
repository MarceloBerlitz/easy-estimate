import { ClientEventsEnum } from '@ee/lib';

export interface EventHandler {
  event: ClientEventsEnum;
  handle(payload: unknown): void;
}
