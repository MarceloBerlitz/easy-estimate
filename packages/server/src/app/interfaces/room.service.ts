import { RoomType, VoterType } from '@ee/lib';

export interface RoomService {
  getRooms(): RoomType[];
  getRoom(roomId: string): RoomType | undefined;
  addRoom(room: RoomType): void;
  removeRoom(roomIndex: number): void;
  getVoter(room: RoomType, voterId?: string): VoterType | undefined;
  addVoter(room: RoomType, voter: VoterType): void;
  removeVoter(room: RoomType, voterIndex: number): void;
  removeVotersVotes(room: RoomType, voterId: string): void;
  updateComputedVotes(room: RoomType): void;
  getRoomsCount(): number;
  nobodyIsConnected(room: RoomType): boolean;
}
