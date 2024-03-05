import { JoinRoomPayload, RoomFactory, RoomType, VoterFactory, VoterType } from '@ee/lib';

import { UseCase } from '../interfaces/use-case';
import { RoomService } from '../services/room.service';
import { LoggerService } from '../../infra/logging/logger.service';
import { Logger } from '../interfaces/logger';

type JoinRoomUseCaseResult = {
  room: RoomType;
  voter: VoterType;
};

export class JoinRoomUseCase implements UseCase<JoinRoomPayload, JoinRoomUseCaseResult> {
  private clientId: string;
  private service: RoomService;
  private logger: Logger;

  public constructor({
    clientId,
    roomService,
    loggerService,
  }: {
    clientId: string;
    roomService: RoomService;
    loggerService: LoggerService;
  }) {
    this.clientId = clientId;
    this.service = roomService;
    this.logger = loggerService;
  }

  public execute(payload: JoinRoomPayload): JoinRoomUseCaseResult {
    const room = this.service.getRoom(payload.roomId);

    // Room does not exist, create a new room and a new voter
    if (!room) {
      this.logger.info('room not found. creating room.');
      const newVoter = VoterFactory.create(this.clientId, payload.name, payload.voterId);
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
    const newVoter = VoterFactory.create(this.clientId, payload.name, payload.voterId);
    this.service.addVoter(room, newVoter);
    return { room, voter: newVoter };
  }
}
