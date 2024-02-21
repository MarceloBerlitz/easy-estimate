import { useCallback, useState } from 'react';

import { ClientEventsEnum } from '@ee/lib';

import { useSocket } from '../../hooks/Socket/useSocket';
import { useRoom } from '../../hooks/Room/useRoom';
import { CenteredWrapper } from '../../components/CenteredWrapper';
import { Button, Input, Space } from 'antd';

export const Home = () => {
  const { getSavedName } = useRoom();
  const [nameState, setNameState] = useState(getSavedName());
  const { socket, isConnected } = useSocket();

  const createRoomHandler = useCallback(() => {
    if (!nameState) {
      return;
    }

    if (!isConnected) {
      socket.connect();
    }
    socket.emit(ClientEventsEnum.CREATE_ROOM, { name: nameState });
  }, [socket, isConnected, nameState]);

  return (
    <CenteredWrapper>
      <h1>Easy Estimate</h1>
      <span>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Insert your display name"
            value={nameState}
            onChange={(e) => setNameState(e.currentTarget.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') createRoomHandler();
            }}
            size="large"
          />
          <Button type="primary" disabled={!nameState} onClick={createRoomHandler} size="large">
            Submit
          </Button>
        </Space.Compact>
      </span>
    </CenteredWrapper>
  );
};
