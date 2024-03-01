import { Socket } from 'socket.io';

import { ClientEventsEnum, RevealPayload, RoomType, ServerEventsEnum } from '@ee/lib';

import { ComputedVotesMapper } from '../mappers/computed-votes.mapper';
import { EventHandler } from '../interfaces/event-handler';
import { RoomService } from '../services/room.service';
import { LoggerService } from '../services/logger.service';
import { IO } from '../app/io';

export class RevealHandler implements EventHandler {
  private io: IO;
  private roomService: RoomService;
  private logger: LoggerService;

  public event: ClientEventsEnum = ClientEventsEnum.REVEAL;

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

  public handle(socket: Socket, clientId: string, payload: RevealPayload) {
    const room: RoomType = this.roomService.getRoom(payload.roomId);

    if (!room) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      this.logger.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
    }

    const voter = room.voters.find((voter) => voter.id === payload.voterId);

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

    if (!room.computedVotes) {
      room.computedVotes = ComputedVotesMapper.mapFromVotes(room.votes);
    }

    this.io.to(room.id).emit(ServerEventsEnum.POINTS_REVEALED, {
      computedVotes: room.computedVotes,
    });

    this.logger.serverEvent(ServerEventsEnum.POINTS_REVEALED, `roomId: ${room.id}`);
  }
}
