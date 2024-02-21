import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ClientEventsEnum, ServerEventsEnum, VOTE_PARAMETERS_OPTIONS, VoteType } from '@ee/lib';

import { useRoom } from '../../hooks/Room/useRoom';
import { useSocket } from '../../hooks/Socket/useSocket';
import { RoutesEnum } from '../../enums/routes.enum';
import { VoteHelper } from './partials/VoteHelper/VoteHelper';
import { Voters } from './partials/Voters/Voters';
import { DisplayNameInput } from './partials/DisplayNameInput/DisplayNameInput';
import { CenteredWrapper } from '../../components/CenteredWrapper';
import { CustomButton } from '../../components/CustomButton';
import { ButtonsGroup } from '../../components/ButtonsGroup';

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
    socket.on(ServerEventsEnum.VOTES_DELETED, () => {
      setCurrentVote(emptyVote);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onJoinHandler = useCallback((name: string) => {
    socket.connect();
    const voter = { id: socket.id!, name };
    setVoter(voter);
    setRoom({ id: roomIdParam!, voters: [], votes: [] });
    socket.emit(ClientEventsEnum.JOIN_ROOM, { name, roomId: roomIdParam });
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

  return !room ? (
    <CenteredWrapper>
      <DisplayNameInput onJoin={onJoinHandler} />
    </CenteredWrapper>
  ) : (
    <div>
      <header>
        <h1>{voter?.name}</h1>
        <CustomButton type="button" onClick={leaveHandler}>
          leave
        </CustomButton>
      </header>
      <br />
      <VoteHelper
        currentVote={currentVote}
        onVoteChange={voteChangeHandler}
        allParametersSelected={allParametersSelected}
      />
      <br />
      <ButtonsGroup>
        <CustomButton type="button" disabled={!allParametersSelected} onClick={voteHandler}>
          vote
        </CustomButton>
        {!room?.computedVotes ? (
          <CustomButton type="button" disabled={!hasVotes} onClick={revealHandler}>
            reveal
          </CustomButton>
        ) : (
          <CustomButton type="button" onClick={hideHandler}>
            hide
          </CustomButton>
        )}
        <CustomButton type="button" onClick={deleteVotesHandler}>
          clear votes
        </CustomButton>
      </ButtonsGroup>

      <Voters />
      <br />
      <h3>DEBUG</h3>
      <div>{JSON.stringify(room)}</div>
    </div>
  );
};
