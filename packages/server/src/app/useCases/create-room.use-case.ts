import { CreateRoomPayload, RoomCreatedPayload } from '@ee/lib';

import { UseCase } from '../interfaces/use-case';
import { VoterFactory } from '../factories/voter.factory';
import { RoomFactory } from '../factories/room.factory';
import { RoomService } from '../services/room.service';

type Dependencies = {
  roomService: RoomService;
  clientId: string;
};

export class CreateRoomUseCase implements UseCase<CreateRoomPayload, RoomCreatedPayload> {
  private service: RoomService;
  private clientId: string;

  public constructor({ roomService, clientId }: Dependencies) {
    this.service = roomService;
    this.clientId = clientId;
  }

  public execute(payload: CreateRoomPayload): RoomCreatedPayload {
    const voter = VoterFactory.create(this.clientId, payload.name);
    const room = RoomFactory.create(voter);

    this.service.addRoom(room);

    return { room, voter };
  }
}
