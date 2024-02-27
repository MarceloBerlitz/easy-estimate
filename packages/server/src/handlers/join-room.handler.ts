import { Socket } from 'socket.io';
import { validate as validateUuid, v4 as uuid } from 'uuid';

import { ClientEventsEnum, ServerEventsEnum } from '@ee/lib';

import { rooms } from '../rooms';
import { VoterFactory } from '../factories/voter.factory';
import { io } from '..';
import { LoggerHelper } from '../helpers/logger.helper';
import { RoomFactory } from '../factories/room.factory';

export type JoinRoomPayload = {
  name: string;
  roomId: string;
  voterId?: string;
};

export const joinRoomHandler = (socket: Socket, clientId: string, payload: JoinRoomPayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.JOIN_ROOM, `clientId: ${clientId}`);

  try {
    if (!validateUuid(payload.roomId)) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
    }

    let room = rooms.find((room) => room.id === payload.roomId);

    let voter;

    if (!room) {
      LoggerHelper.getLogger().info('room not found. creating room.');
      voter = { ...VoterFactory.create(clientId, payload.name), id: payload.voterId ?? uuid() };
      room = { ...RoomFactory.create(voter), id: payload.roomId };
      rooms.push(room);
    } else {
      if (!payload.voterId) {
        voter = VoterFactory.create(clientId, payload.name);
        room.voters.push(voter);
      } else {
        voter = room.voters.find((voter) => voter.id === payload.voterId);
        if (voter) {
          voter.clientId = clientId;
        } else {
          voter = { ...VoterFactory.create(clientId, payload.name), id: payload.voterId };
          room.voters.push(voter);
        }
      }
    }

    socket.join(room.id);

    io.to(room.id).emit(ServerEventsEnum.VOTER_JOINED, {
      voter,
      voters: room.voters,
      computedVotes: room.computedVotes,
    });

    LoggerHelper.serverEvent(ServerEventsEnum.VOTER_JOINED, `roomId: ${room.id}`);
  } catch (error) {
    LoggerHelper.unexpectedError(error);
  }
};
