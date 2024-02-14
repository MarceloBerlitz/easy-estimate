import { Socket } from "socket.io";

import {
  ComputedVotesParametersType,
  ComputedVotesType,
  ServerEventsEnum,
  VoteMapper,
  VoteOptionEnum,
} from "@ee/lib";

import { rooms } from "../rooms";
import { ComputedVotesFactory } from "../factories/computed-votes.factory";

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

export const revealHandler = (socket: Socket, payload: Payload) => {
  const room = rooms.find((room) => room.id === payload.roomId);

  const computedVotes: ComputedVotesType = room.votes.reduce((acc, cur) => {
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

  room.voters.forEach((voter) => {
    socket
      .to(voter.id)
      .emit(ServerEventsEnum.POINTS_REVEALED, { computedVotes });
  });
};
