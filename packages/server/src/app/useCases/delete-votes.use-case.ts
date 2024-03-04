import { DeleteVotesPayload, VoterType } from '@ee/lib';

import { UseCase } from '../interfaces/use-case';
import { RoomService } from '../services/room.service';

export class DeleteVotesUseCase implements UseCase<DeleteVotesPayload, void> {
  private service: RoomService;

  public constructor({ roomService }: { roomService: RoomService }) {
    this.service = roomService;
  }

  public execute(payload: DeleteVotesPayload): void {
    const room = this.service.getRoom(payload.roomId);
    if (!room) {
      throw new Error('room not found');
    }

    const voter = this.service.getVoter(room, payload.voterId);
    if (!voter) {
      throw new Error('voter not found');
    }

    // if (!voter.clientId) {
    //   voter.clientId = clientId;
    //   socket.join(room.id);
    // }

    room.votes = [];
    room.voters.forEach((voter: VoterType) => {
      voter.hasVoted = false;
    });

    delete room.computedVotes;
  }
}
