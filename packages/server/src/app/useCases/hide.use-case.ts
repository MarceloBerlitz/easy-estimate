import { HidePayload, ServerEventsEnum } from '@ee/lib';

import { UseCase } from '../interfaces/use-case';
import { RoomService } from '../interfaces/room.service';
import { RoomEventManager } from '../interfaces/room-event-manager';

export default class HideUseCase implements UseCase<HidePayload, void> {
  private service: RoomService;
  private eventManager: RoomEventManager;
  private clientId: string;

  public constructor({
    roomService,
    eventManager,
    clientId,
  }: {
    roomService: RoomService;
    eventManager: RoomEventManager;
    clientId: string;
  }) {
    this.service = roomService;
    this.eventManager = eventManager;
    this.clientId = clientId;
  }

  execute(payload: HidePayload): void {
    const room = this.service.getRoom(payload.roomId);

    if (!room) {
      throw new Error('room not found');
    }

    const voter = this.service.getVoter(room, payload.voterId);

    if (!voter) {
      throw new Error('voter not found');
    }

    if (!voter.clientId) {
      voter.clientId = this.clientId;
      this.eventManager.join(room.id);
    }

    delete room.computedVotes;

    this.eventManager.to(payload.roomId).emit(ServerEventsEnum.POINTS_HIDDEN);
  }
}
