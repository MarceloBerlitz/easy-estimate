import { io } from "socket.io-client";
const socket = io(
  process.env.NODE_ENV === "development" ? "http://localhost:3333" : "",
  {
    autoConnect: false,
  }
);

socket.on("connect", () => {
  const voterId = socket.id;
  console.log(`Player connected on Client with id: ${voterId}`);
});

export { socket };
