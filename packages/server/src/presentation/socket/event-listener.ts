import { Server, Socket } from 'socket.io';

import {
  ClientEventsEnum,
  CreateRoomPayload,
  DeleteVotesPayload,
  HidePayload,
  JoinRoomPayload,
  LogoutPayload,
  RevealPayload,
  VotePayload,
} from '@ee/lib';

import { disconnectedHandler } from '../../handlers/disconnected.handler';
import { createRoomHandler } from '../../handlers/create-room.handler';
import { joinRoomHandler } from '../../handlers/join-room.handler';
import { voteHandler } from '../../handlers/vote.handler';
import { revealHandler } from '../../handlers/reveal.handler';
import { deleteVotesHandler } from '../../handlers/delete-votes.handler';
import { hideHandler } from '../../handlers/hide.handler';
import { logoutHandler } from '../../handlers/logout.handler';
import { LoggerHelper } from '../../helpers/logger.helper';

export class EventListener {
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
        logoutHandler(socket, clientId, payload);
      });
      socket.on('disconnect', () => disconnectedHandler(clientId));
    });
  }
}
