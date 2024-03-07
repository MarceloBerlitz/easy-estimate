import { ClientEventsEnum } from '@ee/lib';

export const eventHandlers = {
  [ClientEventsEnum.CREATE_ROOM]: 'createRoomUseCase',
  [ClientEventsEnum.DELETE_VOTES]: 'deleteVotesUseCase',
  [ClientEventsEnum.HIDE]: 'hideUseCase',
  [ClientEventsEnum.JOIN_ROOM]: 'joinRoomUseCase',
  [ClientEventsEnum.LOGOUT]: 'logoutUseCase',
  [ClientEventsEnum.REVEAL]: 'revealUseCase',
  [ClientEventsEnum.VOTE]: 'voteUseCase',
  disconnect: 'disconnectedUseCase',
};

export class EventHandlers {
  public static getHandlerName(event: keyof typeof eventHandlers): string {
    return eventHandlers[event];
  }
}
