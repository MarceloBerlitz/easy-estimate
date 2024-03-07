import { Lifetime, asClass, asValue, createContainer } from 'awilix';

// application
import { RoomServiceImpl } from './app/services/room.service-impl';
import { IdServiceImpl } from './app/services/id.service-impl';

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
    })
    .loadModules(['app/useCases/*.ts'], {
      formatName: 'camelCase',
      cwd: __dirname,
      resolverOptions: {
        lifetime: Lifetime.SCOPED,
        register: asClass,
      },
    });
  return container;
};
