import {IController} from '../../interfaces/controller.interface';
import {Router} from 'express';

export abstract class BaseController implements IController {
  readonly router = Router();

  protected constructor(
    readonly path: string
  ) {
    this.initRoutes();
  }

  protected abstract initRoutes(): void;
}

