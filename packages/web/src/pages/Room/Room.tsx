import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Avatar, Button, Modal, Space } from 'antd';
import {
  CopyOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LogoutOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import { ClientEventsEnum, ServerEventsEnum, VOTE_PARAMETERS_OPTIONS, VoteType } from '@ee/lib';

import { useRoom } from '../../hooks/Room/useRoom';
import { useSocket } from '../../hooks/Socket/useSocket';
import { VoteHelper } from './partials/VoteHelper/VoteHelper';
import { Results } from './partials/Results/Results';
import { DisplayNameInput } from './partials/DisplayNameInput/DisplayNameInput';
import { CenteredWrapper } from '../../components/CenteredWrapper';
import { ButtonsGroup } from '../../components/ButtonsGroup';
import { CustomHeader } from './styles';
import { ParamsCharts } from './partials/ParamsCharts/ParamsCharts';

export const Room = () => {
  const { room, voter, setVoter, setRoom } = useRoom();
  const { socket, isConnected } = useSocket();
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
    if (!isConnected) {
      socket.connect();
    }

    socket.on(ServerEventsEnum.VOTES_DELETED, () => {
      setCurrentVote(emptyVote);
    });

    socket.on('connect', () => {
      const createdRightnow = localStorage.getItem('created');
      localStorage.setItem('created', '');
      if (!createdRightnow && room?.id === roomIdParam && voter.id && voter.name) {
        socket.emit(ClientEventsEnum.JOIN_ROOM, {
          name: voter.name,
          voterId: voter.id,
          roomId: roomIdParam,
        });
      }
    });

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
    socket.emit(ClientEventsEnum.LOGOUT, { roomId: room.id, voterId: voter.id });
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
    <div>
      <CustomHeader>
        <Space>
          <Avatar style={{ backgroundColor: '#1c6ed2', verticalAlign: 'middle' }} size="large">
            {voter?.name.substring(0, 1)}{' '}
          </Avatar>
          <h2>{voter?.name}</h2>
        </Space>
        <Button onClick={leaveHandler} danger>
          leave
          <LogoutOutlined />
        </Button>
      </CustomHeader>
      <p>
        Room ID: {roomIdParam}{' '}
        <Button size="small" onClick={() => navigator.clipboard.writeText(window.location.href)}>
          Copy link
          <CopyOutlined />
        </Button>
      </p>
      <br />
      <VoteHelper
        currentVote={currentVote}
        onVoteChange={voteChangeHandler}
        allParametersSelected={allParametersSelected}
      />
      <br />
      <ButtonsGroup>
        <Button
          disabled={!allParametersSelected}
          onClick={voteHandler}
          type="primary"
          icon={<SaveOutlined />}
        >
          vote
        </Button>
        {!room?.computedVotes ? (
          <Button
            disabled={!hasVotes}
            onClick={revealHandler}
            type="primary"
            icon={<EyeOutlined />}
          >
            reveal
          </Button>
        ) : (
          <Button onClick={hideHandler} icon={<EyeInvisibleOutlined />}>
            hide
          </Button>
        )}
        <Button onClick={deleteVotesHandler} danger type="primary" icon={<DeleteOutlined />}>
          clear votes
        </Button>
      </ButtonsGroup>

      <Results />
      <br />
      <ParamsCharts computedVotes={room.computedVotes} />
      {/* <h3>DEBUG</h3>
      <div style={{ maxWidth: 600 }}>{JSON.stringify(room)}</div> */}
    </div>
  );
};
