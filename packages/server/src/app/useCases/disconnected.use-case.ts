import { RoomType, ServerEventsEnum } from '@ee/lib';

import { ClientEventManager } from '../interfaces/client-event-manager';
import { RoomService } from '../interfaces/room.service';
import { UseCase } from '../interfaces/use-case';

export default class DisconnectedUseCase implements UseCase<void, void> {
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
