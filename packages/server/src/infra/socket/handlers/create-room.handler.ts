import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum, CreateRoomPayload } from '@ee/lib';

import { EventHandler } from '../interfaces/event-handler';
import { CreateRoomUseCase } from '../../../app/useCases/create-room.use-case';
import { LoggerService } from '../../logging/logger.service';
import { RoomService } from '../../../app/services/room.service';

export class CreateRoomHandler implements EventHandler {
  private createRoomUseCase: CreateRoomUseCase;
  private logger: LoggerService;
  private roomService: RoomService;
  private socket: Socket;
  private clientId: string;

  public event: ClientEventsEnum = ClientEventsEnum.CREATE_ROOM;

  public constructor({
    createRoomUseCase,
    socket,
    clientId,
  }: {
    createRoomUseCase: CreateRoomUseCase;
    socket: Socket;
    clientId: string;
  }) {
    this.createRoomUseCase = createRoomUseCase;
    this.socket = socket;
    this.clientId = clientId;
  }

  public handle(payload: CreateRoomPayload): void {
    if (!payload.name) {
      this.socket.emit(ServerEventsEnum.ERROR, 'Display name is required');
      return;
    }

    const { room, voter } = this.createRoomUseCase.execute(payload);

    this.socket.join(room.id);

    this.socket.emit(ServerEventsEnum.ROOM_CREATED, { room, voter });
    this.logger.info(`${this.roomService.getRoomsCount()}`, 'total rooms');
    this.logger.serverEvent(ServerEventsEnum.ROOM_CREATED, `clientId: ${this.clientId}`);
  }
}
