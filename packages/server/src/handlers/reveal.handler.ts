import { Socket } from "socket.io";

import {
  ClientEventsEnum,
  ComputedVotesParametersType,
  ComputedVotesType,
  ServerEventsEnum,
  VoteMapper,
  VoteOptionEnum,
} from "@ee/lib";

import { rooms } from "../rooms";
import { ComputedVotesFactory } from "../factories/computed-votes.factory";
import { socket } from "..";

type Payload = {
  roomId: string;
};

const sumParameterVote = (
  parameter: ComputedVotesParametersType,
  parameterKey: VoteOptionEnum
): ComputedVotesParametersType => {
  return {
    ...parameter,
    [parameterKey]: parameter[parameterKey] + 1,
  };
};

export const revealHandler = (
  io: Socket,
  voterId: string,
  payload: Payload
) => {
  console.log(
    `[event received] <${ClientEventsEnum.REVEAL}> clientId: ${voterId}`
  );

  const room = rooms.find((room) => room.id === payload.roomId);

  if (!room) {
    io.emit(ServerEventsEnum.ERROR, "room not found");
    return;
  }

  if (!room.computedVotes) {
    room.computedVotes = room.votes.reduce((acc, cur) => {
      return {
        votes: acc.votes.concat([
          {
            voter: cur.voter,
            storyPoints: VoteMapper.mapVoteToStoryPoints(cur),
          },
        ]),
        complexity: sumParameterVote(acc.complexity, cur.complexity),
        effort: sumParameterVote(acc.effort, cur.effort),
        risk: sumParameterVote(acc.risk, cur.risk),
      };
    }, ComputedVotesFactory.create());
  }

  socket
    .to(room.id)
    .emit(ServerEventsEnum.POINTS_REVEALED, {
      computedVotes: room.computedVotes,
    });

  console.log(
    `[event sent] <${ServerEventsEnum.POINTS_REVEALED}> roomId: ${room.id}`
  );
};
