import { useCallback, useEffect } from "react";
import { useRoom } from "../../hooks/Room/useRoom";
import { useSocket } from "../../hooks/Socket/useSocket";
import { useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../enums/routes.enum";

export const Room = () => {
  const { room } = useRoom();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();

  const leaveHandler = useCallback(() => {
    if (isConnected) {
      socket.disconnect();
    } else {
      navigate(RoutesEnum.HOME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (!isConnected) {
      navigate(RoutesEnum.HOME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, navigate]);

  return (
    <div>
      <header>
        <button onClick={leaveHandler}>leave</button>
      </header>
      <div>{JSON.stringify(room)}</div>
    </div>
  );
};
