import { ComputedVotesType } from '../../computed-votes.type';
import { VoterType } from '../../voter.type';

export type LoggedOutPayload = {
  logoutVoter: VoterType;
  voters: VoterType[];
  computedVotes?: ComputedVotesType;
};
