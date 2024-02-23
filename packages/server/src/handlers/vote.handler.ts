import { Socket } from 'socket.io';

import {
  ClientEventsEnum,
  ServerEventsEnum,
  VoteParametersType,
  VoteType,
  VoterType,
} from '@ee/lib';

import { rooms } from '../rooms';
import { io } from '..';
import { ComputedVotesMapper } from '../mappers/computed-votes.mapper';
import { LoggerHelper } from '../helpers/logger.helper';

export type VotePayload = {
  roomId: string;
  vote: VoteParametersType;
};

export const voteHandler = (socket: Socket, voterId: string, payload: VotePayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.VOTE, `clientId: ${voterId}`);

  try {
    const room = rooms.find((room) => room.id === payload.roomId);

    if (!room) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
    }

    const voter = room.voters.find((voter: VoterType) => voter.id === voterId);

    if (!voter) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      LoggerHelper.serverEvent(
        ServerEventsEnum.ERROR,
        `room not found: ${payload.roomId} - clientId: ${voterId}`
      );
      return;
    }

    const currentVoteIndex = room.votes.findIndex((vote: VoteType) => vote.voter.id === voterId);

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
