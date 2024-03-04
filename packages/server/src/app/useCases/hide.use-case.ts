import { HidePayload } from '@ee/lib';
import { UseCase } from '../interfaces/use-case';
import { RoomService } from '../services/room.service';

export class HideUseCase implements UseCase<HidePayload, void> {
  private service: RoomService;

  public constructor({ roomService }: { roomService: RoomService }) {
    this.service = roomService;
  }

  execute(payload: HidePayload): void {
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

    delete room.computedVotes;
  }
}
