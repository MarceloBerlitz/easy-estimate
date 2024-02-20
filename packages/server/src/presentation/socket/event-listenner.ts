import { Server, Socket } from 'socket.io';

import { ClientEventsEnum } from '@ee/lib';

import { disconnectedHandler } from '../../handlers/disconnected.handler';
import { CreateRoomPayload, createRoomHandler } from '../../handlers/create-room.handler';
import { JoinRoomPayload, joinRoomHandler } from '../../handlers/join-room.handler';
import { VotePayload, voteHandler } from '../../handlers/vote.handler';
import { RevealPayload, revealHandler } from '../../handlers/reveal.handler';
import { DeleteVotesPayload, deleteVotesHandler } from '../../handlers/delete-votes.handler';
import { HidePayload, hideHandler } from '../../handlers/hide.handler';

export class EventListenner {
  public static listen(io: Server): void {
    io.on('connection', (socket: Socket) => {
      const voterId = socket.id;
      console.log(`[event received] <connection> clientId: ${voterId}`);

      socket.on(ClientEventsEnum.CREATE_ROOM, (payload: CreateRoomPayload) =>
        createRoomHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.JOIN_ROOM, (payload: JoinRoomPayload) =>
        joinRoomHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.VOTE, (payload: VotePayload) =>
        voteHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.REVEAL, (payload: RevealPayload) =>
        revealHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.HIDE, (payload: HidePayload) =>
        hideHandler(socket, voterId, payload)
      );
      socket.on(ClientEventsEnum.DELETE_VOTES, (payload: DeleteVotesPayload) =>
        deleteVotesHandler(socket, voterId, payload)
      );
      socket.on('disconnect', () => disconnectedHandler(voterId));
    });
  }
}
