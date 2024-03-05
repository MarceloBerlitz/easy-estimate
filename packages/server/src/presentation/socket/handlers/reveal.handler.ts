import { ClientEventsEnum, RevealPayload, ServerEventsEnum } from '@ee/lib';

import { EventHandler } from '../interfaces/event-handler';

import { RevealUseCase } from '../../../app/useCases/reveal.use-case';
import { IO } from '../io';
import { LoggerService } from '../../../infra/logging/logger.service';

type Dependencies = {
  io: IO;
  revealUseCase: RevealUseCase;
  loggerService: LoggerService;
};

export class RevealHandler implements EventHandler {
  private io: IO;
  private revealUseCase: RevealUseCase;
  private logger: LoggerService;

  public event: ClientEventsEnum = ClientEventsEnum.REVEAL;

  public constructor({ io, revealUseCase, loggerService }: Dependencies) {
    this.io = io;
    this.revealUseCase = revealUseCase;
    this.logger = loggerService;
  }

  public handle(payload: RevealPayload) {
    const { computedVotes } = this.revealUseCase.execute(payload);

    this.io.to(payload.roomId).emit(ServerEventsEnum.POINTS_REVEALED, {
      computedVotes,
    });

    this.logger.serverEvent(ServerEventsEnum.POINTS_REVEALED, `roomId: ${payload.roomId}`);
  }
}
