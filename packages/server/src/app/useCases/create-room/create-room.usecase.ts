import { CreateRoomPayload, RoomCreatedPayload } from '@ee/lib';

import { UseCase } from '../../interfaces/use-case';
import { CreateRoomService } from './interfaces/create-room-service';
import { LoggerService } from '../../interfaces/logger-service';
import { VoterFactory } from '../../factories/voter.factory';
import { RoomFactory } from '../../factories/room.factory';

type Dependencies = {
  roomService: CreateRoomService;
  loggerService: LoggerService;
  clientId: string;
};

export class CreateRoomUseCase implements UseCase<CreateRoomPayload, RoomCreatedPayload> {
  private service: CreateRoomService;
  private clientId: string;

  public constructor({ roomService, clientId }: Dependencies) {
    this.service = roomService;
    this.clientId = clientId;
  }

  public execute(payload: CreateRoomPayload): RoomCreatedPayload {
    const voter = VoterFactory.create(this.clientId, payload.name);
    const room = RoomFactory.create(voter);

    this.service.createRoom(room);

    return { room, voter };
  }
}
