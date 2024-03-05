import { createContainer, asClass, asValue, Lifetime } from 'awilix';

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
    })
    .loadModules(['src/app/useCases/*.ts', Lifetime.SCOPED]);
  return container;
};
