import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv';
import { EventListener } from './presentation/socket/event-listener';
import { EnvironmentHelper } from './helpers/environment.helper';
import { LoggerHelper } from './helpers/logger.helper';

dotenv.config({ path: __dirname + '/.env' });

LoggerHelper.createLogger();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: EnvironmentHelper.isLocal() ? '*' : null },
});

EventListener.listen(io);

const port = process.env.PORT || 3333;
const baseDir = `${__dirname}/public/`;

app.use(express.static(baseDir));

app.get('*', (_, res) => res.sendFile('index.html', { root: baseDir }));

server.listen(port, () => {
  LoggerHelper.getLogger().info({
    message: `Listening on port ${port}`,
    labels: { name: 'listening', type: 'info' },
  });
});

export { io };
