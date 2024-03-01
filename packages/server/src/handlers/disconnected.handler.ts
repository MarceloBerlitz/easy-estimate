import { ServerEventsEnum } from '@ee/lib';

import { rooms } from '../rooms';
import { io } from '..';
import { LoggerHelper } from '../helpers/logger.helper';
import { RoomHelper } from '../helpers/room.helper';

const getVoterAndRoomIndexes = (clientId: string) => {
  let voterIndex: number;
  const roomIndex = rooms.findIndex((room) => {
    voterIndex = room.voters.findIndex((voter) => voter.clientId === clientId);
    return voterIndex >= 0;
  });

  return { voterIndex, roomIndex };
};

export const disconnectedHandler = (clientId: string) => {
  LoggerHelper.clientEvent('disconnect', `clientId: ${clientId}`);
  LoggerHelper.info('total clients', `${io.sockets.sockets.size}`);

  try {
    const { voterIndex, roomIndex } = getVoterAndRoomIndexes(clientId);

    if (roomIndex < 0) {
      return;
    }

    const room = rooms[roomIndex];
    const disconnectedVoter = room.voters[voterIndex];

    disconnectedVoter.clientId = null;

    if (RoomHelper.nobodyIsConnected(room)) {
      RoomHelper.removeRoom(roomIndex);
      LoggerHelper.info('total rooms', `${rooms.length}`);
      return;
    }

    io.to(room.id).emit(ServerEventsEnum.VOTER_DISCONNECTED, {
      voters: room.voters,
      computedVotes: room.computedVotes,
    });

    LoggerHelper.serverEvent(
      ServerEventsEnum.VOTER_DISCONNECTED,
      `clientId: ${disconnectedVoter.clientId}`
    );
  } catch (error) {
    LoggerHelper.unexpectedError(error);
  }
};
