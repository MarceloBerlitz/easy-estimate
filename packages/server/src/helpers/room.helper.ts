import { RoomType, VoterType } from '@ee/lib';

import { rooms } from '../rooms';
import { ComputedVotesMapper } from '../mappers/computed-votes.mapper';

export class RoomHelper {
  public static getRoom(roomId: string): RoomType | undefined {
    return rooms.find((room) => room.id === roomId);
  }

  public static addRoom(room: RoomType): void {
    rooms.push(room);
  }

  public static removeRoom(roomIndex: number): void {
    rooms.splice(roomIndex, 1);
  }

  public static getVoter(room: RoomType, voterId?: string): VoterType | undefined {
    if (!voterId) {
      return;
    }
    return room.voters.find((voter) => voter.id === voterId);
  }
  public static addVoter(room: RoomType, voter: VoterType): void {
    room.voters.push(voter);
  }

  public static removeVoter(room: RoomType, voterIndex: number): void {
    room.voters.splice(voterIndex, 1);
  }

  public static removeVotersVotes(room: RoomType, voterId: string): void {
    room.votes = room.votes.filter((vote) => vote.voter.id !== voterId);
    RoomHelper.updateComputedVotes(room);
  }

  public static updateComputedVotes(room: RoomType): void {
    if (room.computedVotes) {
      room.computedVotes = ComputedVotesMapper.mapFromVotes(room.votes);
    }
  }

  public static getRoomsCount(): number {
    return rooms.length;
  }

  public static nobodyIsConnected(room: RoomType): boolean {
    return room.voters.every((voter) => !voter.clientId);
  }
}
