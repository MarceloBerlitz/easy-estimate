import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

import { rooms } from '../rooms';
import { io } from '..';
import { LoggerHelper } from '../helpers/logger.helper';

export type HidePayload = {
  roomId: string;
};

export const hideHandler = (socket: Socket, voterId: string, payload: HidePayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.HIDE, `clientId: ${voterId}`);

  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    socket.emit(ServerEventsEnum.ERROR, 'room not found');
    LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
    return;
  }

  delete room.computedVotes;

  io.to(room.id).emit(ServerEventsEnum.POINTS_HIDDEN);

  LoggerHelper.serverEvent(ServerEventsEnum.POINTS_HIDDEN, `roomId: ${room.id}`);
};
