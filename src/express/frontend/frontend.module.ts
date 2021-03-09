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
    this.settings = JSON.parse(fs.readFileSync(`${this.rootDir}/data/user-settings.json`, 'utf-8'));
  }

  private initRoutes(): void {
    this.router.get('/settings', this.getSettings);
    this.router.post('/settings', this.saveSettings);
    this.router.get('/legal', this.getLegal);
    this.router.get('/imprint', this.getImprint);
    this.router.use(express.static(`${this.rootDir}/dist/angular`));
    // Angular rewrites
    this.router.get('/', this.getIndex);
    this.router.get('/*', this.getIndex);
  }

  private getSettings = (req: Request, res: Response) => {
    console.log('[frontend] [load] settings');
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

  private saveSettings = (req: Request, res: Response) => {
    const settings = req.body;
    if (!this.settings) {
      res.setHeader('Retry-After', '5');
      return res.status(503).end();
    }
    for (const key of Object.keys(this.settings)) {
      if (settings[key] === undefined) {
        return res.status(400).end();
      }
    }

    // If we reach this, the sent config is valid
    console.log('[settings] new user settings submitted');
    fs.writeFileSync(`${this.rootDir}/data/user-settings.json`, JSON.stringify(settings));
    this.initData();
    res.status(200).end();
  };
}

export default FrontendModule;
