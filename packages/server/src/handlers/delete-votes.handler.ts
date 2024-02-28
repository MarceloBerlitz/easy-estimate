import { Socket } from 'socket.io';

import { ClientEventsEnum, DeleteVotesPayload, ServerEventsEnum, VoterType } from '@ee/lib';

import { rooms } from '../rooms';
import { io } from '..';
import { LoggerHelper } from '../helpers/logger.helper';

export const deleteVotesHandler = (
  socket: Socket,
  clientId: string,
  payload: DeleteVotesPayload
) => {
  LoggerHelper.clientEvent(ClientEventsEnum.DELETE_VOTES, `clientId: ${clientId}`);

  try {
    const room = rooms.find((room) => room.id === payload.roomId);

    if (!room) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
    }

    const voter = room.voters.find((voter: VoterType) => voter.id === payload.voterId);

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

    room.votes = [];
    room.voters.forEach((voter: VoterType) => {
      voter.hasVoted = false;
    });

    delete room.computedVotes;

    io.to(room.id).emit(ServerEventsEnum.VOTES_DELETED);

    LoggerHelper.serverEvent(ServerEventsEnum.VOTES_DELETED, `roomId: ${room.id}`);
  } catch (error) {
    LoggerHelper.unexpectedError(error);
  }
};
