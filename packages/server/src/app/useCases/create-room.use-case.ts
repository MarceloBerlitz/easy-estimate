import {
  CreateRoomPayload,
  RoomCreatedPayload,
  RoomFactory,
  ServerEventsEnum,
  VoterFactory,
} from '@ee/lib';

import { ValidationError } from '../errors/validation.error';
import { ClientEventManager } from '../interfaces/client-event-manager';
import { IdService } from '../interfaces/id.service';
import { RoomService } from '../interfaces/room.service';
import { UseCase } from '../interfaces/use-case';

type Dependencies = {
  roomService: RoomService;
  clientId: string;
  idService: IdService;
  eventManager: ClientEventManager;
};

export default class CreateRoomUseCase implements UseCase<CreateRoomPayload, void> {
  private service: RoomService;
  private clientId: string;
  private idService: IdService;
  private eventManager: ClientEventManager;

  public constructor({ roomService, clientId, idService, eventManager }: Dependencies) {
    this.service = roomService;
    this.clientId = clientId;
    this.idService = idService;
    this.eventManager = eventManager;
  }

  public execute(payload: CreateRoomPayload): void {
    if (!payload.name) {
      throw new ValidationError('Display name is required');
    }

    const voter = VoterFactory.create(this.clientId, payload.name, this.idService.generate());
    const room = RoomFactory.create(voter, this.idService.generate());

    this.service.addRoom(room);

    this.eventManager.join(room.id);
    this.eventManager.emit<RoomCreatedPayload>(ServerEventsEnum.ROOM_CREATED, { room, voter });
  }
}
