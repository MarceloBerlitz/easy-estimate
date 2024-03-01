import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum, CreateRoomPayload } from '@ee/lib';

import { VoterFactory } from '../factories/voter.factory';
import { RoomFactory } from '../factories/room.factory';

import { EventHandler } from '../interfaces/event-handler';
import { RoomService } from '../services/room.service';
import { LoggerService } from '../services/logger.service';
export class CreateRoomHandler implements EventHandler {
  private roomService: RoomService;
  private logger: LoggerService;

  public constructor({
    roomService,
    loggerService,
  }: {
    roomService: RoomService;
    loggerService: LoggerService;
  }) {
    this.roomService = roomService;
    this.logger = loggerService;
  }

  public event: ClientEventsEnum = ClientEventsEnum.CREATE_ROOM;

  public handle(socket: Socket, clientId: string, payload: CreateRoomPayload): void {
    this.logger.clientEvent(ClientEventsEnum.CREATE_ROOM, `clientId: ${clientId}`);

    try {
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
    } catch (error) {
      this.logger.unexpectedError(error);
    }
  }
}
