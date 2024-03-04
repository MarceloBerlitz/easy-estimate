import { LogoutPayload, RoomType, VoterType } from '@ee/lib';
import { RoomService } from '../services/room.service';
import { UseCase } from '../interfaces/use-case';

type LogoutResult = {
  roomDeleted: boolean;
  room?: RoomType;
  logoutVoter?: VoterType;
};

export class LogoutUseCase implements UseCase<LogoutPayload, LogoutResult> {
  private service: RoomService;
  private clientId: string;

  public constructor({ roomService, clientId }: { roomService: RoomService; clientId: string }) {
    this.service = roomService;
    this.clientId = clientId;
  }

  execute(payload: LogoutPayload): LogoutResult {
    const { roomIndex, voterIndex } = this.getVoterAndRoomIndexes(payload.voterId);

    if (roomIndex < 0) {
      return;
    }

    const room = this.service.getRooms()[roomIndex];
    const logoutVoter = room.voters[voterIndex];
    this.service.removeVoter(room, voterIndex);

    if (room.voters.length === 0) {
      this.service.removeRoom(roomIndex);
      //   this.logger.info('total rooms', `${this.service.getRoomsCount()}`);
      return { roomDeleted: true };
    }

    this.service.removeVotersVotes(room, payload.voterId);
    return { roomDeleted: false, room, logoutVoter };
  }

  private getVoterAndRoomIndexes(voterId: string) {
    let voterIndex: number;
    const roomIndex = this.service.getRooms().findIndex((room: RoomType) => {
      voterIndex = room.voters.findIndex(
        (voter) => voter.id === voterId || voter.clientId === this.clientId
      );
      return voterIndex >= 0;
    });

    return { voterIndex, roomIndex };
  }
}
