import {IController} from '../../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import {UserService} from '../services/user.service';
import {asyncHandler, requireAdmin, requireUser} from '../api.util';

export class UserController implements IController {
  path = '/users';
  router = Router();

  constructor(
    private userService: UserService
  ) {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.get('/', requireUser, asyncHandler(this.users));
    this.router.post('/', requireAdmin, asyncHandler(this.postUser));
    this.router.get('/:id', requireUser, asyncHandler(this.getUser));
    this.router.delete('/:id', requireAdmin, asyncHandler(this.deleteUser));
    this.router.post('/:id/hide', requireAdmin, asyncHandler(this.hideUser));
    this.router.post('/:id/show', requireAdmin, asyncHandler(this.showUser));
  }

  // Route Handlers
  private users = async (req: Request, res: Response) => {
    const users = await this.userService.getUsers(req.header('x-auth-state') === 'admin');
    res.status(200).json(users);
  };

  private getUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(404).end();
      return;
    }
    const user = await this.userService.getUser(id);
    if (user === undefined) {
      res.status(404).end();
      return;
    }
    res.status(200).json(user);
  };

  private postUser = async (req: Request, res: Response) => {
    const name = req.body.name;
    if (name === undefined || name === '') {
      res.status(400).end();
      return;
    }
    await this.userService.createUser(name);
    res.status(200).end();
  };

  private hideUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).end();
      return;
    }
    await this.userService.setVisibility(true, id);
    res.status(200).end();
  };

  private showUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).end();
      return;
    }
    await this.userService.setVisibility(false, id);
    res.status(200).end();
  };

  private deleteUser = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).end();
      return;
    }
    await this.userService.deleteUser(id);
    res.status(200).end();
  };
}
