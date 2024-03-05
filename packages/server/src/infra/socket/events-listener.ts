import { Socket } from 'socket.io';
import { AwilixContainer, Resolver, asClass, asValue } from 'awilix';

import { IO } from '../io';
import { EventHandler } from './interfaces/event-handler';
import { LoggerService } from '../logging/logger.service';
import { CreateRoomHandler } from './handlers/create-room.handler';
import { JoinRoomHandler } from './handlers/join-room.handler';
import { DeleteVotesHandler } from './handlers/delete-votes.handler';
import { HideHandler } from './handlers/hide.handler';
import { LogoutHandler } from './handlers/logout.handler';
import { RevealHandler } from './handlers/reveal.handler';
import { VoteHandler } from './handlers/vote.handler';
import { DisconnectedHandler } from './handlers/disconnected.handler';

function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
  return {
    resolve: (c) => resolvers.map((r) => r.resolve(c)),
  };
}

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
        eventHandlers: asArray<EventHandler>([
          asClass(CreateRoomHandler),
          asClass(JoinRoomHandler),
          asClass(DeleteVotesHandler),
          asClass(HideHandler),
          asClass(LogoutHandler),
          asClass(RevealHandler),
          asClass(VoteHandler),
        ]),
        disconnectedHandler: asClass(DisconnectedHandler),
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

      socket.on('disconnect', () => scope.cradle.disconnectedHandler.handle(socket.id));
    });
  }
}
