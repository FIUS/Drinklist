// @ts-ignore -- Required feature enabled in tsconfig.express.json
import express, {Application, NextFunction, Request, Response} from 'express';
import IService from './services/service.interface';
import * as http from 'http';
import {AddressInfo} from 'net';
import ServerConfig from './models/server-config';
import IController from './interfaces/controller.interface';

class Server {

  private readonly app: Application;
  private readonly port: number;

  private readonly services: IService[];

  private server: http.Server | undefined;

  /**
   * Creates an express.js Server with configurable modules
   * @param serverConfig Configuration for the new server
   */
  constructor(serverConfig: ServerConfig) {
    this.app = express();
    this.port = serverConfig.port;
    this.app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

    this.services = serverConfig.services;

    this.registerMiddlewares(serverConfig.middlewares);
    this.registerModules(serverConfig.modules);
    this.registerErrorHandlers();
  }

  listen(): void {
    this.server = this.app.listen(this.port, () => {
      const address = this.server?.address() as AddressInfo;
      const host = address.address;
      const port = address.port;
      console.log(`[INFO] Listening at http://${host}:${port}`);
    });
  }

  // Handle server shutdown
  shutdown(): () => Promise<void> {
    return async (): Promise<void> => {
      console.log('[INFO] Shutting down services...');
      for (const service of this.services) {
        await service.shutdown();
      }
      console.log('[INFO] Services have shutdown.');
      console.log('[INFO] Closing HTTP Server...');
      this.server?.close(err => {
        if (err) {
          console.error(`Error while closing HTTP Server.\n${err}`);
        } else {
          console.log('HTTP Server closed.');
        }
        console.log('Goodbye!');
        process.exit(0);
      });
    };
  }

  private registerMiddlewares(middlewares: any[]): void {
    for (const middleware of middlewares) {
      this.app.use(middleware);
    }
  }

  private registerModules(modules: IController[]): void {
    for (const module of modules) {
      this.app.use(module.path, module.router);
    }
  }

  private registerErrorHandlers(): void {
    // 404 handler
    this.app.use((req, res, next) => {
      res.sendStatus(404);
    });

    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      res.sendStatus(err.status || 500);
    });
  }
}

export default Server;
