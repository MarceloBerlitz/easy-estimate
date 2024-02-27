import { ComputedVotesType } from '../../computed-votes.type';
import { VoterType } from '../../voter.type';

export type VoterJoinedPayload = {
  voter: VoterType;
  voters: VoterType[];
  computedVotes: ComputedVotesType;
};
