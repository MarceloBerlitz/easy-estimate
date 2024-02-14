import { Socket } from "socket.io";

import { rooms } from "../rooms";
import { ServerEventsEnum } from "@ee/lib";

type Payload = {
  roomId: string;
};

export const deleteVotesHandler = (socket: Socket, payload: Payload) => {
  const room = rooms.find((room) => room.id === payload.roomId);

  room.votes = [];
  delete room.computedVotes;

  room.voters.forEach((voter) => {
    socket.to(voter.id).emit(ServerEventsEnum.VOTES_DELETED);
  });
};
