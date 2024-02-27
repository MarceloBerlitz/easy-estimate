import { useCallback, useEffect, useState } from 'react';

import { Button, Input, Space, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import { ClientEventsEnum } from '@ee/lib';

import { useSocket } from '../../hooks/Socket/useSocket';
import { useRoom } from '../../hooks/Room/useRoom';
import { CenteredWrapper } from '../../components/CenteredWrapper';

export const Home = () => {
  const { voter } = useRoom();
  const [nameState, setNameState] = useState(voter.name);
  const { socket, isConnected, isLoading } = useSocket();

  useEffect(() => {
    localStorage.setItem('created', '');
    if (!isConnected) {
      socket.connect();
    }
  }, [isConnected, socket]);

  const createRoomHandler = useCallback(() => {
    if (!isConnected) {
      socket.connect();
    }
    if (!nameState) {
      return;
    }

    localStorage.setItem('created', 'true');
    socket.emit(ClientEventsEnum.CREATE_ROOM, { name: nameState });
  }, [socket, nameState, isConnected]);

  return (
    <CenteredWrapper>
      <Typography.Title level={1}>Easy Estimate</Typography.Title>
      <span>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Insert your display name"
            value={nameState}
            onChange={(e) => setNameState(e.currentTarget.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) createRoomHandler();
            }}
            size="large"
          />
          <Button
            type="primary"
            disabled={!nameState}
            onClick={createRoomHandler}
            size="large"
            loading={isLoading}
          >
            Create session
            <ArrowRightOutlined />
          </Button>
        </Space.Compact>
      </span>
    </CenteredWrapper>
  );
};
