import { Socket } from "socket.io";

import { rooms } from "../rooms";
import { socket } from "..";
import { ClientEventsEnum, ServerEventsEnum } from "@ee/lib";

type Payload = {
  roomId: string;
};

export const hideHandler = (io: Socket, voterId: string, payload: Payload) => {
  console.log(
    `[event received] <${ClientEventsEnum.HIDE}> clientId: ${voterId}`
  );

  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    io.emit(ServerEventsEnum.ERROR, "room not found");
    return;
  }

  socket.to(room.id).emit(ServerEventsEnum.POINTS_HIDDEN);

  console.log(
    `[event sent] <${ServerEventsEnum.POINTS_HIDDEN}> roomId: ${room.id}`
  );
};
