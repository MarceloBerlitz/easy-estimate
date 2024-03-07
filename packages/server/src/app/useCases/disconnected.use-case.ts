import { RoomType, ServerEventsEnum } from '@ee/lib';

import { RoomEventManager } from '../interfaces/room-event-manager';
import { RoomService } from '../interfaces/room.service';
import { UseCase } from '../interfaces/use-case';

export default class DisconnectedUseCase implements UseCase<void, void> {
  private service: RoomService;
  private clientId: string;
  private eventManager: RoomEventManager;

  public constructor({
    roomService,
    clientId,
    eventManager: RoomEventManager,
  }: {
    roomService: RoomService;
    clientId: string;
    eventManager: RoomEventManager;
  }) {
    this.service = roomService;
    this.clientId = clientId;
    this.eventManager = RoomEventManager;
  }

  execute(): void {
    const { voterIndex, roomIndex } = this.getVoterAndRoomIndexes();

    if (roomIndex < 0) {
      return;
    }

    const room = this.service.getRooms()[roomIndex];
    const disconnectedVoter = room.voters[voterIndex];

    disconnectedVoter.clientId = null;

    if (this.service.nobodyIsConnected(room)) {
      this.service.removeRoom(roomIndex);
      return;
    }

    this.eventManager.to(room.id).emit(ServerEventsEnum.VOTER_DISCONNECTED, {
      voters: room.voters,
      computedVotes: room.computedVotes,
    });
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
