import { Server, Socket } from "socket.io";

import { ClientEventsEnum } from "@ee/lib";

import { disconnectedHandler } from "../../handlers/disconnected.handler";
import { createRoomHandler } from "../../handlers/create-room.handler";

export class EventListenner {
    public static listen(io: Server): void {
        io.on('connection', (socket: Socket) => {
            const voterId = socket.id;
            console.log(`[event] connection (${voterId})`);
            
            socket.on(ClientEventsEnum.CREATE_ROOM, (payload) => createRoomHandler(socket, voterId, payload));

            socket.on('disconnect', () => disconnectedHandler(voterId));
        });
    }
}
