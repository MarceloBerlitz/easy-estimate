import {
  FibonacciStoryPointsEnum,
  VOTE_PARAMETERS_OPTIONS,
  VoteOptionEnum,
} from "../enums";
import { VoteType } from "../types";

const parametersSumToFibonacciMap: { [key: number]: FibonacciStoryPointsEnum } =
  {
    [3]: FibonacciStoryPointsEnum.ONE,
    [4]: FibonacciStoryPointsEnum.TWO,
    [5]: FibonacciStoryPointsEnum.THREE,
    [6]: FibonacciStoryPointsEnum.FIVE,
    [7]: FibonacciStoryPointsEnum.EIGHT,
    [8]: FibonacciStoryPointsEnum.THIRTEEN,
    [9]: FibonacciStoryPointsEnum.TWENTYONE,
  };

const voteOptionToValueMap = {
  [VoteOptionEnum.SMALL]: 1,
  [VoteOptionEnum.MEDIUM]: 2,
  [VoteOptionEnum.LARGE]: 3,
};

export class VoteMapper {
  public static mapVoteToStoryPoints(vote: VoteType): FibonacciStoryPointsEnum {
    const parametersSum = VOTE_PARAMETERS_OPTIONS.reduce(
      (sum, param) => sum + voteOptionToValueMap[vote[param]],
      0
    );

    return parametersSumToFibonacciMap[parametersSum];
  }
}
