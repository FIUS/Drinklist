// @ts-ignore -- Required feature enabled in tsconfig.express.json
import express, {Request, Response} from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import {writeFileSync} from 'fs';
import {authPath, configPath, userSettingsPath} from '../main';
import {Socket} from 'net';

export function runSetupWebsite(): Promise<void> {
  return new Promise((resolve) => {
    const app = express();
    let server: http.Server;
    const sockets = new Set<Socket>();

    app.use(bodyParser.json());

    app.post('/config', (req: Request, res: Response) => {
      console.log(req.body);
      const {auth, config, settings} = req.body;
      config.port = parseInt(config.port);

      // Check validity
      let valid = true;
      valid &&= auth.admin;
      valid &&= auth.kiosk;
      valid &&= auth.admin !== auth.kiosk;

      valid &&= !isNaN(config.port);
      valid &&= config.port >= 1 && config.port <= 65535;

      valid &&= settings.title;
      valid &&= settings.currencySymbol;
      valid &&= settings.imprint !== undefined;
      valid &&= settings.dataProtection !== undefined;
      valid &&= settings.recentlyPurchased !== undefined;
      valid &&= settings.stock !== undefined;

      if (!valid) {
        return res.status(400).end();
      }

      config.version = 2;
      settings.version = 2;

      writeFileSync(userSettingsPath, JSON.stringify(settings));
      writeFileSync(configPath, JSON.stringify(config));
      writeFileSync(authPath, JSON.stringify(auth));

      res.status(204).end();

      server.close(() => {
        console.log('First Start page server closed!');
        resolve();
      });
      sockets.forEach(s => {
        s.destroy();
      });
    });

    app.get('/css/bootstrap.min.css', (req: Request, res: Response) => {
      res.sendFile(path.join(process.cwd(), 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'));
    });
    app.use(express.static(path.join(process.cwd(), 'dist', 'first-start-page')));

    app.use((req: Request, res: Response) => {
      res.sendStatus(404);
    });

    server = app.listen(8080, () => {
      console.log('First Start Page listening on http://localhost:8080');
    });

    server.on('connection', socket => {
      sockets.add(socket);

      socket.on('close', () => {
        sockets.delete(socket);
      });
    });
  });
}
