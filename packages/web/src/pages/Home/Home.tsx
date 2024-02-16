import { useCallback, useState } from "react";

import { ClientEventsEnum } from "@ee/lib";

import { useSocket } from "../../hooks/Socket/useSocket";

export const Home = () => {
  const [nameState, setNameState] = useState("");
  const { socket, isConnected } = useSocket();

  const createRoomHandler = useCallback(() => {
    if (!isConnected) {
      socket.connect();
    }
    socket.emit(ClientEventsEnum.CREATE_ROOM, { name: nameState });
  }, [socket, isConnected, nameState]);

  return (
    <div>
      <label>
        display name
        <input
          value={nameState}
          onChange={(e) => setNameState(e.currentTarget.value)}
        />
      </label>
      <button onClick={createRoomHandler}>create room</button>
    </div>
  );
};
