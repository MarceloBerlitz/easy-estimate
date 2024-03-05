import { ClientEventsEnum, DeleteVotesPayload, ServerEventsEnum } from '@ee/lib';

import { DeleteVotesUseCase } from '../../../app/useCases/delete-votes.use-case';
import { IO } from '../io';
import { LoggerService } from '../../../infra/logging/logger.service';
import { EventHandler } from '../interfaces/event-handler';

type Dependencies = {
  loggerService: LoggerService;
  deleteVotesUseCase: DeleteVotesUseCase;
  io: IO;
};

export class DeleteVotesHandler implements EventHandler {
  private logger: LoggerService;
  private deleteVotesUseCase: DeleteVotesUseCase;
  private io: IO;

  public event: ClientEventsEnum = ClientEventsEnum.DELETE_VOTES;

  public constructor({ loggerService, deleteVotesUseCase, io }: Dependencies) {
    this.logger = loggerService;
    this.deleteVotesUseCase = deleteVotesUseCase;
    this.io = io;
  }

  public handle(payload: DeleteVotesPayload): void {
    this.deleteVotesUseCase.execute(payload);

    this.io.to(payload.roomId).emit(ServerEventsEnum.VOTES_DELETED);

    this.logger.serverEvent(ServerEventsEnum.VOTES_DELETED, `roomId: ${payload.roomId}`);
  }
}
