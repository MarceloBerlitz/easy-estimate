import { VoteParametersType } from "./vote-parameters.type";
import { VoterType } from "./voter.type";

export type VoteType = VoteParametersType & {
  voter: VoterType;
};
