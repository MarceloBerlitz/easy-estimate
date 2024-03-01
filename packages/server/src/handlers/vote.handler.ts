import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum, VotePayload, VoteType } from '@ee/lib';

import { EventHandler } from '../interfaces/event-handler';
import { RoomService } from '../services/room.service';
import { LoggerService } from '../services/logger.service';
import { IO } from '../app/io';

export class VoteHandler implements EventHandler {
  private io: IO;
  private roomService: RoomService;
  private logger: LoggerService;

  public event: ClientEventsEnum = ClientEventsEnum.VOTE;

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

  public handle(socket: Socket, clientId: string, payload: VotePayload): void {
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

    const currentVoteIndex = room.votes.findIndex(
      (vote: VoteType) => vote.voter.id === payload.voterId
    );

    if (currentVoteIndex >= 0) {
      room.votes.splice(currentVoteIndex, 1);
    }

    room.votes.push({ ...payload.vote, voter });

    voter.hasVoted = true;

    this.roomService.updateComputedVotes(room);

    this.io.to(room.id).emit(ServerEventsEnum.VOTE_MADE, {
      voters: room.voters,
      ...(room.computedVotes ? { computedVotes: room.computedVotes } : {}),
    });

    this.logger.serverEvent(ServerEventsEnum.VOTE_MADE, `roomId: ${room.id}`);
  }
}
