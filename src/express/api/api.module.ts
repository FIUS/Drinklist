import {IController} from '../interfaces/controller.interface';
import {NextFunction, Request, Response, Router} from 'express';
import {DbService} from '../services/api/db.service';
import {AuthMiddleware} from './middlewares/auth.middleware';
import {AuthService} from '../services/api/auth.service';
import {AuthController} from './controllers/auth.controller';
import {UserController} from './controllers/user.controller';
import {UserService} from './services/user.service';
import {BeveragesController} from './controllers/beverages.controller';
import {BeveragesService} from './services/beverages.service';
import {requireAdmin} from './api.util';
import {exec} from 'child_process';
import {StatsController} from './controllers/stats.controller';
import {StatsService} from './services/stats.service';
import {SettingsController} from './controllers/settings.controller';
import {dbPath} from '../main';
import {TransactionsService} from './services/transactions.service';
import {TransactionsController} from './controllers/transactions.controller';

export class ApiModule implements IController {
  path = '/api';
  router = Router();

  private controllers: IController[] = [];

  constructor(
    private dbService: DbService,
    private auth: AuthService,
  ) {
    this.registerMiddlewares();
    this.initControllers();
    this.registerControllers();
    this.registerBackupEndpoint();
    this.router.use('/*', (req, res) => {
      res.status(404).end();
    });
  }

  private initControllers(): void {
    // Create Module Services
    const userService = new UserService(this.dbService);
    const txService = new TransactionsService(this.dbService);
    const beveragesService = new BeveragesService(this.dbService);
    const statsService = new StatsService(this.dbService);

    this.controllers = [
      // API Controllers
      new AuthController(this.auth),
      new UserController(userService),
      new TransactionsController(txService),
      new BeveragesController(beveragesService),
      new StatsController(statsService),
      new SettingsController(),
    ];
  }

  private registerControllers(): void {
    for (const controller of this.controllers) {
      this.router.use(controller.path, controller.router);
    }
  }

  private registerMiddlewares(): void {
    this.router.use(AuthMiddleware.token(this.auth));
  }

  private registerBackupEndpoint(): void {
    this.router.get('/backup', requireAdmin, (req: Request, res: Response, next: NextFunction) => {
      let result = '';

      const dump = exec(`sqlite3 ${dbPath} ".dump"`, {maxBuffer: 1024 * 1024 * 5}, error => {
        if (!error) {
          return;
        }
        next(error);
      });
      dump.stdout?.on('data', data => {
        result += data.toString();
      });
      dump.on('close', code => {
        if (code === 0) {
          res.status(200).contentType('text/plain').send(result);
        }
      });
    });
  }
}
