import { Socket } from 'socket.io';

import { ClientEventsEnum, HidePayload, ServerEventsEnum } from '@ee/lib';

import { io } from '..';
import { LoggerHelper } from '../helpers/logger.helper';
import { RoomHelper } from '../helpers/room.helper';

export const hideHandler = (socket: Socket, clientId: string, payload: HidePayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.HIDE, `clientId: ${clientId}`);

  try {
    const room = RoomHelper.getRoom(payload.roomId);

    if (!room) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
    }

    const voter = RoomHelper.getVoter(room, payload.voterId);

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
