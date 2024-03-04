import { VoteMadePayload, VotePayload } from '@ee/lib';

import { UseCase } from '../../interfaces/use-case';

export class VoteUseCase implements UseCase<VotePayload, VoteMadePayload> {
  public execute(payload: VotePayload): VoteMadePayload {
    throw new Error('Method not implemented.');
  }
}
