import { RoomType } from '../../room.type';
import { VoterType } from '../../voter.type';

export type RoomCreatedPayload = { room: RoomType; voter: VoterType };
