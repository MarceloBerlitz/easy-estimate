import { createContainer, asClass, asValue, Resolver } from 'awilix';

import { LoggerService } from './services/logger.service';
import { RoomService } from './services/room.service';
import { Server } from './app/server';
import { EventsListener } from './presentation/socket/events-listener';
import { DisconnectedHandler } from './handlers/disconnected.handler';
import { CreateRoomHandler } from './handlers/create-room.handler';
import { DeleteVotesHandler } from './handlers/delete-votes.handler';
import { IO } from './app/io';
import { HideHandler } from './handlers/hide.handler';
import { JoinRoomHandler } from './handlers/join-room.handler';
import { LogoutHandler } from './handlers/logout.handler';
import { RevealHandler } from './handlers/reveal.handler';
import { VoteHandler } from './handlers/vote.handler';
import { EventHandler } from './interfaces/event-handler';

function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
  return {
    resolve: (c) => resolvers.map((r) => r.resolve(c)),
  };
}

export const configureContainer = () => {
  return createContainer().register({
    loggerService: asClass(LoggerService),
    roomService: asClass(RoomService).singleton(),
    server: asClass(Server).singleton(),
    io: asClass(IO).singleton(),
    disconnectedHandler: asClass(DisconnectedHandler),
    eventHandlers: asArray<EventHandler>([
      asClass(CreateRoomHandler),
      asClass(DeleteVotesHandler),
      asClass(HideHandler),
      asClass(JoinRoomHandler),
      asClass(LogoutHandler),
      asClass(RevealHandler),
      asClass(VoteHandler),
    ]),
    eventsListener: asClass(EventsListener).singleton(),
  });
};
