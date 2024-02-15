import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Socket, io } from "socket.io-client";
import { useRoom } from "../Room/useRoom";
import {
  ComputedVotesType,
  RoomType,
  ServerEventsEnum,
  VoterType,
} from "@ee/lib";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../enums/routes.enum";

const SocketContext = React.createContext<{
  socket?: Socket;
  isConnected?: boolean;
}>({});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { setRoom, setVoter } = useRoom();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);

  const socket = useMemo(
    () =>
      io(
        process.env.NODE_ENV === "development" ? "http://localhost:3333" : "",
        {
          autoConnect: false,
        }
      ),
    []
  );

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      const voterId = socket.id;
      console.log(`Voter connected on Client with id: ${voterId}`);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log(`Voter disconnected`);
    });

    socket.on(ServerEventsEnum.ERROR, (payload) => {
      alert(JSON.stringify(payload));
    });

    socket.on(
      ServerEventsEnum.ROOM_CREATED,
      ({ room, voter }: { room: RoomType; voter: VoterType }) => {
        setRoom(room);
        setVoter(voter);
        navigate(RoutesEnum.ROOM.replace(":roomId", room.id));
      }
    );

    socket.on(
      ServerEventsEnum.VOTE_MADE,
      ({
        voters,
        computedVotes,
      }: {
        voters: VoterType[];
        computedVotes?: ComputedVotesType;
      }) => {
        setRoom((prev) => ({ ...(prev as RoomType), voters, computedVotes }));
      }
    );

    socket.on(
      ServerEventsEnum.VOTER_JOINED,
      ({ voters, computedVotes }): void => {
        setRoom((prev) => ({ ...(prev as RoomType), voters, computedVotes }));
      }
    );

    socket.on(ServerEventsEnum.POINTS_REVEALED, ({ computedVotes }) => {
      setRoom((prev) => ({ ...(prev as RoomType), computedVotes }));
    });

    socket.on(ServerEventsEnum.POINTS_HIDDEN, () => {
      setRoom((prev) => ({ ...(prev as RoomType), computedVotes: undefined }));
    });

    socket.on(ServerEventsEnum.VOTES_DELETED, () => {
      setRoom((prev) => ({
        ...(prev as RoomType),
        votes: [],
        computedVotes: undefined,
        voters: prev!.voters.map((voter) => ({ ...voter, hasVoted: false })),
      }));
    });

    socket.on(
      ServerEventsEnum.VOTER_DISCONNECTED,
      ({
        leavingVoter,
        voters,
        computedVotes
      }: {
        leavingVoter: VoterType;
        voters: VoterType[];
        computedVotes?: ComputedVotesType;
      }) => {
        setRoom((prev) => ({
          ...(prev as RoomType),
          votes: prev!.votes.filter(
            (vote) => vote.voter.id !== leavingVoter.id
          ),
          voters,
          computedVotes,
        }));
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): { socket: Socket; isConnected?: boolean } => {
  const { socket, isConnected } = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket hook must be within a SocketProvider");
  }
  return { socket, isConnected };
};
