import { RoomType, VoterType } from '@ee/lib';

export interface JoinRoomService {
  getRoom(roomId: string): RoomType;
  addRoom(room: RoomType): void;
  getVoter(room: RoomType, voterId: string): VoterType;
  addVoter(room: RoomType, voter: VoterType): void;
}
