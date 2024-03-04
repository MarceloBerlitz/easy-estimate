import { ClientEventsEnum, HidePayload, ServerEventsEnum } from '@ee/lib';

import { EventHandler } from '../interfaces/event-handler';
import { HideUseCase } from '../../../app/useCases/hide.use-case';
import { LoggerService } from '../../logging/logger.service';
import { IO } from '../../io';

type Dependencies = {
  io: IO;
  hideUseCase: HideUseCase;
  loggerService: LoggerService;
};

export class HideHandler implements EventHandler {
  private io: IO;
  private hideUseCase: HideUseCase;
  private logger: LoggerService;

  public event: ClientEventsEnum = ClientEventsEnum.HIDE;

  public constructor({ io, hideUseCase, loggerService }: Dependencies) {
    this.io = io;
    this.hideUseCase = hideUseCase;
    this.logger = loggerService;
  }

  handle(payload: HidePayload): void {
    this.hideUseCase.execute(payload);

    this.io.to(payload.roomId).emit(ServerEventsEnum.POINTS_HIDDEN);

    this.logger.serverEvent(ServerEventsEnum.POINTS_HIDDEN, `roomId: ${payload.roomId}`);
  }
}
