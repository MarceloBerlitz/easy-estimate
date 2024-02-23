import { Socket } from 'socket.io';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

import { VoterFactory } from '../factories/voter.factory';
import { RoomFactory } from '../factories/room.factory';
import { rooms } from '../rooms';
import { LoggerHelper } from '../helpers/logger.helper';

export type CreateRoomPayload = { name: string };

export const createRoomHandler = (socket: Socket, voterId: string, payload: CreateRoomPayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.CREATE_ROOM, `clientId: ${voterId}`);

  try {
    if (!payload.name) {
      socket.emit(ServerEventsEnum.ERROR, 'name is required');
      return;
    }

    const voter = VoterFactory.create(voterId, payload.name);
    const room = RoomFactory.create(voter);

    rooms.push(room);

    socket.join(room.id);

    socket.emit(ServerEventsEnum.ROOM_CREATED, { room, voter });
    LoggerHelper.info('total rooms', `${rooms.length}`);
    LoggerHelper.serverEvent(ServerEventsEnum.ROOM_CREATED, `clientId: ${voterId}`);
  } catch (error) {
    LoggerHelper.unexpectedError(error);
  }
};
