import { FibonacciStoryPointsEnum } from "../enums";
import { VoteType } from "../types";

const parametersToFibonacciMap: { [key: number]: FibonacciStoryPointsEnum } = {
  [3]: FibonacciStoryPointsEnum.ONE,
  [4]: FibonacciStoryPointsEnum.TWO,
  [5]: FibonacciStoryPointsEnum.THREE,
  [6]: FibonacciStoryPointsEnum.FIVE,
  [7]: FibonacciStoryPointsEnum.EIGHT,
  [8]: FibonacciStoryPointsEnum.THIRTEEN,
  [9]: FibonacciStoryPointsEnum.TWENTYONE,
};

export class VoteMapper {
  public static mapFrom(vote: VoteType): FibonacciStoryPointsEnum {
    const voteParametersValues = [vote.complexity, vote.effort, vote.risk];
    const parametersSum = voteParametersValues.reduce(
      (acc, cur) => acc + cur,
      0
    );
    return parametersToFibonacciMap[parametersSum];
  }
}
