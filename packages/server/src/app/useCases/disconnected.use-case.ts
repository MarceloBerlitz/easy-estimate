import { RoomType, ServerEventsEnum } from '@ee/lib';

import { Logger } from '../interfaces/logger';
import { RoomEventManager } from '../interfaces/room-event-manager';
import { UseCase } from '../interfaces/use-case';
import { RoomService } from '../interfaces/room.service';

export default class DisconnectedUseCase implements UseCase<void, void> {
  private service: RoomService;
  private clientId: string;
  private logger: Logger;
  private eventManager: RoomEventManager;

  public constructor({
    roomService,
    clientId,
    logger,
    eventManager: RoomEventManager,
  }: {
    roomService: RoomService;
    clientId: string;
    logger: Logger;
    eventManager: RoomEventManager;
  }) {
    this.service = roomService;
    this.clientId = clientId;
    this.logger = logger;
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
      this.logger.info(`${this.service.getRoomsCount()}`, 'total rooms');
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
