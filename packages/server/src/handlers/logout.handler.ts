import { Socket } from 'socket.io';

import { ClientEventsEnum, LogoutPayload, RoomType, ServerEventsEnum } from '@ee/lib';

import { EventHandler } from '../interfaces/event-handler';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { LoggerService } from '../services/logger.service';
import { RoomService } from '../services/room.service';
import { IO } from '../app/io';
export class LogoutHandler implements EventHandler {
  private logger: LoggerService;
  private roomService: RoomService;
  private io: IO;
  public event: ClientEventsEnum = ClientEventsEnum.LOGOUT;

  public constructor({
    io,
    roomService,
    loggerService,
  }: {
    io: IO;
    roomService: RoomService;
    loggerService: LoggerService;
  }) {
    this.io = io;
    this.roomService = roomService;
    this.logger = loggerService;
  }

  handle(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    clientId: string,
    payload: LogoutPayload
  ): void {
    const { roomIndex, voterIndex } = this.getVoterAndRoomIndexes(clientId, payload.voterId);

    if (roomIndex < 0) {
      return;
    }

    const room = this.roomService.getRooms()[roomIndex];
    const logoutVoter = room.voters[voterIndex];
    this.roomService.removeVoter(room, voterIndex);

    socket.leave(room.id);

    if (room.voters.length === 0) {
      this.roomService.removeRoom(roomIndex);
      this.logger.info('total rooms', `${this.roomService.getRoomsCount()}`);
      return;
    }

    this.roomService.removeVotersVotes(room, payload.voterId);

    this.io.to(room.id).emit(ServerEventsEnum.LOGGED_OUT, {
      logoutVoter,
      voters: room.voters,
      computedVotes: room.computedVotes,
    });

    this.logger.serverEvent(ServerEventsEnum.LOGGED_OUT, `roomId: ${room.id}`);
  }

  private getVoterAndRoomIndexes(clientId: string, voterId: string) {
    let voterIndex: number;
    const roomIndex = this.roomService.getRooms().findIndex((room: RoomType) => {
      voterIndex = room.voters.findIndex(
        (voter) => voter.id === voterId || voter.clientId === clientId
      );
      return voterIndex >= 0;
    });

    return { voterIndex, roomIndex };
  }
}
