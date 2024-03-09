import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  CopyOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LogoutOutlined,
  MoonOutlined,
  SaveOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Col, Modal, Row, Space, Spin, Switch, Typography } from 'antd';

import { ClientEventsEnum, ServerEventsEnum, VOTE_PARAMETERS_OPTIONS, VoteType } from '@ee/lib';

import { ButtonsGroup } from '../../components/ButtonsGroup';
import { CenteredWrapper } from '../../components/CenteredWrapper';
import { RoutesEnum } from '../../enums/routes.enum';
import { useRoom } from '../../hooks/Room/useRoom';
import { useSocket } from '../../hooks/Socket/useSocket';
import { DisplayNameInput } from './partials/DisplayNameInput/DisplayNameInput';
import { ParamsCharts } from './partials/ParamsCharts/ParamsCharts';
import { Results } from './partials/Results/Results';
import { VoteHelper } from './partials/VoteHelper/VoteHelper';
import { CustomCard, CustomHeader } from './styles';

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

  const allParametersSelected = useMemo(() => {
    return VOTE_PARAMETERS_OPTIONS.every((param) => !!currentVote[param]);
  }, [currentVote]);

  const hasVotes = useMemo(() => {
    return room?.voters?.some((voter) => voter.hasVoted);
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
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <CustomHeader>
            <Space>
              <Avatar style={{ backgroundColor: '#1c6ed2', verticalAlign: 'middle' }} size="large">
                {voter?.name.substring(0, 1)}{' '}
              </Avatar>
              <Typography.Title level={2} style={{ margin: 'auto' }}>
                {voter?.name}
              </Typography.Title>
            </Space>
            <Space>
              <Switch
                defaultValue={isDarkMode}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                onChange={(checked) => onDarkModeChange(String(checked))}
              />
              <Button onClick={leaveHandler}>
                Leave
                <LogoutOutlined />
              </Button>
            </Space>
          </CustomHeader>
        </Col>

        <Col span={24}>
          <Typography>
            Room ID: {roomIdParam}{' '}
            <Button
              size="small"
              type="dashed"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              Copy room link
              <CopyOutlined />
            </Button>
          </Typography>
        </Col>

        <Col xs={24} sm={24} md={12}>
          <CustomCard
            title={
              <Typography.Title level={2} style={{ margin: 'auto' }}>
                Vote
              </Typography.Title>
            }
          >
            <VoteHelper
              currentVote={currentVote}
              onVoteChange={voteChangeHandler}
              allParametersSelected={allParametersSelected}
            />
            <ButtonsGroup>
              <Button
                disabled={!allParametersSelected}
                onClick={voteHandler}
                type="primary"
                icon={<SaveOutlined />}
              >
                Vote
              </Button>
            </ButtonsGroup>
          </CustomCard>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <CustomCard
            title={
              <Typography.Title level={2} style={{ margin: 'auto' }}>
                Results
              </Typography.Title>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Results />
              <ButtonsGroup>
                {!room?.computedVotes ? (
                  <Button
                    disabled={!hasVotes}
                    onClick={revealHandler}
                    type="primary"
                    icon={<EyeOutlined />}
                  >
                    Reveal
                  </Button>
                ) : (
                  <Button onClick={hideHandler} icon={<EyeInvisibleOutlined />}>
                    Hide
                  </Button>
                )}
                <Button onClick={deleteVotesHandler} type="link" icon={<DeleteOutlined />}>
                  Clear all votes
                </Button>
              </ButtonsGroup>
            </div>
          </CustomCard>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <CustomCard
            title={
              <Typography.Title level={2} style={{ margin: 'auto' }}>
                Details
              </Typography.Title>
            }
          >
            <ParamsCharts computedVotes={room.computedVotes} />
          </CustomCard>
        </Col>
      </Row>
      {/* <h3>DEBUG</h3>
      <div style={{ maxWidth: 600 }}>{JSON.stringify(room)}</div> */}
    </Spin>
  );
};
