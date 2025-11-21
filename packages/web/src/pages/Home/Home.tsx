import { useCallback, useEffect, useMemo, useState } from 'react';

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

  const disabled = useMemo(() => {
    return isLoading || !nameState || !nameState.trim();
  }, [isLoading, nameState])

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

    localStorage.setItem('created', 'true');
    socket.emit(ClientEventsEnum.CREATE_ROOM, { name: nameState.trim() });
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
              if (e.key === 'Enter' && !disabled) createRoomHandler();
            }}
            size="large"
          />
          <Button
            type="primary"
            disabled={disabled}
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
