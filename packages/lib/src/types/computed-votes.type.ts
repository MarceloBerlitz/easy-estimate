import { FibonacciStoryPointsEnum, VoteOptionEnum, VoteParametersEnum } from '../enums';
import { VoterType } from './voter.type';

export type ComputedVotesParameterType = Record<VoteOptionEnum, number>;

export type ComputedVotesParametersType = Record<VoteParametersEnum, ComputedVotesParameterType>;

export type ComputedVotesType = ComputedVotesParametersType & {
  votes: {
    voter: VoterType;
    storyPoints: FibonacciStoryPointsEnum;
  }[];
};
