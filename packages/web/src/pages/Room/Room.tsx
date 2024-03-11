import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Col, Modal, Row, Spin } from 'antd';

import { ClientEventsEnum, ServerEventsEnum, VoteType } from '@ee/lib';

import { CenteredWrapper } from '../../components/CenteredWrapper';
import { RoutesEnum } from '../../enums/routes.enum';
import { useRoom } from '../../hooks/Room/useRoom';
import { useSocket } from '../../hooks/Socket/useSocket';
import { DisplayNameInput } from './partials/DisplayNameInput/DisplayNameInput';
import { Header } from './partials/Header/Header';
import { Results } from './partials/Results/Results';
import { SubHeader } from './partials/SubHeader/SubHeader';
import { VoteDetails } from './partials/VoteDetails/VoteDetails';
import { VotingBoard } from './partials/VotingBoard/VotingBoard';

type Props = {
  isDarkMode: boolean;
  onDarkModeChange: React.Dispatch<React.SetStateAction<string>>;
};

export const Room: React.FC<Props> = ({ isDarkMode, onDarkModeChange }) => {
  const { room, voter, setVoter, setRoom } = useRoom();
  const { socket, isConnected, isLoading } = useSocket();
  const { roomId: roomIdParam } = useParams();
  const navigate = useNavigate();

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
    const votesDeleteHandler = () => {
      setCurrentVote(emptyVote);
    };

    const connectHandler = () => {
      const createdRightnow = localStorage.getItem('created');
      localStorage.setItem('created', '');
      if (!createdRightnow && room?.id === roomIdParam && voter.id && voter.name) {
        socket.emit(ClientEventsEnum.JOIN_ROOM, {
          name: voter.name,
          voterId: voter.id,
          roomId: roomIdParam,
        });
      }
    };

    socket.on(ServerEventsEnum.VOTES_DELETED, votesDeleteHandler);
    socket.on('connect', connectHandler);

    if (!isConnected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', connectHandler);
      socket.off(ServerEventsEnum.VOTES_DELETED, votesDeleteHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onJoinHandler = useCallback((name: string) => {
    const voter = { name, clientId: socket.id, id: '' };
    setVoter(voter);
    setRoom({ id: roomIdParam!, voters: [], votes: [] });
    socket.emit(ClientEventsEnum.JOIN_ROOM, { name, roomId: roomIdParam });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasVotes = useMemo(() => {
    return room?.voters?.some((voter) => voter.hasVoted) ?? false;
  }, [room?.voters]);

  const voteChangeHandler = useCallback((vote: Partial<VoteType>) => {
    setCurrentVote(vote);
  }, []);

  const leaveHandler = useCallback(() => {
    if (voter.id) {
      socket.emit(ClientEventsEnum.LOGOUT, { roomId: room.id, voterId: voter.id });
    }
    setRoom({});
    navigate(RoutesEnum.HOME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected, room, voter]);

  const voteHandler = useCallback(() => {
    socket.emit(ClientEventsEnum.VOTE, { roomId: room!.id, vote: currentVote, voterId: voter.id });
  }, [currentVote, socket, room, voter]);

  const revealHandler = useCallback(() => {
    socket.emit(ClientEventsEnum.REVEAL, { roomId: room!.id, voterId: voter.id });
  }, [socket, room, voter]);

  const hideHandler = useCallback(() => {
    socket.emit(ClientEventsEnum.HIDE, { roomId: room!.id, voterId: voter.id });
  }, [socket, room, voter]);

  const deleteVotesHandler = useCallback(() => {
    Modal.confirm({
      title: 'You are going to clear all votes. Are you sure?',
      onOk: () => {
        socket.emit(ClientEventsEnum.DELETE_VOTES, { roomId: room!.id, voterId: voter.id });
      },
    });
  }, [socket, room, voter]);

  return !room?.id ? (
    <CenteredWrapper>
      <DisplayNameInput onJoin={onJoinHandler} />
    </CenteredWrapper>
  ) : (
    <Spin spinning={isLoading}>
      <Header name={voter.name} isDarkMode={isDarkMode} onDarkModeChange={onDarkModeChange} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem 0', minHeight: '90vh' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <SubHeader roomId={room.id} onLeave={leaveHandler} />
          </Col>
          <Col xs={24} sm={24} md={12} lg={14}>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <VotingBoard
                  currentVote={currentVote}
                  onVoteChange={voteChangeHandler}
                  onVote={voteHandler}
                />
              </Col>
              <Col xs={24}>
                <VoteDetails computedVotes={room.computedVotes} />
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={12} lg={10}>
            <Results
              hasVotes={hasVotes}
              onReveal={revealHandler}
              onHide={hideHandler}
              onDelete={deleteVotesHandler}
            />
          </Col>
        </Row>
      </div>
      {/* <h3>DEBUG</h3>
      <div style={{ maxWidth: 600 }}>{JSON.stringify(room)}</div> */}
    </Spin>
  );
};
