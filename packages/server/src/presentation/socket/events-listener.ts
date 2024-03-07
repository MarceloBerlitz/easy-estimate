import { AwilixContainer, asValue } from 'awilix';
import { Socket } from 'socket.io';

import { ServerEventsEnum } from '@ee/lib';

import { UseCase } from '../../app/interfaces/use-case';
import { LoggerService } from '../../infra/logging/logger.service';
import { EventHandlers } from './event-handlers';
import { IO } from './io';
import { FlowError } from '../../app/errors/flow.error';

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
        const handlerName = EventHandlers.getHandlerName('disconnect');
        const handler = scope.resolve<UseCase<void, void>>(handlerName);
        handler.execute();
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
            this.handleError(scope, error);
          }
        }
      });
    });
  }

  private handleError(scope: AwilixContainer, error: Error): void {
    const eventManager = scope.resolve('eventManager');
    if (error instanceof FlowError) {
      eventManager.emit(ServerEventsEnum.ERROR, error.message);
      this.logger.serverEvent(ServerEventsEnum.ERROR, error.message);
    } else {
      eventManager.emit(ServerEventsEnum.ERROR, 'Unexpected error');
      this.logger.unexpectedError(error);
    }
  }
}
