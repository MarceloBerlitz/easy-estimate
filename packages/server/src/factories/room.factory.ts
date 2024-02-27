import { v4 as uuid } from 'uuid';

import { RoomType, VoterType } from '@ee/lib';

export class RoomFactory {
  public static create(voter: VoterType): RoomType {
    return {
      id: uuid(),
      voters: [voter],
      votes: [],
    };
  }
}
