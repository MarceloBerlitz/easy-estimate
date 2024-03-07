import { HidePayload, ServerEventsEnum } from '@ee/lib';

import { ClientEventManager } from '../interfaces/client-event-manager';
import { RoomService } from '../interfaces/room.service';
import { UseCase } from '../interfaces/use-case';

export default class HideUseCase implements UseCase<HidePayload, void> {
  private service: RoomService;
  private eventManager: ClientEventManager;
  private clientId: string;

  public constructor({
    roomService,
    eventManager,
    clientId,
  }: {
    roomService: RoomService;
    eventManager: ClientEventManager;
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
