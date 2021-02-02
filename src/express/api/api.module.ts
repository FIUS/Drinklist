import IController from '../interfaces/controller.interface';
import {Router} from 'express';
import DbService from '../services/api/db.service';

class ApiModule implements IController {
  path = '/api';
  router = Router();

  private controllers: IController[] = [];

  constructor(
    private dbService: DbService
  ) {
    this.initControllers();
    this.registerControllers();
  }

  private initControllers(): void {
    this.controllers = [
      // API Controllers
    ];
  }

  private registerControllers(): void {
    for (const controller of this.controllers) {
      this.router.use(controller.path, controller.router);
    }
  }
}

export default ApiModule;
