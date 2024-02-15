import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ClientEventsEnum, VoteType } from "@ee/lib";

import { useRoom } from "../../hooks/Room/useRoom";
import { useSocket } from "../../hooks/Socket/useSocket";
import { RoutesEnum } from "../../enums/routes.enum";
import { VoteOptionSelector } from "./partials/VoteOptionSelector/VoteOptionSelector";
import { PointsPreview } from "./partials/PointsPreview/PointsPreview";

export const Room = () => {
  const { room, voter } = useRoom();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  const [localVote, setLocalVote] = useState<Partial<VoteType>>({
    voter: {
      id: voter!.id,
      name: voter!.name,
    },
  });

  const areAllSelected = useMemo(() => {
    return !!localVote.complexity && !!localVote.effort && !!localVote.risk;
  }, [localVote]);

  const leaveHandler = useCallback(() => {
    if (isConnected) {
      socket.disconnect();
    } else {
      navigate(RoutesEnum.HOME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const voteHandler = useCallback(() => {
    socket.emit(ClientEventsEnum.VOTE, { roomId: room!.id, vote: localVote });
  }, [localVote, socket, room]);

  const revealHandler = useCallback(() => {
    socket.emit(ClientEventsEnum.REVEAL, { roomId: room!.id });
  }, [socket, room]);

  useEffect(() => {
    if (!isConnected) {
      navigate(RoutesEnum.HOME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, navigate]);

  return (
    <div>
      <header>
        <button onClick={leaveHandler}>leave</button>
      </header>
      <div>{JSON.stringify(room)}</div>
      <div>
        <h2>Complexity</h2>
        <VoteOptionSelector
          parameter="complexity"
          onChange={(val) =>
            setLocalVote((prev) => ({ ...prev, complexity: val }))
          }
        />
      </div>
      <div>
        <h2>Effort</h2>
        <VoteOptionSelector
          parameter="effort"
          onChange={(val) => setLocalVote((prev) => ({ ...prev, effort: val }))}
        />
      </div>
      <div>
        <h2>Risk</h2>
        <VoteOptionSelector
          parameter="risk"
          onChange={(val) => setLocalVote((prev) => ({ ...prev, risk: val }))}
        />
      </div>
      <PointsPreview
        vote={localVote as VoteType}
        areAllSelected={areAllSelected}
      />{" "}
      <br />
      <button disabled={!areAllSelected} onClick={voteHandler}>
        vote
      </button>{" "}
      <br />
      <button onClick={revealHandler}>reveal</button> <br />
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
