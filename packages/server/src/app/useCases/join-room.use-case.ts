import {
  JoinRoomPayload,
  RoomFactory,
  RoomType,
  ServerEventsEnum,
  VoterFactory,
  VoterType,
} from '@ee/lib';

import { LoggerService } from '../../infra/logging/logger.service';
import { ValidationError } from '../errors/validation.error';
import { Logger } from '../interfaces/logger';
import { RoomEventManager } from '../interfaces/room-event-manager';
import { RoomService } from '../interfaces/room.service';
import { UseCase } from '../interfaces/use-case';
import { IdService } from '../interfaces/id.service';

export default class JoinRoomUseCase implements UseCase<JoinRoomPayload, void> {
  private clientId: string;
  private service: RoomService;
  private logger: Logger;
  private idService: IdService;
  private eventManager: RoomEventManager;

  public constructor({
    clientId,
    roomService,
    logger,
    idService,
    eventManager,
  }: {
    clientId: string;
    roomService: RoomService;
    logger: LoggerService;
    idService: IdService;
    eventManager: RoomEventManager;
  }) {
    this.clientId = clientId;
    this.service = roomService;
    this.logger = logger;
    this.idService = idService;
    this.eventManager = eventManager;
  }

  public execute(payload: JoinRoomPayload): void {
    if (!this.idService.validate(payload.roomId)) {
      throw new ValidationError('Invalid room id');
    }

    const { room, voter } = this.joinRoom(payload);

    this.eventManager.join(room.id);
    this.eventManager.to(room.id).emit(ServerEventsEnum.VOTER_JOINED, {
      voter,
      voters: room.voters,
      computedVotes: room.computedVotes,
    });
  }

  private joinRoom(payload: JoinRoomPayload): {
    room: RoomType;
    voter: VoterType;
  } {
    const room = this.service.getRoom(payload.roomId);

    // Room does not exist, create a new room and a new voter
    if (!room) {
      this.logger.info('room not found. creating room.');
      const newVoter = VoterFactory.create(
        this.clientId,
        payload.name,
        payload.voterId ?? this.idService.generate()
      );
      const newRoom = RoomFactory.create(newVoter, payload.roomId);
      this.service.addRoom(newRoom);

      return { room: newRoom, voter: newVoter };
    }

    const voter = this.service.getVoter(room, payload.voterId);
    // Voter already exists in the room, update the clientId
    if (voter) {
      voter.clientId = this.clientId;
      return { room, voter };
    }

    // Voter does not exist, add a new voter
    const newVoter = VoterFactory.create(
      this.clientId,
      payload.name,
      payload.voterId ?? this.idService.generate()
    );
    this.service.addVoter(room, newVoter);
    return { room, voter: newVoter };
  }
}
