import { AwilixContainer } from 'awilix';

import { configureContainer } from '../container';
import { Server } from './server';
import { EventsListener } from '../presentation/socket/events-listener';

export class Application {
  private container: AwilixContainer<{
    server: Server;
    eventsListener: EventsListener;
  }>;

  public start(): void {
    this.container = configureContainer();
    const { server, eventsListener } = this.container.cradle;
    eventsListener.listen();
    server.start();
  }
}
