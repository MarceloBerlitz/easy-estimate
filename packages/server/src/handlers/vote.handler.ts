import { Socket } from "socket.io";

import {
  ServerEventsEnum,

  VoteOptionEnum,
} from "@ee/lib";

import { rooms } from "../rooms";

type Payload = {
  roomId: string;
  vote: {
    complexity: VoteOptionEnum;
    effort: VoteOptionEnum;
    risk: VoteOptionEnum;
  };
};

export const voteHandler = (
  socket: Socket,
  voterId: string,
  payload: Payload
) => {
  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    socket.to(voterId).emit(ServerEventsEnum.ERROR, "room not found");
    return;
  }

  const currentVoteIndex = room.votes.findIndex(
    (vote) => vote.voter.id === voterId
  );

  if (currentVoteIndex >= 0) {
    room.votes.splice(currentVoteIndex, 1);
  }

  const voter = room.voters.find((voter) => voter.id === voterId);

  room.votes.push({ ...payload.vote, voter });

  const votersThatVoted = room.votes.map((vote) => ({ voter: vote.voter }));

  room.voters.forEach((voter) => {
    socket.to(voter.id).emit(ServerEventsEnum.VOTE_MADE, {
      votersThatVoted,
    });
  });
};
