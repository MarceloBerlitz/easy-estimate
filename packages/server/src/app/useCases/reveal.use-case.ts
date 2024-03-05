import { ComputedVotesMapper, PointsRevealedPayload, RevealPayload, RoomType } from '@ee/lib';

import { UseCase } from '../interfaces/use-case';
import { RoomService } from '../services/room.service';

export class RevealUseCase implements UseCase<RevealPayload, PointsRevealedPayload> {
  private service: RoomService;

  public constructor({ roomService }: { roomService: RoomService }) {
    this.service = roomService;
  }

  public execute(payload: RevealPayload): PointsRevealedPayload {
    const room: RoomType = this.service.getRoom(payload.roomId);

    if (!room) {
      throw new Error('room not found');
    }

    const voter = room.voters.find((voter) => voter.id === payload.voterId);

    if (!voter) {
      throw new Error('voter not found');
    }

    // if (!voter.clientId) {
    //   voter.clientId = clientId;
    //   socket.join(room.id);
    // }

    if (!room.computedVotes) {
      room.computedVotes = ComputedVotesMapper.mapFromVotes(room.votes);
    }

    return { computedVotes: room.computedVotes };
  }
}
