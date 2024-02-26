import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

import { LoggerHelper } from '../helpers/logger.helper';
import { rooms } from '../rooms';
import { io } from '..';
import { ComputedVotesMapper } from '../mappers/computed-votes.mapper';

export type LogoutPayload = {
  roomId: string;
  voterId: string;
};

export const logoutHandler = (clientId: string, payload: LogoutPayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.LOGOUT, `clientId: ${clientId}`);

  try {
    let voterIndex: number;
    const roomIndex = rooms.findIndex((room) => {
      voterIndex = room.voters.findIndex(
        (voter) => voter.id === payload.voterId || voter.clientId === clientId
      );
      return voterIndex >= 0;
    });

    if (roomIndex < 0) {
      return;
    }

    const room = rooms[roomIndex];
    const logoutVoter = room.voters[voterIndex];

    room.voters.splice(voterIndex, 1);
    room.votes = room.votes.filter((vote) => vote.voter.id !== payload.voterId);
    if (room.computedVotes) {
      room.computedVotes = ComputedVotesMapper.mapFromVotes(room.votes);
    }

    io.to(room.id).emit(ServerEventsEnum.LOGGED_OUT, {
      logoutVoter,
      voters: room.voters,
      computedVotes: room.computedVotes,
    });

    LoggerHelper.serverEvent(ServerEventsEnum.LOGGED_OUT, `roomId: ${room.id}`);
  } catch (error) {
    LoggerHelper.unexpectedError(error);
  }
};
