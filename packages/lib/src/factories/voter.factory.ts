import { VoterType } from '../types';

export class VoterFactory {
  public static create(clientId: string, name: string, id: string): VoterType {
    return {
      id,
      clientId,
      name,
    };
  }
}
