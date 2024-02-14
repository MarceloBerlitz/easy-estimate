import { ComputedVotesType } from "@ee/lib";

export class ComputedVotesFactory {
  public static create(): ComputedVotesType {
    return {
      complexity: {
        small: 0,
        medium: 0,
        large: 0,
      },
      effort: {
        small: 0,
        medium: 0,
        large: 0,
      },
      risk: {
        small: 0,
        medium: 0,
        large: 0,
      },
      votes: [],
    };
  }
}
