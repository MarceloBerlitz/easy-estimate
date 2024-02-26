import { Server, Socket } from 'socket.io';

import { ClientEventsEnum } from '@ee/lib';

import { disconnectedHandler } from '../../handlers/disconnected.handler';
import { CreateRoomPayload, createRoomHandler } from '../../handlers/create-room.handler';
import { JoinRoomPayload, joinRoomHandler } from '../../handlers/join-room.handler';
import { VotePayload, voteHandler } from '../../handlers/vote.handler';
import { RevealPayload, revealHandler } from '../../handlers/reveal.handler';
import { DeleteVotesPayload, deleteVotesHandler } from '../../handlers/delete-votes.handler';
import { HidePayload, hideHandler } from '../../handlers/hide.handler';
import { LogoutPayload, logoutHandler } from '../../handlers/logout.handler';
import { LoggerHelper } from '../../helpers/logger.helper';

export class EventListenner {
  public static listen(io: Server): void {
    io.on('connection', (socket: Socket) => {
      const clientId = socket.id;
      LoggerHelper.clientEvent('connection', `clientId: ${clientId}`);
      LoggerHelper.info('total clients', `${io.sockets.sockets.size}`);

      socket.on(ClientEventsEnum.CREATE_ROOM, (payload: CreateRoomPayload) =>
        createRoomHandler(socket, clientId, payload)
      );
      socket.on(ClientEventsEnum.JOIN_ROOM, (payload: JoinRoomPayload) =>
        joinRoomHandler(socket, clientId, payload)
      );
      socket.on(ClientEventsEnum.VOTE, (payload: VotePayload) =>
        voteHandler(socket, clientId, payload)
      );
      socket.on(ClientEventsEnum.REVEAL, (payload: RevealPayload) =>
        revealHandler(socket, clientId, payload)
      );
      socket.on(ClientEventsEnum.HIDE, (payload: HidePayload) =>
        hideHandler(socket, clientId, payload)
      );
      socket.on(ClientEventsEnum.DELETE_VOTES, (payload: DeleteVotesPayload) =>
        deleteVotesHandler(socket, clientId, payload)
      );
      socket.on(ClientEventsEnum.LOGOUT, (payload: LogoutPayload) => {
        logoutHandler(clientId, payload);
      });
      socket.on('disconnect', () => disconnectedHandler(clientId));
    });
  }
}
