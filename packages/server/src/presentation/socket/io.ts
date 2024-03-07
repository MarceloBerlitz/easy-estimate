import { BroadcastOperator, Server as SocketServer } from 'socket.io';
import {
  DecorateAcknowledgementsWithMultipleResponses,
  DefaultEventsMap,
} from 'socket.io/dist/typed-events';

import { EnvironmentHelper } from '../../app/helpers/environment.helper';
import { Server } from '../../infra/server';

export class IO {
  private server: Server;
  private io: SocketServer;

  public constructor({ server }: { server: Server }) {
    this.server = server;
    this.io = new SocketServer(this.server.instance, {
      cors: { origin: EnvironmentHelper.isLocal() ? '*' : null },
    });
  }

  public on(event: string, listener: (...args: any[]) => void): void {
    this.io.on(event, listener);
  }

  public to(
    room: string
  ): BroadcastOperator<DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>, any> {
    return this.io.to(room);
  }

  public get instance(): SocketServer {
    return this.io;
  }
}
