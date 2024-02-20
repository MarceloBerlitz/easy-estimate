import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ClientEventsEnum, ServerEventsEnum, VOTE_PARAMETERS_OPTIONS, VoteType } from '@ee/lib';

import { useRoom } from '../../hooks/Room/useRoom';
import { useSocket } from '../../hooks/Socket/useSocket';
import { RoutesEnum } from '../../enums/routes.enum';
import { VoteHelper } from './partials/VoteHelper/VoteHelper';
import { Voters } from './partials/Voters/Voters';

export const Room = () => {
  const { room, voter, setVoter, setRoom } = useRoom();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();
  const { roomId: roomIdParam } = useParams();

  const emptyVote: Partial<VoteType> = useMemo(
    () => ({
      voter: {
        id: voter?.id ?? '',
        name: voter?.name ?? '',
      },
    }),
    [voter]
  );

  const [currentVote, setCurrentVote] = useState<Partial<VoteType>>(emptyVote);

  useEffect(() => {
    if (!room) {
      let name;
      do {
        name = prompt('Insert display name');
      } while (!name);
      socket.connect();
      const voter = { id: socket.id!, name };
      setVoter(voter);
      setRoom({ id: roomIdParam!, voters: [], votes: [] });
      socket.emit(ClientEventsEnum.JOIN_ROOM, { name, roomId: roomIdParam });
    }

    socket.on(ServerEventsEnum.VOTES_DELETED, () => {
      setCurrentVote(emptyVote);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allParametersSelected = useMemo(() => {
    return VOTE_PARAMETERS_OPTIONS.every((param) => !!currentVote[param]);
  }, [currentVote]);

  const hasVotes = useMemo(() => {
    return room?.voters.some((voter) => voter.hasVoted);
  }, [room?.voters]);

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
        <h1>{voter?.name}</h1>
        <button onClick={leaveHandler}>leave</button>
      </header>
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
        <button disabled={!hasVotes} onClick={revealHandler}>
          reveal
        </button>
      ) : (
        <button onClick={hideHandler}>hide</button>
      )}{' '}
      <br />
      <button onClick={deleteVotesHandler}>clear votes</button>
      <Voters />
      <br />
      <h3>DEBUG</h3>
      <div>{JSON.stringify(room)}</div>
    </div>
  );
};
