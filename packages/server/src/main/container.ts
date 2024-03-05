import { createContainer, asClass, asValue, Lifetime, Resolver } from 'awilix';

// application
import { RoomServiceImpl } from '../app/services/room.service-impl';
// use cases
import { CreateRoomUseCase } from '../app/useCases/create-room.use-case';
import { JoinRoomUseCase } from '../app/useCases/join-room.use-case';
import { DeleteVotesUseCase } from '../app/useCases/delete-votes.use-case';
import { HideUseCase } from '../app/useCases/hide.use-case';
import { LogoutUseCase } from '../app/useCases/logout.use-case';
import { RevealUseCase } from '../app/useCases/reveal.use-case';
import { VoteUseCase } from '../app/useCases/vote.use-case';
import { DisconnectedUseCase } from '../app/useCases/disconnected.use-case';

// infra
import { Server } from '../infra/server';
import { LoggerService } from '../infra/logging/logger.service';

// presentation
import { IO } from '../presentation/socket/io';
import { EventsListener } from '../presentation/socket/events-listener';

// event handlers
import { CreateRoomHandler } from '../presentation/socket/handlers/create-room.handler';
import { DeleteVotesHandler } from '../presentation/socket/handlers/delete-votes.handler';
import { DisconnectedHandler } from '../presentation/socket/handlers/disconnected.handler';
import { HideHandler } from '../presentation/socket/handlers/hide.handler';
import { JoinRoomHandler } from '../presentation/socket/handlers/join-room.handler';
import { LogoutHandler } from '../presentation/socket/handlers/logout.handler';
import { RevealHandler } from '../presentation/socket/handlers/reveal.handler';
import { VoteHandler } from '../presentation/socket/handlers/vote.handler';
import { EventHandler } from '../presentation/socket/interfaces/event-handler';

function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
  return {
    resolve: (c) => resolvers.map((r) => r.resolve(c)),
  };
}

export const configureContainer = () => {
  const container = createContainer();
  container
    .register({
      loggerService: asClass(LoggerService).singleton(),
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
