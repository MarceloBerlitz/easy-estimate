import { ServerEventsEnum } from '@ee/lib';

export interface ClientEventManager {
  emit<T>(event: ServerEventsEnum, data: T): void;

  to(roomId: string): { emit: <T>(event: ServerEventsEnum, data?: T) => void };

  join(roomId: string): void;

  leave(roomId: string): void;
}
