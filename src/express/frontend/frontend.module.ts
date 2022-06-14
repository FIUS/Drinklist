import {IController} from '../interfaces/controller.interface';
import * as express from 'express';
import {Request, Response, Router} from 'express';
import {UserSettings} from '../models/user-settings';
import * as fs from 'fs';


export class FrontendModule implements IController {
  path = '/';
  router = Router();

  private settings: UserSettings | undefined;
  private rootDir = fs.realpathSync('./');

  constructor() {
    this.initData();
    this.initRoutes();
  }

  private initData(): void {
    this.settings = JSON.parse(fs.readFileSync(`${this.rootDir}/data/user-settings.json`, 'utf-8')) as UserSettings;
  }

  private initRoutes(): void {
    this.router.get('/settings', this.getSettings);
    this.router.get('/legal', this.getLegal);
    this.router.get('/imprint', this.getImprint);
    this.router.use(express.static(`${this.rootDir}/dist/angular`));
    // Angular rewrites
    this.router.get('/', this.getIndex);
    this.router.get('/*', this.getIndex);
  }

  private getSettings = (req: Request, res: Response) => {
    console.log('[frontend] [load] settings');
    if (process.env.hasOwnProperty('settingsUpdated')) {
      this.initData();
      delete process.env.settingsUpdated;
    }

    if (process.env.hasOwnProperty('firstStart')) {
      // Allow CORS for this request only (needed for first start page)
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    if (!this.settings) {
      res.setHeader('Retry-After', '5');
      res.status(503).end();
      return;
    }
    res.status(200).json(this.settings);
  };

  private getLegal = (req: Request, res: Response) => {
    console.log('[frontend] [load] legal.html');
    res.status(200).sendFile(this.rootDir + '/data/legal.html');
  };

  private getImprint = (req: Request, res: Response) => {
    console.log('[frontend] [load] imprint.html');
    res.status(200).sendFile(this.rootDir + '/data/legal.html');
  };

  private getIndex = (req: Request, res: Response) => {
    console.log(`[frontend] [load] index.html${req.path !== '/' ? ` ${req.path}` : ''}`);
    res.status(200).sendFile(`${this.rootDir}/dist/angular/index.html`);
  };
}
