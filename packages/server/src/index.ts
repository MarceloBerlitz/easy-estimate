import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import * as dotenv from 'dotenv';

import { EventListenner } from './presentation/socket/event-listenner';
import { EnvironmentHelper } from './helpers/environment.helper';
import { LoggerHelper } from './helpers/logger.helper';

const LOCAL_WEB_URL = '*';

dotenv.config({ path: __dirname + '/.env' });

LoggerHelper.createLogger();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: EnvironmentHelper.isLocal() ? LOCAL_WEB_URL : null },
});
EventListenner.listen(io);

const port = process.env.PORT || 3333;

const baseDir = `${__dirname}/public/`;

app.use(express.static(baseDir));

app.get('*', (_, res) => res.sendFile('index.html', { root: baseDir }));

server.listen(port, () => {
  LoggerHelper.getLogger().info({
    message: 'Listening on port ' + port,
    labels: { name: 'listening', type: 'info' },
  });
});

export { io };
