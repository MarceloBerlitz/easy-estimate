import React, { ReactNode, useContext, useState } from "react";

import { RoomType } from "@ee/lib";

type SetRoomType = (room: RoomType) => void;

type RoomContextType = {
  room?: RoomType;
  setRoom: SetRoomType;
};

const RoomContext = React.createContext<Partial<RoomContextType>>({});

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomState, setRoomState] = useState();
  return (
    <RoomContext.Provider
      value={{
        room: roomState,
        setRoom: setRoomState as unknown as SetRoomType,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (!context.setRoom) {
    throw new Error("useRoom hook must be within a RoomProvider");
  }
  return { room: context.room, setRoom: context.setRoom! };
};
