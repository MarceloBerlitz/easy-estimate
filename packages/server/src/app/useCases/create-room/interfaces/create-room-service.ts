import { RoomType } from '@ee/lib';

export interface CreateRoomService {
  createRoom(room: RoomType): void;
}
