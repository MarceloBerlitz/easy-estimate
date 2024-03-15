import { Lifetime, asClass, asValue, createContainer } from 'awilix';

// application
import { IdServiceImpl } from './app/services/id.service-impl';
import { RoomServiceImpl } from './app/services/room.service-impl';

// infra
import { LoggerService } from './infra/logging/logger.service';
import { Server } from './infra/server';

// presentation
import { ClientEventManagerImpl } from './presentation/socket/client-event-manager-impl';
import { EventsListener } from './presentation/socket/events-listener';
import { IO } from './presentation/socket/io';

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
      eventManager: asClass(ClientEventManagerImpl).scoped(),
    })
    .loadModules(['app/useCases/*.use-case.*'], {
      formatName: 'camelCase',
      cwd: __dirname,
      resolverOptions: {
        lifetime: Lifetime.SCOPED,
        register: asClass,
      },
    });
  return container;
};
