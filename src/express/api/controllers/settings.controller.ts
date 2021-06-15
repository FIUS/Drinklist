import IController from '../../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import {requireAdmin} from '../api.util';
import * as fs from 'fs';
import UserSettings from '../../models/user-settings';
import {userSettingsPath} from '../../main';

class SettingsController implements IController {
  path = '/settings';
  router = Router();

  private rootDir = fs.realpathSync('./');

  constructor() {
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.post('/', requireAdmin, this.saveSettings);
  }


  private saveSettings = (req: Request, res: Response) => {
    const settings = req.body;

    if (!UserSettings.isValid(settings)) {
      return res.status(400).end();
    }

    // If we reach this, the sent config is valid
    console.log('[settings] new user settings submitted');
    fs.writeFileSync(userSettingsPath, JSON.stringify(settings));
    process.env.settingsUpdated = 'true';
    res.status(200).end();
  };
}

export default SettingsController;
