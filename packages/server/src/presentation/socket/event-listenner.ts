import { Server, Socket } from "socket.io";

import { ClientEventsEnum } from "@ee/lib";

import { disconnectedHandler } from "../../handlers/disconnected.handler";
import { createRoomHandler } from "../../handlers/create-room.handler";
import { joinRoomHandler } from "../../handlers/join-room.handler";
import { voteHandler } from "../../handlers/vote.handler";
import { revealHandler } from "../../handlers/reveal.handler";
import { deleteVotesHandler } from "../../handlers/delete-votes.handler";

export class EventListenner {
  public static listen(io: Server): void {
    io.on("connection", (socket: Socket) => {
      const voterId = socket.id;
      console.log(`[event received] <connection> clientId: ${voterId}`);

      socket.on(ClientEventsEnum.CREATE_ROOM, (payload) =>
        createRoomHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.JOIN_ROOM, (payload) =>
        joinRoomHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.VOTE, (payload) =>
        voteHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.REVEAL, (payload) =>
        revealHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.HIDE, (payload) => {
        
      })
      socket.on(ClientEventsEnum.DELETE_VOTES, (payload) =>
        deleteVotesHandler(socket, voterId, payload)
      );
      socket.on("disconnect", () => disconnectedHandler(voterId));
    });
  }
}
