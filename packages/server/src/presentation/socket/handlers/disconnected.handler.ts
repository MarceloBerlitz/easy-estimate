import { ServerEventsEnum } from '@ee/lib';

import { DisconnectedUseCase } from '../../../app/useCases/disconnected.use-case';
import { LoggerService } from '../../../infra/logging/logger.service';
import { IO } from '../io';

type Dependencies = {
  loggerService: LoggerService;
  disconnectedUseCase: DisconnectedUseCase;
  clientId: string;
  io: IO;
};

export class DisconnectedHandler {
  private logger: LoggerService;
  private disconnectedUseCase: DisconnectedUseCase;
  private clientId: string;
  private io: IO;

  public constructor({ loggerService, disconnectedUseCase, clientId, io }: Dependencies) {
    this.logger = loggerService;
    this.disconnectedUseCase = disconnectedUseCase;
    this.clientId = clientId;
    this.io = io;
  }

  public handle(clientId: string): void {
    this.logger.clientEvent('disconnect', `clientId: ${clientId}`);
    this.logger.info(`${this.io.instance.sockets.sockets.size}`, 'total clients');

    try {
      const { roomDeleted, room } = this.disconnectedUseCase.execute();

      if (roomDeleted) {
        return;
      }

      this.io.to(room.id).emit(ServerEventsEnum.VOTER_DISCONNECTED, {
        voters: room.voters,
        computedVotes: room.computedVotes,
      });

      this.logger.serverEvent(ServerEventsEnum.VOTER_DISCONNECTED, `clientId: ${this.clientId}`);
    } catch (error) {
      this.logger.unexpectedError(error);
    }
  }
}
