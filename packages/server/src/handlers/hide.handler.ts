import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

import { rooms } from '../rooms';
import { io } from '..';
import { LoggerHelper } from '../helpers/logger.helper';

export type HidePayload = {
  roomId: string;
  voterId: string;
};

export const hideHandler = (socket: Socket, clientId: string, payload: HidePayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.HIDE, `clientId: ${clientId}`);

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

    delete room.computedVotes;

    io.to(room.id).emit(ServerEventsEnum.POINTS_HIDDEN);

    LoggerHelper.serverEvent(ServerEventsEnum.POINTS_HIDDEN, `roomId: ${room.id}`);
  } catch (error) {
    LoggerHelper.unexpectedError(error);
  }
};
