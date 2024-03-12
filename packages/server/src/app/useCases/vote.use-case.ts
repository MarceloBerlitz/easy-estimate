import { ServerEventsEnum, VotePayload, VoteType } from '@ee/lib';

import { ClientEventManager } from '../interfaces/client-event-manager';
import { RoomService } from '../interfaces/room.service';
import { UseCase } from '../interfaces/use-case';

export default class VoteUseCase implements UseCase<VotePayload, void> {
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

  public execute(payload: VotePayload): void {
    const room = this.service.getRoom(payload.roomId);

    const voter = this.service.getVoter(room, payload.voterId);

    if (!voter) {
      throw new Error('voter not found');
    }

    if (!voter.clientId) {
      voter.clientId = this.clientId;
      this.eventManager.join(room.id);
    }

    const currentVoteIndex = room.votes.findIndex(
      (vote: VoteType) => vote.voter.id === payload.voterId
    );

    if (currentVoteIndex >= 0) {
      room.votes.splice(currentVoteIndex, 1);
    }

    if (payload.vote) {
      room.votes.push({ ...payload.vote, voter });
    }

    voter.hasVoted = payload.vote ? true : false;

    this.service.updateComputedVotes(room);

    this.eventManager.to(room.id).emit(ServerEventsEnum.VOTE_MADE, {
      voters: room.voters,
      ...(room.computedVotes ? { computedVotes: room.computedVotes } : {}),
    });
  }
}
