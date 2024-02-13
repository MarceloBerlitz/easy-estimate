import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { EventListenner } from "./presentation/socket/event-listenner";

const app = express();
const server = http.createServer(app);
const socket = new Server(server);
EventListenner.listen(socket);
const port = process.env.PORT || 3333;

app.use(
  cors({
    origin: process.env.WEB_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.static("public"));

server.listen(port, () => {
  console.log("Listening on port " + port);
});

export { socket };
