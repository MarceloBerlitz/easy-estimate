import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum, CreateRoomPayload } from '@ee/lib';

import { VoterFactory } from '../factories/voter.factory';
import { RoomFactory } from '../factories/room.factory';
import { rooms } from '../rooms';
import { LoggerHelper } from '../helpers/logger.helper';

export const createRoomHandler = (socket: Socket, clientId: string, payload: CreateRoomPayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.CREATE_ROOM, `clientId: ${clientId}`);

  try {
    if (!payload.name) {
      socket.emit(ServerEventsEnum.ERROR, 'Display name is required');
      return;
    }

    const voter = VoterFactory.create(clientId, payload.name);
    const room = RoomFactory.create(voter);

    rooms.push(room);

    socket.join(room.id);

    socket.emit(ServerEventsEnum.ROOM_CREATED, { room, voter });
    LoggerHelper.info('total rooms', `${rooms.length}`);
    LoggerHelper.serverEvent(ServerEventsEnum.ROOM_CREATED, `clientId: ${clientId}`);
  } catch (error) {
    LoggerHelper.unexpectedError(error);
  }
};
