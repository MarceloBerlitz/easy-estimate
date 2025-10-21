import { ComputedVotesMapper, RoomType, VoterType } from '@ee/lib';

import { Logger } from '../interfaces/logger';
import { RoomService } from '../interfaces/room.service';

export class RoomServiceImpl implements RoomService {
  private rooms: RoomType[] = [];
  private logger: Logger;

  public constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
  }

  public getRooms(): RoomType[] {
    return this.rooms;
  }

  public getRoom(roomId: string): RoomType | undefined {
    return this.rooms.find((room) => room.id === roomId);
  }

  public addRoom(room: RoomType): void {
    this.rooms.push(room);
    this.logger.info(`${this.rooms.length}`, 'total rooms');
  }

  public removeRoom(roomIndex: number): void {
    this.rooms.splice(roomIndex, 1);
    this.logger.info(`${this.rooms.length}`, 'total rooms');
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

  public nobodyIsConnected(room: RoomType): boolean {
    return room.voters.every((voter) => !voter.clientId);
  }
}
