import { Socket } from 'socket.io';
import { validate as validateUuid } from 'uuid';

import { ClientEventsEnum, JoinRoomPayload, RoomType, ServerEventsEnum, VoterType } from '@ee/lib';

import { VoterFactory } from '../factories/voter.factory';
import { io } from '..';
import { LoggerHelper } from '../helpers/logger.helper';
import { RoomFactory } from '../factories/room.factory';
import { RoomHelper } from '../helpers/room.helper';

const joinRoom = (
  clientId: string,
  payload: JoinRoomPayload
): { room: RoomType; voter: VoterType } => {
  const room = RoomHelper.getRoom(payload.roomId);

  // Room does not exist, create a new room and a new voter
  if (!room) {
    LoggerHelper.getLogger().info('room not found. creating room.');
    const newVoter = VoterFactory.create(clientId, payload.name, payload.voterId);
    const newRoom = RoomFactory.create(newVoter, payload.roomId);
    RoomHelper.addRoom(newRoom);
    return { room: newRoom, voter: newVoter };
  }

  const voter = RoomHelper.getVoter(room, payload.voterId);
  // Voter already exists in the room, update the clientId
  if (voter) {
    voter.clientId = clientId;
    return { room, voter };
  }

  // Voter does not exist, add a new voter
  const newVoter = VoterFactory.create(clientId, payload.name, payload.voterId);
  RoomHelper.addVoter(room, newVoter);
  return { room, voter: newVoter };
};

export const joinRoomHandler = (socket: Socket, clientId: string, payload: JoinRoomPayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.JOIN_ROOM, `clientId: ${clientId}`);

  try {
    if (!validateUuid(payload.roomId)) {
      socket.emit(ServerEventsEnum.ERROR, 'room not found');
      LoggerHelper.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
      return;
    }

    const { voter, room } = joinRoom(clientId, payload);

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
