import { Socket } from "socket.io";

import { ClientEventsEnum, ServerEventsEnum } from "@ee/lib";

import { VoterFactory } from "../factories/voter.factory";
import { RoomFactory } from "../factories/room.factory";
import { rooms } from "../rooms";

type Payload = { name: string };

export const createRoomHandler = (
  socket: Socket,
  voterId: string,
  payload: Payload
) => {
  console.log(
    `[event received] <${ClientEventsEnum.CREATE_ROOM}> clientId: ${voterId}`
  );

  if (!payload.name) {
    socket.emit(ServerEventsEnum.ERROR, "name is required");

    console.log(
      `[event sent] <${ServerEventsEnum.ERROR}> "name is required"`
    );
    return;
  }

  const voter = VoterFactory.create(voterId, payload.name);
  const room = RoomFactory.create(voter);

  rooms.push(room);

  socket.join(room.id);

  socket.emit(ServerEventsEnum.ROOM_CREATED, { room });

  console.log(
    `[event sent] <${ServerEventsEnum.ROOM_CREATED}> clientId: ${voterId}`
  );
};
