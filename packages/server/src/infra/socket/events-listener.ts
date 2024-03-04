import { Socket } from 'socket.io';

import { IO } from '../io';
import { DisconnectedHandler } from '../../app/handlers/disconnected.handler';
import { EventHandler } from './interfaces/event-handler';
import { LoggerService } from '../logging/logger.service';
import { AwilixContainer, Resolver, asClass, asValue } from 'awilix';
import { CreateRoomHandler } from './handlers/create-room.handler';
import { JoinRoomHandler } from './handlers/join-room.handler';

type Dependencies = {
  loggerService: LoggerService;
  io: IO;
  eventHandlers: EventHandler[];
  disconnectedHandler: DisconnectedHandler;
  container: AwilixContainer;
};

export class EventsListener {
  private logger: LoggerService;
  private io: IO;
  private disconnectedHandler: DisconnectedHandler;
  private container: AwilixContainer;

  public constructor({ loggerService, io, disconnectedHandler, container }: Dependencies) {
    this.logger = loggerService;
    this.io = io;
    this.disconnectedHandler = disconnectedHandler;
    this.container = container;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      const scope = this.container.createScope();
      scope.register({
        clientId: asValue(socket.id),
      });

      function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
        return {
          resolve: (c) => resolvers.map((r) => r.resolve(c)),
        };
      }

      scope.register({
        eventHandlers: asArray<EventHandler>([
          asClass(CreateRoomHandler),
          asClass(JoinRoomHandler),
          // asClass(DeleteVotesHandler),
          // asClass(HideHandler),
          // asClass(LogoutHandler),
          // asClass(RevealHandler),
          // asClass(VoteHandler),
        ]),
      });

      this.logger.clientEvent('connection', `clientId: ${socket.id}`);
      this.logger.info('total clients', `${this.io.instance.sockets.sockets.size}`);

      const { eventHandlers } = scope.cradle as { eventHandlers: EventHandler[] };

      eventHandlers.forEach((handler) => {
        socket.on(handler.event, (payload: unknown) => {
          this.logger.clientEvent(handler.event, `clientId: ${socket.id}`);
          try {
            handler.handle(payload);
          } catch (error) {
            this.logger.unexpectedError(error);
          }
        });
      });

      socket.on('disconnect', () => this.disconnectedHandler.handle(socket.id));
    });
  }
}
