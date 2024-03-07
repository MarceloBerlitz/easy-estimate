import { DeleteVotesPayload, ServerEventsEnum, VoterType } from '@ee/lib';

import { UseCase } from '../interfaces/use-case';
import { RoomService } from '../interfaces/room.service';
import { NotFoundError } from '../errors/not-found.error';
import { RoomEventManager } from '../interfaces/room-event-manager';
export default class DeleteVotesUseCase implements UseCase<DeleteVotesPayload, void> {
  private service: RoomService;
  private eventManager: RoomEventManager;
  private clientId: string;

  public constructor({
    roomService,
    eventManager,
    clientId,
  }: {
    roomService: RoomService;
    eventManager: RoomEventManager;
    clientId: string;
  }) {
    this.service = roomService;
    this.eventManager = eventManager;
    this.clientId = clientId;
  }

  public execute(payload: DeleteVotesPayload): void {
    const room = this.service.getRoom(payload.roomId);
    if (!room) {
      throw new NotFoundError('room not found');
    }

    const voter = this.service.getVoter(room, payload.voterId);
    if (!voter) {
      throw new NotFoundError('voter not found');
    }

    if (!voter.clientId) {
      voter.clientId = this.clientId;
      this.eventManager.join(room.id);
    }

    room.votes = [];
    room.voters.forEach((voter: VoterType) => {
      voter.hasVoted = false;
    });

    delete room.computedVotes;

    this.eventManager.to(room.id).emit(ServerEventsEnum.VOTES_DELETED);
  }
}
