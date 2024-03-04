import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum, CreateRoomPayload } from '@ee/lib';

import { VoterFactory } from '../factories/voter.factory';
import { RoomFactory } from '../factories/room.factory';

import { EventHandler } from '../interfaces/event-handler';
import { RoomService } from '../services/room.service';
import { LoggerService } from '../services/logger.service';

type Dependencies = {
  roomService: RoomService;
  loggerService: LoggerService;
};

export class CreateRoomHandler implements EventHandler {
  private roomService: RoomService;
  private logger: LoggerService;

  public event: ClientEventsEnum = ClientEventsEnum.CREATE_ROOM;

  public constructor({ roomService, loggerService }: Dependencies) {
    this.roomService = roomService;
    this.logger = loggerService;
  }

  public handle(socket: Socket, clientId: string, payload: CreateRoomPayload): void {
    if (!payload.name) {
      socket.emit(ServerEventsEnum.ERROR, 'Display name is required');
      return;
    }

    const voter = VoterFactory.create(clientId, payload.name);
    const room = RoomFactory.create(voter);

    this.roomService.addRoom(room);

    socket.join(room.id);

    socket.emit(ServerEventsEnum.ROOM_CREATED, { room, voter });
    this.logger.info('total rooms', `${this.roomService.getRoomsCount()}`);
    this.logger.serverEvent(ServerEventsEnum.ROOM_CREATED, `clientId: ${clientId}`);
  }
}
