import { AwilixContainer, Resolver, asValue } from 'awilix';
import { Socket } from 'socket.io';

import { IO } from './io';
import { LoggerService } from '../../infra/logging/logger.service';
import { EventHandler } from './interfaces/event-handler';

type Dependencies = {
  loggerService: LoggerService;
  io: IO;
  eventHandlers: EventHandler[];
  container: AwilixContainer;
};

export class EventsListener {
  private logger: LoggerService;
  private io: IO;
  private container: AwilixContainer;

  public constructor({ loggerService, io, container }: Dependencies) {
    this.logger = loggerService;
    this.io = io;
    this.container = container;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      const scope = this.container.createScope();

      scope.register({
        clientId: asValue(socket.id),
        socket: asValue(socket),
      });

      this.logger.clientEvent('connection', `clientId: ${socket.id}`);
      this.logger.info(`${this.io.instance.sockets.sockets.size}`, 'total clients');

      const { eventHandlers } = scope.cradle as { eventHandlers: EventHandler[] };

      eventHandlers.forEach((handler) => {
        socket.on(handler.event, (payload) => {
          this.logger.clientEvent(handler.event, `clientId: ${socket.id}`);
          try {
            handler.handle(payload);
          } catch (error) {
            this.logger.unexpectedError(error);
          }
        });
      });

      socket.on('disconnect', () => scope.cradle.disconnectedHandler.handle(socket.id));
    });
  }
}
