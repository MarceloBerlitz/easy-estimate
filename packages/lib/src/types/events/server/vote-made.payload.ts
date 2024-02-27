import { ComputedVotesType } from '../../computed-votes.type';
import { VoterType } from '../../voter.type';

export type VoteMadePayload = {
  voters: VoterType[];
  computedVotes?: ComputedVotesType;
};
