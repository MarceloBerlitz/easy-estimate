import { Socket } from "socket.io";

import { ServerEventsEnum, VoterRolesEnum } from "@ee/lib";

import { VoterFactory } from "../factories/voter.factory";
import { RoomFactory } from "../factories/room.factory";
import { rooms } from "../rooms";

type Payload = { name: string }

export const createRoomHandler = (socket: Socket, voterId: string, payload: Payload) => {
    const voter = VoterFactory.create(voterId, payload.name, VoterRolesEnum.HOST);
    const room = RoomFactory.create(voter);

    rooms.push(room);

    socket.emit(ServerEventsEnum.ROOM_CREATED, room)
}