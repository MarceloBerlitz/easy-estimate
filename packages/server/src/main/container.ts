import { createContainer, asClass, Resolver, asValue } from 'awilix';

import { Server } from '../infra/server';
import { EventsListener } from '../infra/socket/events-listener';
import { IO } from '../infra/io';
import { LoggerService } from '../infra/logging/logger.service';
import { DisconnectedHandler } from '../app/handlers/disconnected.handler';
import { RoomService } from '../app/services/room.service';

export const configureContainer = () => {
  const container = createContainer();
  container.register({
    loggerService: asClass(LoggerService),
    roomService: asClass(RoomService).singleton(),
    server: asClass(Server).singleton(),
    io: asClass(IO).singleton(),
    disconnectedHandler: asClass(DisconnectedHandler),
    eventsListener: asClass(EventsListener).singleton(),
    container: asValue(container),
  });
  return container;
};
