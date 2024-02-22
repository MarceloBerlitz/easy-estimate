import { Socket } from 'socket.io';

import { rooms } from '../rooms';
import { ClientEventsEnum, ServerEventsEnum, VoterType } from '@ee/lib';
import { io } from '..';

export type DeleteVotesPayload = {
  roomId: string;
};

export const deleteVotesHandler = (
  socket: Socket,
  voterId: string,
  payload: DeleteVotesPayload
) => {
  console.log(`[event received] <${ClientEventsEnum.DELETE_VOTES}> clientId: ${voterId}`);

  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    socket.emit(ServerEventsEnum.ERROR, 'room not found');
    return;
  }

  room.votes = [];
  room.voters.forEach((voter: VoterType) => {
    voter.hasVoted = false;
  });

  delete room.computedVotes;

  io.to(room.id).emit(ServerEventsEnum.VOTES_DELETED);

  console.log(`[event sent] <${ServerEventsEnum.VOTES_DELETED}> roomId: ${room.id}`);
};
