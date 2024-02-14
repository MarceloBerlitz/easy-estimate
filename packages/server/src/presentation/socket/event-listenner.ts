import { Server, Socket } from "socket.io";

import { ClientEventsEnum } from "@ee/lib";

import { disconnectedHandler } from "../../handlers/disconnected.handler";
import { createRoomHandler } from "../../handlers/create-room.handler";
import { joinRoomHandler } from "../../handlers/join-room.handler";
import { voteHandler } from "../../handlers/vote.handler";
import { revealHandler } from "../../handlers/reveal.handler";

export class EventListenner {
  public static listen(io: Server): void {
    io.on("connection", (socket: Socket) => {
      const voterId = socket.id;
      console.log(`[event] connection (${voterId})`);

      socket.on(ClientEventsEnum.CREATE_ROOM, (payload) =>
        createRoomHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.JOIN_ROOM, (payload) =>
        joinRoomHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.VOTE, (payload) =>
        voteHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.REVEAL, () =>
        revealHandler(socket, voterId)
      );

      socket.on("disconnect", () => disconnectedHandler(voterId));
    });
  }
}
