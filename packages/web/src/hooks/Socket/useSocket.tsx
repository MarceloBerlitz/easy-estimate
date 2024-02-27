import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Socket, io } from 'socket.io-client';
import { Modal } from 'antd';

import {
  LoggedOutPayload,
  PointsRevealedPayload,
  RoomCreatedPayload,
  ServerEventsEnum,
  VoteMadePayload,
  VoterDisconnectedPayload,
  VoterJoinedPayload,
  ClientEventsEnum,
} from '@ee/lib';

import { useRoom } from '../Room/useRoom';
import { RoutesEnum } from '../../enums/routes.enum';

const SocketContext = React.createContext<{
  socket?: Socket;
  isConnected?: boolean;
  isLoading?: boolean;
}>({});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { setRoom, setVoter } = useRoom();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const socket = useMemo(
    () =>
      io(process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : '', {
        autoConnect: false,
      }),
    []
  );

  useEffect(() => {
    const connectHandler = () => {
      setIsConnected(true);
      setIsLoading(false);
      const voterId = socket.id;
      console.log(`Voter connected on Client with id: ${voterId}`);
    };

    const disconnectHandler = () => {
      setIsConnected(false);
      console.log(`Voter disconnected`);
    };

    const errorHandler = (payload: any) => {
      Modal.error({ title: JSON.stringify(payload) });
    };

    const roomCreatedHandler = ({ room, voter }: RoomCreatedPayload) => {
      setRoom(room);
      setVoter(voter);
      navigate(RoutesEnum.ROOM.replace(':roomId', room.id));
    };

    const voteMadeHandler = ({ voters, computedVotes }: VoteMadePayload) => {
      setRoom((prev) => ({ ...prev, voters, computedVotes }));
    };
    const voterJoinedHandler = ({ voter, voters, computedVotes }: VoterJoinedPayload): void => {
      setRoom((prev) => ({ ...prev, voters, computedVotes }));
      if (voter.clientId === socket.id) {
        setVoter((prev) => ({ ...prev, id: voter.id }));
      }
    };
    const pointsRevealedHandler = ({ computedVotes }: PointsRevealedPayload) => {
      setRoom((prev) => ({ ...prev, computedVotes }));
    };

    const pointsHiddenHandler = () => {
      setRoom((prev) => ({ ...prev, computedVotes: undefined }));
    };

    const votesDeletedHandler = () => {
      setRoom((prev) => ({
        ...prev,
        votes: [],
        computedVotes: undefined,
        voters: prev!.voters?.map((voter) => ({ ...voter, hasVoted: false })),
      }));
    };

    const loggedOutHandler = ({ logoutVoter, voters, computedVotes }: LoggedOutPayload) => {
      setRoom((prev) => ({
        ...prev,
        votes: prev!.votes!.filter((vote) => vote.voter.id !== logoutVoter.id),
        voters,
        computedVotes,
      }));
    };

    const voterDisconnectedHandler = ({ voters, computedVotes }: VoterDisconnectedPayload) => {
      setRoom((prev) => ({
        ...prev,
        voters,
        computedVotes,
      }));
    };

    socket.on('connect', connectHandler);
    socket.on('disconnect', disconnectHandler);
    socket.on(ServerEventsEnum.ERROR, errorHandler);
    socket.on(ServerEventsEnum.ROOM_CREATED, roomCreatedHandler);
    socket.on(ServerEventsEnum.VOTE_MADE, voteMadeHandler);
    socket.on(ServerEventsEnum.VOTER_JOINED, voterJoinedHandler);
    socket.on(ServerEventsEnum.POINTS_REVEALED, pointsRevealedHandler);
    socket.on(ServerEventsEnum.POINTS_HIDDEN, pointsHiddenHandler);
    socket.on(ServerEventsEnum.VOTES_DELETED, votesDeletedHandler);
    socket.on(ServerEventsEnum.LOGGED_OUT, loggedOutHandler);
    socket.on(ServerEventsEnum.VOTER_DISCONNECTED, voterDisconnectedHandler);

    socket.onAnyOutgoing((evt) => {
      if (evt !== ClientEventsEnum.LOGOUT) {
        setIsLoading(true);
      }
    });

    socket.onAny(() => {
      setIsLoading(false);
    });

    return () => {
      socket.off('connect', connectHandler);
      socket.off('disconnect', disconnectHandler);
      socket.off(ServerEventsEnum.ERROR, errorHandler);
      socket.off(ServerEventsEnum.ROOM_CREATED, roomCreatedHandler);
      socket.off(ServerEventsEnum.VOTE_MADE, voteMadeHandler);
      socket.off(ServerEventsEnum.VOTER_JOINED, voterJoinedHandler);
      socket.off(ServerEventsEnum.POINTS_REVEALED, pointsRevealedHandler);
      socket.off(ServerEventsEnum.POINTS_HIDDEN, pointsHiddenHandler);
      socket.off(ServerEventsEnum.VOTES_DELETED, votesDeletedHandler);
      socket.off(ServerEventsEnum.LOGGED_OUT, loggedOutHandler);
      socket.off(ServerEventsEnum.VOTER_DISCONNECTED, voterDisconnectedHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        isLoading,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): { socket: Socket; isConnected?: boolean; isLoading?: boolean } => {
  const { socket, isConnected, isLoading } = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket hook must be within a SocketProvider');
  }
  return { socket, isConnected, isLoading };
};
