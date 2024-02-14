import { Socket } from "socket.io";

import { ServerEventsEnum } from "@ee/lib";

import { rooms } from "../rooms";
import { VoterFactory } from "../factories/voter.factory";

type Payload = {
  voterName: string;
  roomId: string;
};

export const joinRoomHandler = (
  socket: Socket,
  voterId: string,
  payload: Payload
) => {
  const newVoter = VoterFactory.create(voterId, payload.voterName);
  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    socket.to(voterId).emit(ServerEventsEnum.ERROR, "room not found");
  }

  room.voters.push(newVoter);

  room.voters.forEach((voter) => {
    socket.to(voter.id).emit(ServerEventsEnum.VOTER_JOINED, voter);
  });
};
