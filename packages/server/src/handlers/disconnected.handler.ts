import { ServerEventsEnum } from "@ee/lib";

import { rooms } from "../rooms";
import { socket } from "..";

export const disconnectedHandler = (voterId: string) => {
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

  room.voters.forEach((voter) => {
    socket.to(voter.id).emit(ServerEventsEnum.VOTER_DISCONNECTED, leavingVoter);
  });
};
