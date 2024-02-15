import { Socket } from "socket.io";

import { ClientEventsEnum, ServerEventsEnum, VoteOptionEnum } from "@ee/lib";

import { rooms } from "../rooms";
import { socket } from "..";

type Payload = {
  roomId: string;
  vote: {
    complexity: VoteOptionEnum;
    effort: VoteOptionEnum;
    risk: VoteOptionEnum;
  };
};

export const voteHandler = (
  io: Socket,
  voterId: string,
  payload: Payload
) => {
  console.log(
    `[event received] <${ClientEventsEnum.VOTE}> clientId: ${voterId}`
  );

  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    io.emit(ServerEventsEnum.ERROR, "room not found");
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

  const votersThatVoted = room.votes.map((vote) => vote.voter);

  socket.to(room.id).emit(ServerEventsEnum.VOTE_MADE, {
    votersThatVoted,
  });

  console.log(
    `[event received] <${ServerEventsEnum.VOTE_MADE}> roomId: ${room.id}`
  );
};
