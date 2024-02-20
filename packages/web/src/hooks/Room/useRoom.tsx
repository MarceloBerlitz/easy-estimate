import React, { ReactNode, useContext, useState } from 'react';

import { RoomType, VoterType } from '@ee/lib';

type RoomContextType = {
  room?: RoomType;
  voter?: VoterType;
  setRoom: React.Dispatch<React.SetStateAction<RoomType | undefined>>;
  setVoter: React.Dispatch<React.SetStateAction<VoterType | undefined>>;
};

const RoomContext = React.createContext<Partial<RoomContextType>>({});

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomState, setRoomState] = useState<RoomType | undefined>();
  const [voterState, setVoterState] = useState<VoterType | undefined>();
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
