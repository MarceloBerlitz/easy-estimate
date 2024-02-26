import crypto from 'crypto';

import { VoterType } from '@ee/lib';

export class VoterFactory {
  public static create(clientId: string, name: string): VoterType {
    return {
      id: crypto.randomUUID(),
      clientId,
      name,
    };
  }
}
