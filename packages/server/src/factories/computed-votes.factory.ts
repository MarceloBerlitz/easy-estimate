import { ComputedVotesType, VoteOptionEnum } from "@ee/lib";

const createParameter = () => {
  return {
    [VoteOptionEnum.SMALL]: 0,
    [VoteOptionEnum.MEDIUM]: 0,
    [VoteOptionEnum.LARGE]: 0,
  };
};

export class ComputedVotesFactory {
  public static create(): ComputedVotesType {
    return {
      complexity: createParameter(),
      effort: createParameter(),
      risk: createParameter(),
      votes: [],
    };
  }
}
