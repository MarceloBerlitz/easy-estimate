import { RoomType, VoterType } from '@ee/lib';

import { ComputedVotesMapper } from '../mappers/computed-votes.mapper';

export class RoomServiceImpl {
  private rooms: RoomType[] = [];

  public constructor() {}

  public getRooms(): RoomType[] {
    return this.rooms;
  }

  public getRoom(roomId: string): RoomType | undefined {
    return this.rooms.find((room) => room.id === roomId);
  }

  public addRoom(room: RoomType): void {
    this.rooms.push(room);
  }

  public removeRoom(roomIndex: number): void {
    this.rooms.splice(roomIndex, 1);
  }

  public getVoter(room: RoomType, voterId?: string): VoterType | undefined {
    if (!voterId) {
      return;
    }
    return room.voters.find((voter) => voter.id === voterId);
  }
  public addVoter(room: RoomType, voter: VoterType): void {
    room.voters.push(voter);
  }

  public removeVoter(room: RoomType, voterIndex: number): void {
    room.voters.splice(voterIndex, 1);
  }

  public removeVotersVotes(room: RoomType, voterId: string): void {
    room.votes = room.votes.filter((vote) => vote.voter.id !== voterId);
    this.updateComputedVotes(room);
  }

  public updateComputedVotes(room: RoomType): void {
    if (room.computedVotes) {
      room.computedVotes = ComputedVotesMapper.mapFromVotes(room.votes);
    }
  }

  public getRoomsCount(): number {
    return this.rooms.length;
  }

  public nobodyIsConnected(room: RoomType): boolean {
    return room.voters.every((voter) => !voter.clientId);
  }
}
