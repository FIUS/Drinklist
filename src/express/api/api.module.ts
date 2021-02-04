import IController from '../interfaces/controller.interface';
import {Router} from 'express';
import DbService from '../services/api/db.service';
import AuthMiddleware from './middlewares/auth.middleware';
import AuthService from '../services/api/auth.service';
import AuthController from './controllers/auth.controller';

class ApiModule implements IController {
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
  }

  private initControllers(): void {
    this.controllers = [
      // API Controllers
      new AuthController(this.auth),
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
}

export default ApiModule;
