import { Socket } from 'socket.io';
import { validate as validateUuid } from 'uuid';

import { ClientEventsEnum, JoinRoomPayload, RoomType, ServerEventsEnum, VoterType } from '@ee/lib';

import { VoterFactory } from '../factories/voter.factory';
import { RoomFactory } from '../factories/room.factory';
import { EventHandler } from '../interfaces/event-handler';
import { RoomService } from '../services/room.service';
import { LoggerService } from '../services/logger.service';
import { IO } from '../app/io';

export class JoinRoomHandler implements EventHandler {
  private logger: LoggerService;
  private io: IO;
  private roomService: RoomService;

  public event: ClientEventsEnum = ClientEventsEnum.JOIN_ROOM;

  public constructor({
    io,
    loggerService,
    roomService,
  }: {
    io: IO;
    roomService: RoomService;
    loggerService: LoggerService;
  }) {
    this.io = io;
    this.roomService = roomService;
    this.logger = loggerService;
  }

  public handle(socket: Socket, clientId: string, payload: JoinRoomPayload): void {
    this.logger.clientEvent(ClientEventsEnum.JOIN_ROOM, `clientId: ${clientId}`);

    try {
      if (!validateUuid(payload.roomId)) {
        socket.emit(ServerEventsEnum.ERROR, 'room not found');
        this.logger.serverEvent(ServerEventsEnum.ERROR, `room not found: ${payload.roomId}`);
        return;
      }

      const { voter, room } = this.joinRoom(clientId, payload);

      socket.join(room.id);

      this.io.to(room.id).emit(ServerEventsEnum.VOTER_JOINED, {
        voter,
        voters: room.voters,
        computedVotes: room.computedVotes,
      });

      this.logger.serverEvent(ServerEventsEnum.VOTER_JOINED, `roomId: ${room.id}`);
    } catch (error) {
      this.logger.unexpectedError(error);
    }
  }

  private joinRoom(
    clientId: string,
    payload: JoinRoomPayload
  ): { room: RoomType; voter: VoterType } {
    const room = this.roomService.getRoom(payload.roomId);

    // Room does not exist, create a new room and a new voter
    if (!room) {
      this.logger.getLogger().info('room not found. creating room.');
      const newVoter = VoterFactory.create(clientId, payload.name, payload.voterId);
      const newRoom = RoomFactory.create(newVoter, payload.roomId);
      this.roomService.addRoom(newRoom);
      this.logger.info('total rooms', `${this.roomService.getRoomsCount()}`);
      return { room: newRoom, voter: newVoter };
    }

    const voter = this.roomService.getVoter(room, payload.voterId);
    // Voter already exists in the room, update the clientId
    if (voter) {
      voter.clientId = clientId;
      return { room, voter };
    }

    // Voter does not exist, add a new voter
    const newVoter = VoterFactory.create(clientId, payload.name, payload.voterId);
    this.roomService.addVoter(room, newVoter);
    return { room, voter: newVoter };
  }
}
