import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum, VoteParametersType, VoteType } from '@ee/lib';

import { rooms } from '../rooms';
import { io } from '..';
import { ComputedVotesMapper } from '../mappers/computed-votes.mapper';
import { LoggerHelper } from '../helpers/logger.helper';

export type VotePayload = {
  voterId: string;
  roomId: string;
  vote: VoteParametersType;
};

export const voteHandler = (socket: Socket, clientId: string, payload: VotePayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.VOTE, `clientId: ${clientId}`);

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

    const currentVoteIndex = room.votes.findIndex(
      (vote: VoteType) => vote.voter.id === payload.voterId
    );

    if (currentVoteIndex >= 0) {
      room.votes.splice(currentVoteIndex, 1);
    }

    room.votes.push({ ...payload.vote, voter });

    voter.hasVoted = true;

    if (room.computedVotes) {
      room.computedVotes = ComputedVotesMapper.mapFromVotes(room.votes);
    }

    io.to(room.id).emit(ServerEventsEnum.VOTE_MADE, {
      voters: room.voters,
      ...(room.computedVotes ? { computedVotes: room.computedVotes } : {}),
    });

    LoggerHelper.serverEvent(ServerEventsEnum.VOTE_MADE, `roomId: ${room.id}`);
  } catch (error) {
    LoggerHelper.unexpectedError(error);
  }
};
