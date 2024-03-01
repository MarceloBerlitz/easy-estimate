import { Socket } from 'socket.io';

import { ClientEventsEnum, DeleteVotesPayload, ServerEventsEnum, VoterType } from '@ee/lib';

import { EventHandler } from '../interfaces/event-handler';
import { LoggerService } from '../services/logger.service';
import { RoomService } from '../services/room.service';
import { IO } from '../app/io';

export class DeleteVotesHandler implements EventHandler {
  private logger: LoggerService;
  private roomService: RoomService;
  private io: IO;

  public event: ClientEventsEnum = ClientEventsEnum.DELETE_VOTES;

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

  public handle(socket: Socket, clientId: string, payload: DeleteVotesPayload): void {
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

    room.votes = [];
    room.voters.forEach((voter: VoterType) => {
      voter.hasVoted = false;
    });

    delete room.computedVotes;

    this.io.to(room.id).emit(ServerEventsEnum.VOTES_DELETED);

    this.logger.serverEvent(ServerEventsEnum.VOTES_DELETED, `roomId: ${room.id}`);
  }
}
