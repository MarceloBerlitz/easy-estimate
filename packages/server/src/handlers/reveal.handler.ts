import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

import { rooms } from '../rooms';
import { io } from '..';
import { ComputedVotesMapper } from '../mappers/computed-votes.mapper';

export type RevealPayload = {
  roomId: string;
};

export const revealHandler = (socket: Socket, voterId: string, payload: RevealPayload) => {
  console.log(`[event received] <${ClientEventsEnum.REVEAL}> clientId: ${voterId}`);

  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    socket.emit(ServerEventsEnum.ERROR, 'room not found');
    return;
  }

  if (!room.computedVotes) {
    room.computedVotes = ComputedVotesMapper.mapFromVotes(room.votes);
  }

  io.to(room.id).emit(ServerEventsEnum.POINTS_REVEALED, {
    computedVotes: room.computedVotes,
  });

  console.log(`[event sent] <${ServerEventsEnum.POINTS_REVEALED}> roomId: ${room.id}`);
};
