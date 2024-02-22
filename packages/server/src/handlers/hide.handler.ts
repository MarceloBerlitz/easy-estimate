import { Socket } from 'socket.io';

import { rooms } from '../rooms';
import { io } from '..';
import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

export type HidePayload = {
  roomId: string;
};

export const hideHandler = (socket: Socket, voterId: string, payload: HidePayload) => {
  console.log(`[event received] <${ClientEventsEnum.HIDE}> clientId: ${voterId}`);

  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    socket.emit(ServerEventsEnum.ERROR, 'room not found');
    return;
  }

  delete room.computedVotes;

  io.to(room.id).emit(ServerEventsEnum.POINTS_HIDDEN);

  console.log(`[event sent] <${ServerEventsEnum.POINTS_HIDDEN}> roomId: ${room.id}`);
};
