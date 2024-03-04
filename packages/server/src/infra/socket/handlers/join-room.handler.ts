import { Socket } from 'socket.io';
import { validate as validateUuid } from 'uuid';

import { ClientEventsEnum, JoinRoomPayload, ServerEventsEnum } from '@ee/lib';

import { LoggerService } from '../../logging/logger.service';
import { IO } from '../../io';
import { EventHandler } from '../interfaces/event-handler';
import { RoomService } from '../../../app/services/room.service';
import { JoinRoomUseCase } from '../../../app/useCases/join-room/join-room.usecase';

type Dependencies = {
  io: IO;
  loggerService: LoggerService;
  roomService: RoomService;
  joinRoomUseCase: JoinRoomUseCase;
  socket: Socket;
};

export class JoinRoomHandler implements EventHandler {
  private logger: LoggerService;
  private io: IO;
  private joinRoomUseCase: JoinRoomUseCase;
  private socket: Socket;

  public event: ClientEventsEnum = ClientEventsEnum.JOIN_ROOM;

  public constructor({ io, loggerService, joinRoomUseCase, socket }: Dependencies) {
    this.io = io;
    this.logger = loggerService;
    this.joinRoomUseCase = joinRoomUseCase;
    this.socket = socket;
  }

  public handle(payload: JoinRoomPayload): void {
    if (!validateUuid(payload.roomId)) {
      this.socket.emit(ServerEventsEnum.ERROR, 'room not found');
      this.logger.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
    }

    const { voter, room } = this.joinRoomUseCase.execute(payload);

    this.socket.join(room.id);

    this.io.to(room.id).emit(ServerEventsEnum.VOTER_JOINED, {
      voter,
      voters: room.voters,
      computedVotes: room.computedVotes,
    });

    this.logger.serverEvent(ServerEventsEnum.VOTER_JOINED, `roomId: ${room.id}`);
  }
}
