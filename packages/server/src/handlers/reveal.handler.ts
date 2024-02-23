import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

import { rooms } from '../rooms';
import { io } from '..';
import { ComputedVotesMapper } from '../mappers/computed-votes.mapper';
import { LoggerHelper } from '../helpers/logger.helper';

export type RevealPayload = {
  roomId: string;
};

export const revealHandler = (socket: Socket, voterId: string, payload: RevealPayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.REVEAL, `clientId: ${voterId}`);

  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    socket.emit(ServerEventsEnum.ERROR, 'room not found');
    LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
    return;
  }

  if (!room.computedVotes) {
    room.computedVotes = ComputedVotesMapper.mapFromVotes(room.votes);
  }

  io.to(room.id).emit(ServerEventsEnum.POINTS_REVEALED, {
    computedVotes: room.computedVotes,
  });

  LoggerHelper.serverEvent(ServerEventsEnum.POINTS_REVEALED, `roomId: ${room.id}`);
};
