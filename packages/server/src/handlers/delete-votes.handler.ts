import { Socket } from 'socket.io';

import { rooms } from '../rooms';
import { ClientEventsEnum, ServerEventsEnum, VoterType } from '@ee/lib';
import { io } from '..';
import { LoggerHelper } from '../helpers/logger.helper';

export type DeleteVotesPayload = {
  roomId: string;
};

export const deleteVotesHandler = (
  socket: Socket,
  voterId: string,
  payload: DeleteVotesPayload
) => {
  LoggerHelper.clientEvent(ClientEventsEnum.DELETE_VOTES, `clientId: ${voterId}`);

  try {
    const room = rooms.find((room) => room.id === payload.roomId);

    if (!room) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
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
