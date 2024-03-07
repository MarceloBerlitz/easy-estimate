import { AwilixContainer, asValue } from 'awilix';
import { Socket } from 'socket.io';

import { UseCase } from '../../app/interfaces/use-case';
import { LoggerService } from '../../infra/logging/logger.service';
import { EventHandlers } from './event-handlers';
import { IO } from './io';

type Dependencies = {
  logger: LoggerService;
  io: IO;
  container: AwilixContainer;
};

export class EventsListener {
  private logger: LoggerService;
  private io: IO;
  private container: AwilixContainer;

  public constructor({ logger, io, container }: Dependencies) {
    this.logger = logger;
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

      socket.on('disconnect', () => {
        scope.dispose();
      });

      this.logger.clientEvent('connection', `clientId: ${socket.id}`);
      this.logger.info(`${this.io.instance.sockets.sockets.size}`, 'total clients');

      socket.onAny((event, payload) => {
        const handlerName = EventHandlers.getHandlerName(event);
        if (handlerName) {
          try {
            this.logger.clientEvent(event, `clientId: ${socket.id}`);

            const handler = scope.resolve<UseCase<unknown, unknown>>(handlerName);
            handler.execute(payload);
          } catch (error) {
            this.logger.unexpectedError(error);
          }
        }
      });
    });
  }
}
