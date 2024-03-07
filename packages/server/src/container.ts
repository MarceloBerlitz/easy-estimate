import { Lifetime, asClass, asValue, createContainer } from 'awilix';

// application
import { RoomServiceImpl } from './app/services/room.service-impl';
import { IdServiceImpl } from './app/services/id.service-impl';
// use cases
import CreateRoomUseCase from './app/useCases/create-room.use-case';
import DeleteVotesUseCase from './app/useCases/delete-votes.use-case';
import DisconnectedUseCase from './app/useCases/disconnected.use-case';
import HideUseCase from './app/useCases/hide.use-case';
import JoinRoomUseCase from './app/useCases/join-room.use-case';
import LogoutUseCase from './app/useCases/logout.use-case';
import RevealUseCase from './app/useCases/reveal.use-case';
import VoteUseCase from './app/useCases/vote.use-case';

// infra
import { LoggerService } from './infra/logging/logger.service';
import { Server } from './infra/server';

// presentation
import { EventsListener } from './presentation/socket/events-listener';
import { IO } from './presentation/socket/io';
import { RoomEventManagerImpl } from './presentation/socket/room-event-manager-impl';

export const configureContainer = () => {
  const container = createContainer();
  container
    .register({
      container: asValue(container),
      logger: asClass(LoggerService).singleton(),
      roomService: asClass(RoomServiceImpl).singleton(),
      server: asClass(Server).singleton(),
      io: asClass(IO).singleton(),
      eventsListener: asClass(EventsListener).singleton(),
      idService: asClass(IdServiceImpl).singleton(),
      eventManager: asClass(RoomEventManagerImpl).scoped(),
      createRoomUseCase: asClass(CreateRoomUseCase).scoped(),
      joinRoomUseCase: asClass(JoinRoomUseCase).scoped(),
      voteUseCase: asClass(VoteUseCase).scoped(),
      revealUseCase: asClass(RevealUseCase).scoped(),
      hideUseCase: asClass(HideUseCase).scoped(),
      deleteVotesUseCase: asClass(DeleteVotesUseCase).scoped(),
      logoutUseCase: asClass(LogoutUseCase).scoped(),
      disconnectedUseCase: asClass(DisconnectedUseCase).scoped(),
    })
    .loadModules(['app/useCases/**/*.ts'], {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Lifetime.SCOPED,
        register: asClass,
      },
    });
  return container;
};
