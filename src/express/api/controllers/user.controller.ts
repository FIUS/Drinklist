import IController from '../../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import UserService from '../services/user.service';
import {requireAdmin, requireUser} from '../api.util';

class UserController implements IController {
  path = '/users';
  router = Router();

  constructor(
    private userService: UserService
  ) {
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get('/', requireUser, this.users);
    this.router.get('/:name', requireUser, this.getUser);
    this.router.post('/:name', requireAdmin, this.postUser);
    this.router.patch('/:name', requireAdmin, this.patchUser);
    this.router.delete('/:name', requireAdmin, this.deleteUser);
    this.router.post('/:name/hide', requireAdmin, this.hideUser);
    this.router.post('/:name/show', requireAdmin, this.showUser);
  }

  // Route Handlers
  users = (req: Request, res: Response) => {
    const users = this.userService.getUsers(req.header('x-auth-state') === 'admin');
    res.status(200).json(users);
  };

  getUser = (req: Request, res: Response) => {
    const name = req.params.name;
    if (name === undefined || name === '') {
      res.status(404).end();
      return;
    }
    const user = this.userService.getUser(name);
    if (user === undefined) {
      res.status(404).end();
      return;
    }
    res.status(200).json(user);
  };

  postUser = (req: Request, res: Response) => {
    const name = req.params.name;
    if (name === undefined || name === '') {
      res.status(400).end();
      return;
    }
    this.userService.createUser(name);
    res.status(200).end();
  };

  hideUser = (req: Request, res: Response) => {
    const name = req.params.name;
    if (name === undefined || name === '') {
      res.status(400).end();
      return;
    }
    this.userService.setVisibility(true, name);
    res.status(200).end();
  };

  showUser = (req: Request, res: Response) => {
    const name = req.params.name;
    if (name === undefined || name === '') {
      res.status(400).end();
      return;
    }
    this.userService.setVisibility(false, name);
    res.status(200).end();
  };

  patchUser = (req: Request, res: Response) => {
    const name = req.params.name;
    const reason = req.body.reason as string;
    const amount = +req.body.amount;
    if (name === undefined || name === '' || reason === undefined || reason === '' || amount === undefined) {
      res.status(400).end();
      return;
    }
    this.userService.updateBalance(name, reason, amount);
    res.status(200).end();
  };

  deleteUser = (req: Request, res: Response) => {
    const name = req.params.name;
    if (name === undefined || name === '') {
      res.status(400).end();
      return;
    }
    this.userService.deleteUser(name);
    res.status(200).end();
  };
}

export default UserController;
