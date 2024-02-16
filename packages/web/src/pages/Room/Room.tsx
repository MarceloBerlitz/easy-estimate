import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ClientEventsEnum, VoteType } from "@ee/lib";

import { useRoom } from "../../hooks/Room/useRoom";
import { useSocket } from "../../hooks/Socket/useSocket";
import { RoutesEnum } from "../../enums/routes.enum";
import { VoteOptionSelector } from "./partials/VoteOptionSelector/VoteOptionSelector";
import { PointsPreview } from "./partials/PointsPreview/PointsPreview";
import { VoteHelper } from "./partials/VoteHelper/VoteHelper";

export const Room = () => {
  const { room, voter, setVoter, setRoom } = useRoom();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  const { roomId: roomIdParam } = useParams();

  const [currentVote, setCurrentVote] = useState<Partial<VoteType>>({
    voter: {
      id: voter?.id ?? "",
      name: voter?.name ?? "",
    },
  });

  useEffect(() => {
    if (!room) {
      let name;
      do {
        name = prompt("Insert display name");
      } while (!name);
      socket.connect();
      const voter = { id: socket.id!, name };
      setVoter(voter);
      setRoom({ id: roomIdParam!, voters: [], votes: [] });
      socket.emit(ClientEventsEnum.JOIN_ROOM, { name, roomId: roomIdParam });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allParametersSelected = useMemo(() => {
    return (
      !!currentVote.complexity && !!currentVote.effort && !!currentVote.risk
    );
  }, [currentVote]);

  const voteChangeHandler = useCallback((vote: Partial<VoteType>) => {
    setCurrentVote(vote);
  }, []);

  const leaveHandler = useCallback(() => {
    if (isConnected) {
      socket.disconnect();
    }
    navigate(RoutesEnum.HOME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected]);

  const voteHandler = useCallback(() => {
    socket.emit(ClientEventsEnum.VOTE, { roomId: room!.id, vote: currentVote });
  }, [currentVote, socket, room]);

  const revealHandler = useCallback(() => {
    socket.emit(ClientEventsEnum.REVEAL, { roomId: room!.id });
  }, [socket, room]);

  const hideHandler = useCallback(() => {
    socket.emit(ClientEventsEnum.HIDE, { roomId: room!.id });
  }, [socket, room]);

  const deleteVotesHandler = useCallback(() => {
    socket.emit(ClientEventsEnum.DELETE_VOTES, { roomId: room!.id });
  }, [socket, room]);

  return !room ? null : (
    <div>
      <header>
        <button onClick={leaveHandler}>leave</button>
      </header>
      <div>{JSON.stringify(room)}</div>
      <br />
      <VoteHelper
        currentVote={currentVote}
        onVoteChange={voteChangeHandler}
        allParametersSelected={allParametersSelected}
      />
      <br />
      <button disabled={!allParametersSelected} onClick={voteHandler}>
        vote
      </button>
      <br />
      {!room?.computedVotes ? (
        <button onClick={revealHandler}>reveal</button>
      ) : (
        <button onClick={hideHandler}>hide</button>
      )}{" "}
      <br />
      <button onClick={deleteVotesHandler}>delete votes</button>
      <h2>voters</h2>
      <div>
        {room?.voters.map((voter) => {
          if (room.computedVotes) {
            return (
              <span key={voter.id}>
                {voter.name} - vote:{" "}
                {
                  room.computedVotes.votes.find(
                    (vote) => vote.voter.id === voter.id
                  )?.storyPoints
                }{" "}
                <br />
              </span>
            );
          }
          return (
            <span key={voter.id}>
              {voter.name} - votou: {voter.hasVoted ? "yes" : "no"} <br />
            </span>
          );
        })}
      </div>
    </div>
  );
};
