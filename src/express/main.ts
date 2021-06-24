/*
 * Web Server and API for Drinklist
 * --------------------------------
 * Author: Raphael Kienhöfer
 */
import {Server} from './server';
import {promises as fs} from 'fs';
import {AppConfig} from './models/app-config';
import * as bodyParser from 'body-parser';
import {DbService} from './services/api/db.service';
import {ApiModule} from './api/api.module';
import {AuthService} from './services/api/auth.service';
import {FrontendModule} from './frontend/frontend.module';
import * as path from 'path';
import {migrate} from './migrations';

const cwd = process.cwd();

export const configPath = path.join(cwd, 'data', 'config.json');
export const userSettingsPath = path.join(cwd, 'data', 'user-settings.json');
export const dbPath = path.join(cwd, 'data', 'drinklist.sqlite');

// Global async scope
(async () => {
  // Check and migrate config files
  await migrate();

  if (process.env.hasOwnProperty('firstStart')) {
    // Start setup website
    // import {runSetupWebsite} from './setup/setup';
    // await runSetupWebsite();
    return;
  }

  // Read config values
  const config: AppConfig = await fs.readFile(configPath, 'utf8').then(JSON.parse);

  // Initialize services
  const dbService = await DbService.create(dbPath);
  const auth = new AuthService();

  // Initialize server
  const server = new Server({
    port: config.port,
    middlewares: [
      bodyParser.json(),
    ],
    modules: [
      new ApiModule(dbService, auth),
      new FrontendModule(),
    ],
    services: [
      dbService,
      auth,
    ],
  });

  server.listen();

  process.on('SIGINT', server.shutdown());
  process.on('SIGTERM', server.shutdown());
})();
