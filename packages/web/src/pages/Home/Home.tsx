import { useCallback, useState } from 'react';

import { ClientEventsEnum } from '@ee/lib';

import { useSocket } from '../../hooks/Socket/useSocket';
import { useRoom } from '../../hooks/Room/useRoom';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { HomeWrapper } from './styles';

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
    <HomeWrapper>
      <h1>Easy Estimate</h1>
      <span>
        <CustomInput
          placeholder="Insert your display name"
          value={nameState}
          onChange={(e) => setNameState(e.currentTarget.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') createRoomHandler();
          }}
          size="big"
        />

        <CustomButton type="button" disabled={!nameState} onClick={createRoomHandler} size="big">
          Create a session
        </CustomButton>
      </span>
    </HomeWrapper>
  );
};
