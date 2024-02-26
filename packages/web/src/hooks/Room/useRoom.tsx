import React, { ReactNode, useContext, useEffect, useState } from 'react';

import { RoomType, VoterType } from '@ee/lib';

type RoomContextType = {
  room: Partial<RoomType>;
  voter: VoterType;
  setRoom: React.Dispatch<React.SetStateAction<Partial<RoomType>>>;
  setVoter: React.Dispatch<React.SetStateAction<VoterType>>;
};

const RoomContext = React.createContext<RoomContextType>({
  voter: { name: '', id: '' },
  room: {} as any,
  setRoom: () => {},
  setVoter: () => {},
});

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomState, setRoomState] = useState<Partial<RoomType>>(
    JSON.parse(localStorage.getItem('room') ?? '{}')
  );
  const [voterState, setVoterState] = useState<VoterType>(
    JSON.parse(localStorage.getItem('voter') ?? '{}')
  );

  useEffect(() => {
    localStorage.setItem('voter', JSON.stringify(voterState));
  }, [voterState]);

  useEffect(() => {
    localStorage.setItem('room', JSON.stringify(roomState));
  }, [roomState]);

  return (
    <RoomContext.Provider
      value={{
        room: roomState,
        setRoom: setRoomState,
        voter: voterState,
        setVoter: setVoterState,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (!context.setRoom || !context.setVoter) {
    throw new Error('useRoom hook must be within a RoomProvider');
  }
  return {
    room: context.room,
    voter: context.voter,
    setRoom: context.setRoom,
    setVoter: context.setVoter,
  };
};
