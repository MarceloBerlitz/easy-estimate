import { Socket } from 'socket.io';

import { ClientEventsEnum, JoinRoomPayload, ServerEventsEnum } from '@ee/lib';

import { rooms } from '../rooms';
import { VoterFactory } from '../factories/voter.factory';
import { io } from '..';
import { LoggerHelper } from '../helpers/logger.helper';

export const joinRoomHandler = (socket: Socket, clientId: string, payload: JoinRoomPayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.JOIN_ROOM, `clientId: ${clientId}`);

  try {
    const room = rooms.find((room) => room.id === payload.roomId);

    if (!room) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
    }

    let voter;

    if (!payload.voterId) {
      voter = VoterFactory.create(clientId, payload.name);
      room.voters.push(voter);
    } else {
      voter = room.voters.find((voter) => voter.id === payload.voterId);
      if (voter) {
        voter.clientId = clientId;
      } else {
        socket.emit(ServerEventsEnum.ERROR, 'room not found');
        LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
        return;
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
