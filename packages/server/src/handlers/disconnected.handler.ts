import { Socket } from "socket.io";

import { ServerEventsEnum } from "@ee/lib";

import { rooms } from "../rooms";
import { socket } from "..";

export const disconnectedHandler = (voterId: string) => {
  console.log(`[event received] <disconnect> clientId: ${voterId}`);

  let voterIndex: number;
  const roomIndex = rooms.findIndex((room) => {
    voterIndex = room.voters.findIndex((voter) => voter.id === voterId);
    return voterIndex >= 0;
  });

  if (roomIndex < 0) {
    return;
  }

  const room = rooms[roomIndex];
  const leavingVoter = room.voters[voterIndex];

  room.voters.splice(voterIndex, 1);

  if (room.voters.length < 1) {
    rooms.splice(roomIndex, 1);
    return;
  }

  socket
    .to(room.id)
    .emit(ServerEventsEnum.VOTER_DISCONNECTED, { leavingVoter });

  console.log(
    `[event sent] <${ServerEventsEnum.VOTER_DISCONNECTED}> roomId: ${room.id}`
  );
};
