import { v4 as uuid } from 'uuid';

import { VoterType, RoomType } from '../types';

export class RoomFactory {
  public static create(voter: VoterType, id?: string): RoomType {
    return {
      id: id ?? uuid(),
      voters: [voter],
      votes: [],
    };
  }
}
