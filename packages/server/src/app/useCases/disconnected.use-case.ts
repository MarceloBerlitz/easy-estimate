import { RoomType } from '@ee/lib';
import { UseCase } from '../interfaces/use-case';
import { RoomService } from '../services/room.service';

type DisconnectedUseCaseResult = {
  roomDeleted: boolean;
  room?: RoomType;
};

export class DisconnectedUseCase implements UseCase<void, DisconnectedUseCaseResult> {
  private service: RoomService;
  private clientId: string;

  public constructor({
    roomService,
    clientEvent,
  }: {
    roomService: RoomService;
    clientEvent: string;
  }) {
    this.service = roomService;
    this.clientId = clientEvent;
  }

  execute(): DisconnectedUseCaseResult {
    const { voterIndex, roomIndex } = this.getVoterAndRoomIndexes();

    if (roomIndex < 0) {
      return;
    }

    const room = this.service.getRooms()[roomIndex];
    const disconnectedVoter = room.voters[voterIndex];

    disconnectedVoter.clientId = null;

    if (this.service.nobodyIsConnected(room)) {
      this.service.removeRoom(roomIndex);
      // this.logger.info('total rooms', `${this.service.getRoomsCount()}`);
      return { roomDeleted: true };
    }
    return { roomDeleted: false, room };
  }

  private getVoterAndRoomIndexes() {
    let voterIndex: number;
    const roomIndex = this.service.getRooms().findIndex((room: RoomType) => {
      voterIndex = room.voters.findIndex((voter) => voter.clientId === this.clientId);
      return voterIndex >= 0;
    });

    return { voterIndex, roomIndex };
  }
}
