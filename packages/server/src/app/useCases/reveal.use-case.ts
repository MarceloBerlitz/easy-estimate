import {
  ComputedVotesMapper,
  PointsRevealedPayload,
  RevealPayload,
  RoomType,
  ServerEventsEnum,
} from '@ee/lib';

import { UseCase } from '../interfaces/use-case';
import { RoomService } from '../interfaces/room.service';
import { RoomEventManager } from '../interfaces/room-event-manager';

export default class RevealUseCase implements UseCase<RevealPayload, void> {
  private service: RoomService;
  private clientId: string;
  private eventManager: RoomEventManager;

  public constructor({
    roomService,
    clientId,
    eventManager,
  }: {
    roomService: RoomService;
    clientId: string;
    eventManager: RoomEventManager;
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
