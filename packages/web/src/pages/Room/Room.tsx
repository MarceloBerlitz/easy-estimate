import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Col, Modal, Row, Spin, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

import {
  ClientEventsEnum,
  PointsRevealedPayload,
  ServerEventsEnum,
  VoteType,
  VotesDeletedPayload,
} from '@ee/lib';

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
import { RoomWrapper } from './styles';

type Props = {
  isDarkMode: boolean;
  onDarkModeChange: React.Dispatch<React.SetStateAction<string>>;
};

export const Room: React.FC<Props> = ({ isDarkMode, onDarkModeChange }) => {
  const { room, voter, setVoter, setRoom } = useRoom();
  const { socket, isConnected, isLoading } = useSocket();
  const { roomId: roomIdParam } = useParams();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const hasVoted = useMemo(() => {
    return room?.voters?.find((v) => v.id === voter.id)?.hasVoted ?? false;
  }, [room, voter]);

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
    const votesDeletedHandler = ({ voter: v }: VotesDeletedPayload) => {
      setCurrentVote(emptyVote);
      api.open({
        message: 'Votes Cleared',
        description: `${v.name} cleared all votes.`,
        icon: <SmileOutlined style={{ color: '#5636ff' }} />,
        duration: 10,
      });
    };

    const pointsRevealedHandler = ({ voter: v }: PointsRevealedPayload) => {
      api.open({
        message: 'Points Revealed',
        description: `${v.name} revealed the results.`,
        icon: <SmileOutlined style={{ color: '#5636ff' }} />,
        duration: 10,
      });
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

    socket.on(ServerEventsEnum.VOTES_DELETED, votesDeletedHandler);
    socket.on(ServerEventsEnum.POINTS_REVEALED, pointsRevealedHandler);
    socket.on('connect', connectHandler);

    if (!isConnected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', connectHandler);
      socket.off(ServerEventsEnum.POINTS_REVEALED, pointsRevealedHandler);
      socket.off(ServerEventsEnum.VOTES_DELETED, votesDeletedHandler);
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
    return room?.voters?.some((v) => v.hasVoted) ?? false;
  }, [room?.voters]);

  const voteChangeHandler = useCallback(
    (vote: Partial<VoteType>) => {
      setCurrentVote(vote);

      if (Object.keys(vote).length === 0 && hasVoted) {
        socket.emit(ClientEventsEnum.VOTE, { roomId: room!.id, voterId: voter.id });
      }
    },
    [room, socket, voter, hasVoted]
  );

  const leaveHandler = useCallback(() => {
    if (voter.id) {
      socket.emit(ClientEventsEnum.LOGOUT, { roomId: room.id, voterId: voter.id });
    }
    setRoom({});
    navigate(RoutesEnum.HOME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected, room, voter]);

  const linkCopiedHandler = useCallback(() => {
    api.open({
      message: 'Room Link Copied',
      description: `Room link has been copied to the clipboard.`,
      icon: <SmileOutlined style={{ color: '#5636ff' }} />,
      duration: 5,
    });
  }, [api]);

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
      {contextHolder}
      <Header name={voter.name} isDarkMode={isDarkMode} onDarkModeChange={onDarkModeChange} />
      <RoomWrapper>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <SubHeader roomId={room.id} onLeave={leaveHandler} onLinkCopied={linkCopiedHandler} />
          </Col>
          <Col xs={24} sm={24} md={12} lg={13} xl={14}>
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <VotingBoard
                  currentVote={currentVote}
                  hasVoted={hasVoted}
                  onVoteChange={voteChangeHandler}
                  onVote={voteHandler}
                />
              </Col>
              <Col xs={24}>
                <VoteDetails computedVotes={room.computedVotes} />
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={12} lg={11} xl={10}>
            <Results
              hasVotes={hasVotes}
              onReveal={revealHandler}
              onHide={hideHandler}
              onDelete={deleteVotesHandler}
            />
          </Col>
        </Row>
      </RoomWrapper>
      {/* <h3>DEBUG</h3>
      <div style={{ maxWidth: 600 }}>{JSON.stringify(room)}</div> */}
    </Spin>
  );
};
