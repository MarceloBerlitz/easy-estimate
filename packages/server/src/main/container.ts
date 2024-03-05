import { createContainer, asClass, asValue, Lifetime, Resolver } from 'awilix';

import { Server } from '../infra/server';
import { EventsListener } from '../infra/socket/events-listener';
import { IO } from '../infra/io';
import { LoggerService } from '../infra/logging/logger.service';
import { RoomServiceImpl } from '../app/services/room.service-impl';
import { CreateRoomUseCase } from '../app/useCases/create-room.use-case';
import { JoinRoomUseCase } from '../app/useCases/join-room.use-case';
import { DeleteVotesUseCase } from '../app/useCases/delete-votes.use-case';
import { HideUseCase } from '../app/useCases/hide.use-case';
import { LogoutUseCase } from '../app/useCases/logout.use-case';
import { RevealUseCase } from '../app/useCases/reveal.use-case';
import { VoteUseCase } from '../app/useCases/vote.use-case';
import { CreateRoomHandler } from '../infra/socket/handlers/create-room.handler';
import { DeleteVotesHandler } from '../infra/socket/handlers/delete-votes.handler';
import { DisconnectedHandler } from '../infra/socket/handlers/disconnected.handler';
import { HideHandler } from '../infra/socket/handlers/hide.handler';
import { JoinRoomHandler } from '../infra/socket/handlers/join-room.handler';
import { LogoutHandler } from '../infra/socket/handlers/logout.handler';
import { RevealHandler } from '../infra/socket/handlers/reveal.handler';
import { VoteHandler } from '../infra/socket/handlers/vote.handler';
import { EventHandler } from '../infra/socket/interfaces/event-handler';
import { DisconnectedUseCase } from '../app/useCases/disconnected.use-case';

function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
  return {
    resolve: (c) => resolvers.map((r) => r.resolve(c)),
  };
}

export const configureContainer = () => {
  const container = createContainer();
  container
    .register({
      loggerService: asClass(LoggerService),
      roomService: asClass(RoomServiceImpl).singleton(),
      server: asClass(Server).singleton(),
      io: asClass(IO).singleton(),
      eventsListener: asClass(EventsListener).singleton(),
      container: asValue(container),
      createRoomUseCase: asClass(CreateRoomUseCase).scoped(),
      joinRoomUseCase: asClass(JoinRoomUseCase).scoped(),
      voteUseCase: asClass(VoteUseCase).scoped(),
      revealUseCase: asClass(RevealUseCase).scoped(),
      hideUseCase: asClass(HideUseCase).scoped(),
      deleteVotesUseCase: asClass(DeleteVotesUseCase).scoped(),
      logoutUseCase: asClass(LogoutUseCase).scoped(),
      disconnectedUseCase: asClass(DisconnectedUseCase).scoped(),
      eventHandlers: asArray<EventHandler>([
        asClass(CreateRoomHandler).scoped(),
        asClass(JoinRoomHandler).scoped(),
        asClass(DeleteVotesHandler).scoped(),
        asClass(HideHandler).scoped(),
        asClass(LogoutHandler).scoped(),
        asClass(RevealHandler).scoped(),
        asClass(VoteHandler).scoped(),
      ]),
      disconnectedHandler: asClass(DisconnectedHandler).scoped(),
    })
    .loadModules(['src/app/useCases/*.ts', Lifetime.SCOPED]);
  return container;
};
