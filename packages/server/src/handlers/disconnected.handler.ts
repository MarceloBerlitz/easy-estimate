import { RoomType, ServerEventsEnum } from '@ee/lib';

import { RoomService } from '../services/room.service';
import { LoggerService } from '../services/logger.service';
import { IO } from '../app/io';

export class DisconnectedHandler {
  private logger: LoggerService;
  private roomService: RoomService;
  private io: IO;

  public constructor({
    loggerService,
    roomService,
    io,
  }: {
    loggerService: LoggerService;
    roomService: RoomService;
    io: IO;
  }) {
    this.logger = loggerService;
    this.roomService = roomService;
    this.io = io;
  }

  private getVoterAndRoomIndexes(clientId: string) {
    let voterIndex: number;
    const roomIndex = this.roomService.getRooms().findIndex((room: RoomType) => {
      voterIndex = room.voters.findIndex((voter) => voter.clientId === clientId);
      return voterIndex >= 0;
    });

    return { voterIndex, roomIndex };
  }

  public handle(clientId: string): void {
    this.logger.clientEvent('disconnect', `clientId: ${clientId}`);
    this.logger.info('total clients', `${this.io.instance.sockets.sockets.size}`);

    try {
      const { voterIndex, roomIndex } = this.getVoterAndRoomIndexes(clientId);

      if (roomIndex < 0) {
        return;
      }

      const room = this.roomService.getRooms()[roomIndex];
      const disconnectedVoter = room.voters[voterIndex];

      disconnectedVoter.clientId = null;

      if (this.roomService.nobodyIsConnected(room)) {
        this.roomService.removeRoom(roomIndex);
        this.logger.info('total rooms', `${this.roomService.getRoomsCount()}`);
        return;
      }

      this.io.to(room.id).emit(ServerEventsEnum.VOTER_DISCONNECTED, {
        voters: room.voters,
        computedVotes: room.computedVotes,
      });

      this.logger.serverEvent(
        ServerEventsEnum.VOTER_DISCONNECTED,
        `clientId: ${disconnectedVoter.clientId}`
      );
    } catch (error) {
      this.logger.unexpectedError(error);
    }
  }
}
