import { Socket } from 'socket.io';

import { ClientEventsEnum } from '@ee/lib';

export interface EventHandler {
  event: ClientEventsEnum;
  handle(socket: Socket, clientId: string, payload: unknown): void;
}
