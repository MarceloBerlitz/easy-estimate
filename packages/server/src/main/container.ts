import { createContainer, asClass, asValue } from 'awilix';

import { Server } from '../infra/server';
import { EventsListener } from '../infra/socket/events-listener';
import { IO } from '../infra/io';
import { LoggerService } from '../infra/logging/logger.service';
import { RoomServiceImpl } from '../app/services/room.service-impl';

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
    })
    .loadModules(['src/app/useCases/**/*.ts'], {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: 'SINGLETON',
        register: asClass,
      },
    });
  return container;
};
