import { Socket } from "socket.io";

import { ServerEventsEnum } from "@ee/lib";

import { VoterFactory } from "../factories/voter.factory";
import { RoomFactory } from "../factories/room.factory";
import { rooms } from "../rooms";

type Payload = { name: string };

export const createRoomHandler = (
  socket: Socket,
  voterId: string,
  payload: Payload
) => {

  if (!payload.name) {
    socket.to(voterId).emit(ServerEventsEnum.ERROR, "name is required");
    return;
  }

  const voter = VoterFactory.create(voterId, payload.name);
  const room = RoomFactory.create(voter);

  rooms.push(room);

  socket.to(voterId).emit(ServerEventsEnum.ROOM_CREATED, room);
};
