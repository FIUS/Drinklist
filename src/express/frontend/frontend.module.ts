import IController from '../interfaces/controller.interface';
import * as express from 'express';
import {Request, Response, Router} from 'express';
import UserSettings from '../models/user-settings';
import * as fs from 'fs';


class FrontendModule implements IController {
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
    // Migrate old setting values
    if (Object.prototype.hasOwnProperty.call(this.settings, 'data-protection')) {
      // @ts-ignore
      this.settings.dataProtection = this.settings['data-protection'];
      // @ts-ignore
      delete this.settings['data-protection'];
    }
    if (Object.prototype.hasOwnProperty.call(this.settings, 'recently-purchased')) {
      // @ts-ignore
      this.settings.recentlyPurchased = this.settings['recently-purchased'];
      // @ts-ignore
      delete this.settings['recently-purchased'];
    }
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
    if (!this.settings) {
      res.setHeader('Retry-After', '5');
      return res.status(503).end();
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

export default FrontendModule;
