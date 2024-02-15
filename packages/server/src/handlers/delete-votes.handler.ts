import { Socket } from "socket.io";

import { rooms } from "../rooms";
import { ClientEventsEnum, ServerEventsEnum } from "@ee/lib";
import { socket } from "..";

type Payload = {
  roomId: string;
};

export const deleteVotesHandler = (
  io: Socket,
  voterId: string,
  payload: Payload
) => {
  console.log(
    `[event received] <${ClientEventsEnum.DELETE_VOTES}> clientId: ${voterId}`
  );

  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    io.emit(ServerEventsEnum.ERROR, "room not found");
    return;
  }

  room.votes = [];
  room.voters.forEach(voter => {
    voter.hasVoted = false;
  })
  delete room.computedVotes;  

  socket.to(room.id).emit(ServerEventsEnum.VOTES_DELETED);

  console.log(
    `[event sent] <${ServerEventsEnum.VOTES_DELETED}> roomId: ${room.id}`
  );
};
