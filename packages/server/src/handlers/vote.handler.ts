import { Socket } from "socket.io";

import { ServerEventsEnum, VoteType, VoterType } from "@ee/lib";

import { rooms } from "../rooms";

type Payload = {
    roomId: string,
    vote: VoteType
}

export const voteHandler = (
  socket: Socket,
  voterId: string,
  payload: Payload
) => {

  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    socket.to(voterId).emit(ServerEventsEnum.ERROR, "room not found");
  }

  const currentVoteIndex = room.votes.findIndex(vote => vote.voter.id === voterId);

  if (currentVoteIndex >= 0) {
    room.votes.splice(currentVoteIndex, 1);
  }

  room.votes.push(payload.vote);


//   room.computedVotes = {
    
//   }

  room.voters.forEach((voter) => {
    socket.to(voter.id).emit(ServerEventsEnum.VOTE_MADE));
  });
};
