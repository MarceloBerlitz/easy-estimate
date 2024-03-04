import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum, VotePayload, VoteType } from '@ee/lib';

import { EventHandler } from '../interfaces/event-handler';
import { IO } from '../../io';
import { LoggerService } from '../../logging/logger.service';
import { VoteUseCase } from '../../../app/useCases/vote.use-case';

type Dependencies = {
  io: IO;
  loggerService: LoggerService;
  voteUseCase: VoteUseCase;
};

export class VoteHandler implements EventHandler {
  private io: IO;
  private logger: LoggerService;
  private voteUseCase: VoteUseCase;

  public event: ClientEventsEnum = ClientEventsEnum.VOTE;

  public constructor({ io, loggerService, voteUseCase }: Dependencies) {
    this.io = io;
    this.logger = loggerService;
    this.voteUseCase = voteUseCase;
  }

  public handle(payload: VotePayload): void {
    const { roomId, voteMadePayload } = this.voteUseCase.execute(payload);

    this.io.to(roomId).emit(ServerEventsEnum.VOTE_MADE, voteMadePayload);

    this.logger.serverEvent(ServerEventsEnum.VOTE_MADE, `roomId: ${roomId}`);
  }
}
