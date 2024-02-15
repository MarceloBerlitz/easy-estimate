import { ComputedVotesParametersType, ComputedVotesType, VoteMapper, VoteOptionEnum, VoteType } from "@ee/lib";

import { ComputedVotesFactory } from "../factories/computed-votes.factory";

export class ComputedVotesMapper {

    private static sumParameterVote (
        parameter: ComputedVotesParametersType,
        parameterKey: VoteOptionEnum
      ): ComputedVotesParametersType {
        return {
          ...parameter,
          [parameterKey]: parameter[parameterKey] + 1,
        };
      };

    public static mapFromVotes(votes: VoteType[]): ComputedVotesType {
        return votes.reduce((acc, cur) => {
            return {
              votes: acc.votes.concat([
                {
                  voter: cur.voter,
                  storyPoints: VoteMapper.mapVoteToStoryPoints(cur),
                },
              ]),
              complexity: this.sumParameterVote(acc.complexity, cur.complexity),
              effort: this.sumParameterVote(acc.effort, cur.effort),
              risk: this.sumParameterVote(acc.risk, cur.risk),
            };
          }, ComputedVotesFactory.create());
    }
}