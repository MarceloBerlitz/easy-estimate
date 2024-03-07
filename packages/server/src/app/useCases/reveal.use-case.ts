import { ComputedVotesMapper, RevealPayload, RoomType, ServerEventsEnum } from '@ee/lib';

import { ClientEventManager } from '../interfaces/client-event-manager';
import { RoomService } from '../interfaces/room.service';
import { UseCase } from '../interfaces/use-case';

export default class RevealUseCase implements UseCase<RevealPayload, void> {
  private service: RoomService;
  private clientId: string;
  private eventManager: ClientEventManager;

  public constructor({
    roomService,
    clientId,
    eventManager,
  }: {
    roomService: RoomService;
    clientId: string;
    eventManager: ClientEventManager;
  }) {
    this.service = roomService;
    this.clientId = clientId;
    this.eventManager = eventManager;
  }

  public execute(payload: RevealPayload): void {
    const room: RoomType = this.service.getRoom(payload.roomId);

    if (!room) {
      throw new Error('room not found');
    }

    const voter = room.voters.find((voter) => voter.id === payload.voterId);

    if (!voter) {
      throw new Error('voter not found');
    }

    if (!voter.clientId) {
      voter.clientId = this.clientId;
      this.eventManager.join(room.id);
    }

    if (!room.computedVotes) {
      room.computedVotes = ComputedVotesMapper.mapFromVotes(room.votes);
    }

    this.eventManager.to(payload.roomId).emit(ServerEventsEnum.POINTS_REVEALED, {
      computedVotes: room.computedVotes,
    });
  }
}
