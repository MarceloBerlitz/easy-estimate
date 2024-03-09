import { Socket } from 'socket.io';

import { ServerEventsEnum } from '@ee/lib';

import { ClientEventManager } from '../../app/interfaces/client-event-manager';
import { Logger } from '../../app/interfaces/logger';
import { IO } from './io';

export class ClientEventManagerImpl implements ClientEventManager {
  private socket: Socket;
  private io: IO;
  private logger: Logger;

  public constructor({ socket, io, logger }: { socket: Socket; io: IO; logger: Logger }) {
    this.socket = socket;
    this.io = io;
    this.logger = logger;
  }

  emit<T>(event: ServerEventsEnum, data: T): void {
    this.socket.emit(event, data);
    this.logger.serverEvent(event, `clientId: ${this.socket.id}`);
  }
  to(roomId: string): { emit: <T>(event: ServerEventsEnum, data: T) => void } {
    return {
      emit: (event, data) => {
        this.io.instance.to(roomId).emit(event, data);
        this.logger.serverEvent(event, `clientId: ${this.socket.id}`);
      },
    };
  }
  join(roomId: string): void {
    this.socket.join(roomId);
  }
  leave(roomId: string): void {
    this.socket.leave(roomId);
  }
}
