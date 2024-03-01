import express from 'express';
import http from 'http';
import * as dotenv from 'dotenv';

import { EnvironmentHelper } from '../helpers/environment.helper';

export class Server {
  private server: http.Server;

  public constructor() {
    dotenv.config({ path: `${__dirname}/../.env` });

    const app = express();
    this.server = http.createServer(app);

    if (!EnvironmentHelper.isLocal()) {
      const baseDir = `${__dirname}/public/`;
      app.use(express.static(baseDir));
      app.get('*', (_, res) => res.sendFile('index.html', { root: baseDir }));
    }
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
