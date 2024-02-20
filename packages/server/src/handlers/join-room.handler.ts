import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

import { rooms } from '../rooms';
import { VoterFactory } from '../factories/voter.factory';
import { socket } from '..';

export type JoinRoomPayload = {
  name: string;
  roomId: string;
};

export const joinRoomHandler = (io: Socket, voterId: string, payload: JoinRoomPayload) => {
  console.log(`[event received] <${ClientEventsEnum.JOIN_ROOM}> clientId: ${voterId}`);

  const newVoter = VoterFactory.create(voterId, payload.name);
  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    io.emit(ServerEventsEnum.ERROR, 'room not found');
    return;
  }

  room.voters.push(newVoter);

  io.join(room.id);

  socket
    .to(room.id)
    .emit(ServerEventsEnum.VOTER_JOINED, {
      voters: room.voters,
      computedVotes: room.computedVotes,
    });

  console.log(`[event sent] <${ServerEventsEnum.VOTER_JOINED}> roomId: ${room.id}`);
};
