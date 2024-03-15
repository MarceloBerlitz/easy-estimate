import { VOTE_PARAMETERS_OPTIONS, VoteOptionEnum } from '../enums';
import { ComputedVotesFactory } from '../factories';
import {
  ComputedVotesParameterType,
  ComputedVotesParametersType,
  ComputedVotesType,
  VoteType,
} from '../types';
import { VoteMapper } from './vote.mapper';

export class ComputedVotesMapper {
  private static sumParameterVote(
    parameter: ComputedVotesParameterType,
    parameterKey: VoteOptionEnum
  ): ComputedVotesParameterType {
    return {
      ...parameter,
      [parameterKey]: parameter[parameterKey] + 1,
    };
  }

  public static mapFromVotes(votes: VoteType[]): ComputedVotesType {
    return votes.reduce((acc, cur) => {
      const paramsObj = VOTE_PARAMETERS_OPTIONS.reduce(
        (allParams, curParam) => ({
          ...allParams,
          [curParam]: this.sumParameterVote(acc[curParam], cur[curParam]),
        }),
        {} as ComputedVotesParametersType
      );

      return {
        votes: acc.votes.concat([
          {
            voter: cur.voter,
            storyPoints: VoteMapper.mapVoteToStoryPoints(cur),
          },
        ]),
        ...paramsObj,
      };
    }, ComputedVotesFactory.create());
  }
}
