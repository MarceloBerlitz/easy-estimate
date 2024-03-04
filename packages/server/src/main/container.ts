import { createContainer, asClass, Resolver } from 'awilix';

import { Server } from '../infra/server';
import { EventsListener } from '../infra/socket/events-listener';
import { IO } from '../infra/io';
import { LoggerService } from '../app/services/logger.service';
import { CreateRoomHandler } from '../app/handlers/create-room.handler';
import { DeleteVotesHandler } from '../app/handlers/delete-votes.handler';
import { DisconnectedHandler } from '../app/handlers/disconnected.handler';
import { HideHandler } from '../app/handlers/hide.handler';
import { JoinRoomHandler } from '../app/handlers/join-room.handler';
import { LogoutHandler } from '../app/handlers/logout.handler';
import { RevealHandler } from '../app/handlers/reveal.handler';
import { VoteHandler } from '../app/handlers/vote.handler';
import { EventHandler } from '../app/interfaces/event-handler';
import { RoomService } from '../app/services/room.service';

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
