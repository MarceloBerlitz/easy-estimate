import { ServerEventsEnum, VoterRolesEnum } from "@ee/lib";

import { rooms } from "../rooms";
import { socket } from "..";
import { Server } from "socket.io";

export const disconnectedHandler = (id: string) => {
    let voterIndex: number;
    const roomIndex = rooms.findIndex(room => { 
        voterIndex = room.voters.findIndex(voter => voter.id === id);
        return (voterIndex >= 0); 
    });

    const room = rooms[roomIndex];
    const voter = room.voters[voterIndex];
    delete voter.currentVote;

    if (VoterRolesEnum.GUEST === voter.role) {
        room.voters.splice(voterIndex, 1);
    }

    if (VoterRolesEnum.HOST === voter.role) {
        rooms.splice(roomIndex, 1);
    }

    room.voters.forEach(vtr => {
        socket.to(vtr.id).emit(ServerEventsEnum.VOTER_DISCONNECTED, voter);
    });
}