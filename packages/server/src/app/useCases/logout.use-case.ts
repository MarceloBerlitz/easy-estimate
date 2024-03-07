import { LogoutPayload, RoomType, ServerEventsEnum } from '@ee/lib';

import { RoomEventManager } from '../interfaces/room-event-manager';
import { RoomService } from '../interfaces/room.service';
import { UseCase } from '../interfaces/use-case';

export default class LogoutUseCase implements UseCase<LogoutPayload, void> {
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

  execute(payload: LogoutPayload): void {
    const { roomIndex, voterIndex } = this.getVoterAndRoomIndexes(payload.voterId);

    if (roomIndex < 0) {
      return;
    }

    const room = this.service.getRooms()[roomIndex];
    const logoutVoter = room.voters[voterIndex];
    this.service.removeVoter(room, voterIndex);

    this.eventManager.leave(payload.roomId);

    if (this.service.nobodyIsConnected(room)) {
      this.service.removeRoom(roomIndex);
      return;
    }

    this.service.removeVotersVotes(room, payload.voterId);

    this.eventManager.to(payload.roomId).emit(ServerEventsEnum.LOGGED_OUT, {
      logoutVoter,
      voters: room.voters,
      computedVotes: room.computedVotes,
    });
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
