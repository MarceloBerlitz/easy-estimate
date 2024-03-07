import { LogoutPayload, RoomType, ServerEventsEnum } from '@ee/lib';
import { RoomService } from '../interfaces/room.service';
import { UseCase } from '../interfaces/use-case';
import { Logger } from '../interfaces/logger';
import { RoomEventManager } from '../interfaces/room-event-manager';

export default class LogoutUseCase implements UseCase<LogoutPayload, void> {
  private service: RoomService;
  private clientId: string;
  private logger: Logger;
  private eventManager: RoomEventManager;

  public constructor({
    roomService,
    clientId,
    logger,
    eventManager,
  }: {
    roomService: RoomService;
    clientId: string;
    logger: Logger;
    eventManager: RoomEventManager;
  }) {
    this.service = roomService;
    this.clientId = clientId;
    this.logger = logger;
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

    if (room.voters.length === 0) {
      this.service.removeRoom(roomIndex);
      this.logger.info(`${this.service.getRoomsCount()}`, 'total rooms');
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
