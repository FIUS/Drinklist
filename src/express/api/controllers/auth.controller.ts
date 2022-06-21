import {IController} from '../../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import {AuthService} from '../../services/api/auth.service';
import {requireAdmin} from '../api.util';
import {Session} from '../../models/api/session';

export class AuthController implements IController {
  path = '/auth';
  router = Router();

  constructor(
    private auth: AuthService,
  ) {
    this.initRoutes();
  }

  initRoutes(): void {
    this.router.get('/tokens', requireAdmin, this.tokens);
    this.router.post('/login', this.login);
    this.router.post('/logout', this.logout);
    this.router.post('/revoke', requireAdmin, this.revoke);
  }

  tokens = (req: Request, res: Response) => {
    res.status(200).json(this.auth.getSessions());
  };

  login = (req: Request, res: Response) => {
    const password = req.body.password as string;
    if (password === undefined) {
      console.log('[FAIL] [login] no password');
      res.status(400).end();
      return;
    }
    const session = new Session(
      req.header('user-agent') || 'User-Agent not specified',
      req.header('referrer') || 'Referrer not specified',
      req.ip
    );
    if (this.auth.login(password, session)) {
      res.status(200).send(session.token);
      return;
    }
    res.status(401).end();
  };

  logout = (req: Request, res: Response) => {
    const token = req.body.token as string;

    if (token === undefined || token === '') {
      res.status(400).end();
      return;
    }

    this.auth.logout(token);
    res.status(200).end();
  };

  revoke = (req: Request, res: Response) => {
    const token = '' + req.body.token;

    if (token === undefined || token === '') {
      res.status(400).end();
      return;
    }

    this.auth.revoke(token);
    res.status(200).end();
  }
}
