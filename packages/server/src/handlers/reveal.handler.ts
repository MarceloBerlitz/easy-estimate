import { Socket } from "socket.io";

import {
  ClientEventsEnum,
  ServerEventsEnum,
} from "@ee/lib";

import { rooms } from "../rooms";
import { socket } from "..";
import { ComputedVotesMapper } from "../mappers/computed-votes.mapper";

type Payload = {
  roomId: string;
};

export const revealHandler = (
  io: Socket,
  voterId: string,
  payload: Payload
) => {
  console.log(
    `[event received] <${ClientEventsEnum.REVEAL}> clientId: ${voterId}`
  );

  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    io.emit(ServerEventsEnum.ERROR, "room not found");
    return;
  }

  if (!room.computedVotes) {
    room.computedVotes = ComputedVotesMapper.mapFromVotes(room.votes);
  }

  socket
    .to(room.id)
    .emit(ServerEventsEnum.POINTS_REVEALED, {
      computedVotes: room.computedVotes,
    });

  console.log(
    `[event sent] <${ServerEventsEnum.POINTS_REVEALED}> roomId: ${room.id}`
  );
};
