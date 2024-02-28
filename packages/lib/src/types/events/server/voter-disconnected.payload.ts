import { ComputedVotesType } from '../../computed-votes.type';
import { VoterType } from '../../voter.type';

export type VoterDisconnectedPayload = {
  voters: VoterType[];
  computedVotes?: ComputedVotesType;
};
