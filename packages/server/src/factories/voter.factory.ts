import { v4 as uuid } from 'uuid';

import { VoterType } from '@ee/lib';

export class VoterFactory {
  public static create(clientId: string, name: string): VoterType {
    return {
      id: uuid(),
      clientId,
      name,
    };
  }
}
