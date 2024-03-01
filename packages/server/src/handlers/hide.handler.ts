import { Socket } from 'socket.io';

import { ClientEventsEnum, HidePayload, ServerEventsEnum } from '@ee/lib';

import { EventHandler } from '../interfaces/event-handler';
import { RoomService } from '../services/room.service';
import { LoggerService } from '../services/logger.service';
import { IO } from '../app/io';

type Dependencies = {
  io: IO;
  roomService: RoomService;
  loggerService: LoggerService;
};

export class HideHandler implements EventHandler {
  private io: IO;
  private roomService: RoomService;
  private logger: LoggerService;

  public event: ClientEventsEnum = ClientEventsEnum.HIDE;

  public constructor({ io, roomService, loggerService }: Dependencies) {
    this.io = io;
    this.roomService = roomService;
    this.logger = loggerService;
  }

  handle(socket: Socket, clientId: string, payload: HidePayload): void {
    const room = this.roomService.getRoom(payload.roomId);

    if (!room) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      this.logger.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
    }

    const voter = this.roomService.getVoter(room, payload.voterId);

    if (!voter) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      this.logger.serverEvent(
        ServerEventsEnum.ERROR,
        `room not found: ${payload.roomId} - clientId: ${clientId}`
      );
      return;
    }

    if (!voter.clientId) {
      voter.clientId = clientId;
      socket.join(room.id);
    }

    delete room.computedVotes;

    this.io.to(room.id).emit(ServerEventsEnum.POINTS_HIDDEN);

    this.logger.serverEvent(ServerEventsEnum.POINTS_HIDDEN, `roomId: ${room.id}`);
  }
}
