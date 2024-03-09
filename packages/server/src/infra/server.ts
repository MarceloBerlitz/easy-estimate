import express from 'express';
import http from 'http';
import path from 'path';
import * as dotenv from 'dotenv';

export class Server {
  private server: http.Server;

  public constructor() {
    dotenv.config({ path: '../../.env' });

    const app = express();
    this.server = http.createServer(app);

    const baseDir = path.join(__dirname, '../public');
    app.use(express.static(baseDir));
    app.get('*', (_, res) => res.sendFile('index.html', { root: baseDir }));
  }

  public get instance(): http.Server {
    return this.server;
  }

  public start(): void {
    const port = process.env.PORT || 3333;

    this.server.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  }
}
