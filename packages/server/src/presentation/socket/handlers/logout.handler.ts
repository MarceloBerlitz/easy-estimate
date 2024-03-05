import { Socket } from 'socket.io';

import { ClientEventsEnum, LogoutPayload, ServerEventsEnum } from '@ee/lib';

import { EventHandler } from '../interfaces/event-handler';

import { LogoutUseCase } from '../../../app/useCases/logout.use-case';
import { IO } from '../io';
import { LoggerService } from '../../../infra/logging/logger.service';

type Dependencies = {
  io: IO;
  logoutUseCase: LogoutUseCase;
  loggerService: LoggerService;
  socket: Socket;
};

export class LogoutHandler implements EventHandler {
  private logger: LoggerService;
  private logoutUseCase: LogoutUseCase;
  private io: IO;
  private socket: Socket;

  public event: ClientEventsEnum = ClientEventsEnum.LOGOUT;

  public constructor({ io, logoutUseCase, loggerService, socket }: Dependencies) {
    this.io = io;
    this.logoutUseCase = logoutUseCase;
    this.logger = loggerService;
    this.socket = socket;
  }

  handle(payload: LogoutPayload): void {
    const { roomDeleted, room, logoutVoter } = this.logoutUseCase.execute(payload);

    this.socket.leave(payload.roomId);

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
