import { VoterType, RoomType } from '../types';

export class RoomFactory {
  public static create(voter: VoterType, id: string): RoomType {
    return {
      id,
      voters: [voter],
      votes: [],
    };
  }
}
