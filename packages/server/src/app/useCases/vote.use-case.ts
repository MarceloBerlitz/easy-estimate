import { VoteMadePayload, VotePayload, VoteType } from '@ee/lib';

import { UseCase } from '../interfaces/use-case';
import { RoomService } from '../services/room.service';

type VoteUseCaseResult = {
  voteMadePayload: VoteMadePayload;
  roomId: string;
};

export class VoteUseCase implements UseCase<VotePayload, VoteUseCaseResult> {
  private service: RoomService;

  public constructor({ roomService }: { roomService: RoomService }) {
    this.service = roomService;
  }

  public execute(payload: VotePayload): VoteUseCaseResult {
    const room = this.service.getRoom(payload.roomId);

    const voter = this.service.getVoter(room, payload.voterId);

    if (!voter) {
      throw new Error('voter not found');
    }

    // if (!voter.clientId) {
    //   voter.clientId = this.clientId;
    //   socket.join(room.id);
    // }
    // TO DO: centralize it if necessary

    const currentVoteIndex = room.votes.findIndex(
      (vote: VoteType) => vote.voter.id === payload.voterId
    );

    if (currentVoteIndex >= 0) {
      room.votes.splice(currentVoteIndex, 1);
    }

    room.votes.push({ ...payload.vote, voter });

    voter.hasVoted = true;

    this.service.updateComputedVotes(room);

    return {
      voteMadePayload: {
        voters: room.voters,
        ...(room.computedVotes ? { computedVotes: room.computedVotes } : {}),
      },
      roomId: room.id,
    };
  }
}
