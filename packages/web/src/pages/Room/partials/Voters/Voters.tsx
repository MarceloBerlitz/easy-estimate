import React from "react";

import { useRoom } from "../../../../hooks/Room/useRoom";

export const Voters: React.FC = () => {
  const { room } = useRoom();

  return (
    <div>
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
                  )?.storyPoints ?? "no"
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
