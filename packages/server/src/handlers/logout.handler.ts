import { Socket } from 'socket.io';

import { ClientEventsEnum, LogoutPayload, ServerEventsEnum } from '@ee/lib';

import { LoggerHelper } from '../helpers/logger.helper';
import { rooms } from '../rooms';
import { io } from '..';
import { RoomHelper } from '../helpers/room.helper';

const getVoterAndRoomIndexes = (clientId: string, voterId: string) => {
  let voterIndex: number;
  const roomIndex = rooms.findIndex((room) => {
    voterIndex = room.voters.findIndex(
      (voter) => voter.id === voterId || voter.clientId === clientId
    );
    return voterIndex >= 0;
  });

  return { voterIndex, roomIndex };
};

export const logoutHandler = (socket: Socket, clientId: string, payload: LogoutPayload) => {
  LoggerHelper.clientEvent(ClientEventsEnum.LOGOUT, `clientId: ${clientId}`);

  try {
    const { roomIndex, voterIndex } = getVoterAndRoomIndexes(clientId, payload.voterId);

    if (roomIndex < 0) {
      return;
    }

    const room = rooms[roomIndex];
    const logoutVoter = room.voters[voterIndex];
    RoomHelper.removeVoter(room, voterIndex);

    socket.leave(room.id);

    if (room.voters.length === 0) {
      RoomHelper.removeRoom(roomIndex);
      LoggerHelper.info('total rooms', `${rooms.length}`);
      return;
    }

    RoomHelper.removeVotersVotes(room, payload.voterId);

    io.to(room.id).emit(ServerEventsEnum.LOGGED_OUT, {
      logoutVoter,
      voters: room.voters,
      computedVotes: room.computedVotes,
    });

    LoggerHelper.serverEvent(ServerEventsEnum.LOGGED_OUT, `roomId: ${room.id}`);
  } catch (error) {
    LoggerHelper.unexpectedError(error);
  }
};
