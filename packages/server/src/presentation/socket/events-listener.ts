import { AwilixContainer, asValue } from 'awilix';
import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

import { FlowError } from '../../app/errors/flow.error';
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
      this.logger.clientEvent('connection', `clientId: ${socket.id}`);
      this.logger.info(`${this.io.instance.sockets.sockets.size}`, 'total clients');

      const scope = this.createScope(socket);

      socket.on('disconnect', () => {
        this.logger.clientEvent('disconnect', `clientId: ${socket.id}`);
        const handler = this.resolveHandler(scope, 'disconnect');
        handler.execute();
        scope.dispose();
      });

      socket.onAny((event, payload) => {
        try {
          const handler = this.resolveHandler(scope, event);
          this.logger.clientEvent(event, `clientId: ${socket.id}`);
          handler.execute(payload);
        } catch (error) {
          this.handleError(scope, error);
        }
      });
    });
  }

  private createScope(socket: Socket): AwilixContainer {
    const scope = this.container.createScope();
    scope.register({
      clientId: asValue(socket.id),
      socket: asValue(socket),
    });
    return scope;
  }

  private resolveHandler(
    scope: AwilixContainer,
    event: ClientEventsEnum | 'disconnect'
  ): UseCase<unknown, unknown> {
    const handlerName = EventHandlers.getHandlerName(event);
    if (!handlerName) {
      throw new Error('Invalid event');
    }
    return scope.resolve<UseCase<unknown, unknown>>(handlerName);
  }

  private handleError(scope: AwilixContainer, error: Error): void {
    const eventManager = scope.resolve('eventManager');
    if (error instanceof FlowError) {
      eventManager.emit(ServerEventsEnum.ERROR, error.message);
      this.logger.serverEvent(ServerEventsEnum.ERROR, error.message);
      return;
    }
    eventManager.emit(ServerEventsEnum.ERROR, 'Unexpected error');
    this.logger.unexpectedError(error);
  }
}
