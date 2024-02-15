import { useSocket } from "../../hooks/Socket/useSocket";

export const Home = () => {
  const { socket, isConnected } = useSocket();

  const connect = () => {
    if (!isConnected) {
      socket.connect();
    }
  };

  return (
    <div>
      <button onClick={connect}>connect</button>
    </div>
  );
};
