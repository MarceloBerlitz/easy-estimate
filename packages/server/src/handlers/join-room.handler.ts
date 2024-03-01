import { Socket } from 'socket.io';
import { validate as validateUuid } from 'uuid';

import { ClientEventsEnum, JoinRoomPayload, ServerEventsEnum } from '@ee/lib';

import { VoterFactory } from '../factories/voter.factory';
import { io } from '..';
import { LoggerHelper } from '../helpers/logger.helper';
import { RoomFactory } from '../factories/room.factory';
import { RoomHelper } from '../helpers/room.helper';

export const joinRoomHandler = (socket: Socket, clientId: string, payload: JoinRoomPayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.JOIN_ROOM, `clientId: ${clientId}`);

  try {
    if (!validateUuid(payload.roomId)) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
    }

    let room = RoomHelper.getRoom(payload.roomId);
    let voter;

    if (!room) {
      LoggerHelper.getLogger().info('room not found. creating room.');
      voter = VoterFactory.create(clientId, payload.name, payload.voterId);
      room = RoomFactory.create(voter, payload.roomId);
      RoomHelper.addRoom(room);
    } else {
      if (!payload.voterId) {
        voter = VoterFactory.create(clientId, payload.name);
        RoomHelper.addVoter(room, voter);
      } else {
        const currentVoter = RoomHelper.findVoter(room, payload.voterId);
        if (currentVoter) {
          currentVoter.clientId = clientId;
        } else {
          voter = VoterFactory.create(clientId, payload.name, payload.voterId);
          RoomHelper.addVoter(room, voter);
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
