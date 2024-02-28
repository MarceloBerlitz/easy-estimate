import { Socket } from 'socket.io';

import { ClientEventsEnum, RevealPayload, ServerEventsEnum } from '@ee/lib';

import { rooms } from '../rooms';
import { io } from '..';
import { ComputedVotesMapper } from '../mappers/computed-votes.mapper';
import { LoggerHelper } from '../helpers/logger.helper';

export const revealHandler = (socket: Socket, clientId: string, payload: RevealPayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.REVEAL, `clientId: ${clientId}`);

  try {
    const room = rooms.find((room) => room.id === payload.roomId);

    if (!room) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
    }

    const voter = room.voters.find((voter) => voter.id === payload.voterId);

    if (!voter) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      LoggerHelper.serverEvent(
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

    io.to(room.id).emit(ServerEventsEnum.POINTS_REVEALED, {
      computedVotes: room.computedVotes,
    });

    LoggerHelper.serverEvent(ServerEventsEnum.POINTS_REVEALED, `roomId: ${room.id}`);
  } catch (error) {
    LoggerHelper.unexpectedError(error);
  }
};
