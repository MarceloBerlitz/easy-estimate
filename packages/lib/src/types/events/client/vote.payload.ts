import { VoteParametersType } from '../../vote-parameters.type';

export type VotePayload = {
  voterId: string;
  roomId: string;
  vote: VoteParametersType;
};
