import { Socket } from "socket.io";

import { ClientEventsEnum, ServerEventsEnum, VoteOptionEnum } from "@ee/lib";

import { rooms } from "../rooms";
import { socket } from "..";
import { ComputedVotesMapper } from "../mappers/computed-votes.mapper";

type Payload = {
  roomId: string;
  vote: {
    complexity: VoteOptionEnum;
    effort: VoteOptionEnum;
    risk: VoteOptionEnum;
  };
};

export const voteHandler = (io: Socket, voterId: string, payload: Payload) => {
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

  voter.hasVoted = true;

  if (room.computedVotes) {
    room.computedVotes = ComputedVotesMapper.mapFromVotes(room.votes);
  }

  socket.to(room.id).emit(ServerEventsEnum.VOTE_MADE, {
    voters: room.voters,
    ...(room.computedVotes ? { computedVotes: room.computedVotes } : {}),
  });

  console.log(
    `[event sent] <${ServerEventsEnum.VOTE_MADE}> roomId: ${room.id}`
  );
};
