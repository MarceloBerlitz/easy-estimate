import { Socket } from 'socket.io';

import { DisconnectedHandler } from '../../handlers/disconnected.handler';
import { LoggerService } from '../../services/logger.service';
import { EventHandler } from '../../interfaces/event-handler';
import { IO } from '../../app/io';

type Dependencies = {
  loggerService: LoggerService;
  io: IO;
  eventHandlers: EventHandler[];
  disconnectedHandler: DisconnectedHandler;
};

export class EventsListener {
  private logger: LoggerService;
  private io: IO;
  private eventHandlers: EventHandler[];
  private disconnectedHandler: DisconnectedHandler;

  public constructor({ loggerService, io, eventHandlers, disconnectedHandler }: Dependencies) {
    this.logger = loggerService;
    this.io = io;
    this.eventHandlers = eventHandlers;
    this.disconnectedHandler = disconnectedHandler;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      const clientId = socket.id;
      this.logger.clientEvent('connection', `clientId: ${clientId}`);
      this.logger.info('total clients', `${this.io.instance.sockets.sockets.size}`);

      this.eventHandlers.forEach((handler) => {
        socket.on(handler.event, (payload: unknown) => {
          this.logger.clientEvent(handler.event, `clientId: ${clientId}`);
          try {
            handler.handle(socket, clientId, payload);
          } catch (error) {
            this.logger.unexpectedError(error);
          }
        });
      });

      socket.on('disconnect', () => this.disconnectedHandler.handle(clientId));
    });
  }
}
