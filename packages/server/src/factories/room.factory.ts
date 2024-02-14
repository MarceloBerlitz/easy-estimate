import { RoomType, VoterType } from "@ee/lib";

export class RoomFactory {
  public static create(voter: VoterType): RoomType {
    return {
      id: crypto.randomUUID(),
      voters: [voter],
      areVotesVisible: false,
    };
  }
}
