import { ClientEventsEnum, LogoutPayload, ServerEventsEnum } from '@ee/lib';

import { EventHandler } from '../interfaces/event-handler';

import { LogoutUseCase } from '../../../app/useCases/logout.use-case';
import { IO } from '../../io';
import { LoggerService } from '../../logging/logger.service';

type Dependencies = {
  io: IO;
  logoutUseCase: LogoutUseCase;
  loggerService: LoggerService;
};

export class LogoutHandler implements EventHandler {
  private logger: LoggerService;
  private logoutUseCase: LogoutUseCase;
  private io: IO;
  public event: ClientEventsEnum = ClientEventsEnum.LOGOUT;

  public constructor({ io, logoutUseCase, loggerService }: Dependencies) {
    this.io = io;
    this.logoutUseCase = logoutUseCase;
    this.logger = loggerService;
  }

  handle(payload: LogoutPayload): void {
    const { roomDeleted, room, logoutVoter } = this.logoutUseCase.execute(payload);
    if (roomDeleted) {
      return;
    }

    this.io.to(payload.roomId).emit(ServerEventsEnum.LOGGED_OUT, {
      logoutVoter,
      voters: room.voters,
      computedVotes: room.computedVotes,
    });

    this.logger.serverEvent(ServerEventsEnum.LOGGED_OUT, `roomId: ${room.id}`);
  }
}
