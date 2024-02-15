import { Socket } from "socket.io-client";

import { socket } from "../../socket";
import React, { ReactNode, useContext } from "react";

const SocketContext = React.createContext<{
  socket?: Socket;
  isConnected?: boolean;
}>({});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected: socket.connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): { socket: Socket; isConnected?: boolean } => {
  const { socket, isConnected } = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket hook must be within a SocketProvider");
  }
  return { socket, isConnected };
};
