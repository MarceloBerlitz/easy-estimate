import { RoomType, VoterType } from '@ee/lib';

import { rooms } from '../rooms';

export class RoomHelper {
  public static getRoom(roomId: string): RoomType | undefined {
    return rooms.find((room) => room.id === roomId);
  }

  public static addRoom(room: RoomType): void {
    rooms.push(room);
  }

  public static findVoter(room: RoomType, voterId: string): VoterType | undefined {
    return room.voters.find((voter) => voter.id === voterId);
  }
  public static addVoter(room: RoomType, voter: VoterType): void {
    room.voters.push(voter);
  }
}
